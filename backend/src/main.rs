use std::sync::{Arc, RwLock};

use axum::{extract::Request, http::Method, middleware, BoxError, Router, ServiceExt};
use db::Database;
use rand::Rng;
use regex::Regex;
use routers::{login::LoginRouter, search::SearchRouter, IntoRouter};
use rusqlite::Connection;
use tokio::net::TcpListener;
use tower::ServiceBuilder;
use tower_http::{
    cors::{Any, CorsLayer},
    normalize_path::NormalizePath,
    services::{ServeDir, ServeFile},
};
mod auth;
mod db;
mod routers;

#[derive(Clone)]
pub struct AppState {
    database: Database,
}

unsafe impl Send for AppState {}

unsafe impl Sync for AppState {}

#[tokio::main]
async fn main() {
    auth::SECRET
        .get_or_init(|| async {
            let secret = dotenvy::var("JWT_SECRET").unwrap_or_else(|_| {
                rand::thread_rng()
                    .sample_iter(rand::distributions::Alphanumeric)
                    .take(64)
                    .map(char::from)
                    .collect()
            });
            println!("SECRET: {}", secret);
            secret
        })
        .await;
    let conn =
        Connection::open(dotenvy::var("DATABASE").unwrap_or("dev.sqlite".to_string())).unwrap();
    //SqlitePool::connect(&dotenvy::var("DATABASE").unwrap_or("sqlite://dev.sqlite".to_string()))
    //    .await
    //    .unwrap();
    let _ = conn.pragma_update(
        None,
        "key",
        dotenvy::var("DATABASE_KEY").unwrap_or("secret".to_string()),
    );
    let _ = conn.create_scalar_function(
        "regexp",
        2,
        rusqlite::functions::FunctionFlags::SQLITE_UTF8
            | rusqlite::functions::FunctionFlags::SQLITE_DETERMINISTIC,
        move |ctx| {
            assert_eq!(ctx.len(), 2, "called with unexpected number of arguments");
            let regexp: Arc<Regex> = ctx.get_or_create_aux(0, |vr| -> Result<_, BoxError> {
                Ok(Regex::new(vr.as_str()?)?)
            })?;
            let is_match = {
                let text = ctx
                    .get_raw(1)
                    .as_str()
                    .map_err(|e| rusqlite::Error::UserFunctionError(e.into()))?;

                regexp.is_match(text)
            };

            Ok(is_match)
        },
    ).unwrap();
    //conn.execute(
    //    format!(
    //        "PRAGMA key = '{}'",
    //        dotenvy::var("DATABASE_KEY").unwrap_or("secret".to_string())
    //    )
    //    .as_str(),
    //)
    //.await
    //.unwrap();

    let state = AppState {
        database: Database::new(Arc::new(RwLock::new(conn))),
    };

    let app = Router::new()
        //.fallback(|uri: Uri| async move {
        //    (StatusCode::NOT_FOUND, format!("No route for {uri}"))
        //})
        .nest(
            "/api",
            Router::new()
                //                .nest("/sth", ExampleRouter.into_router())
                //                .nest("/sth2", ExampleRouter.into_router())
                .nest("/", LoginRouter.into_router())
                .nest("/search", SearchRouter.into_router())
                .layer(middleware::from_fn(auth::authorize)),
        )
        .nest_service("/", ServeFile::new("../frontend/dist/index.html"))
        .nest_service("/google", ServeFile::new("./index.html"))
        .nest_service("/assets", ServeDir::new("../frontend/dist/assets"))
        .nest_service("/img", ServeDir::new("../frontend/img"))
        .with_state(state)
        .layer(
            ServiceBuilder::new().layer(
                CorsLayer::new()
                    .allow_methods([Method::GET, Method::POST])
                    .allow_origin(Any),
            ),
        );
    let app = NormalizePath::trim_trailing_slash(app);
    let listener = TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve::serve(listener, ServiceExt::<Request>::into_make_service(app))
        .await
        .unwrap();
}
