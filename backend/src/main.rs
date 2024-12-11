use std::{str::FromStr, sync::Arc};

use axum::{extract::Request, http::Method, middleware, Router, ServiceExt};
use db::{ConnectionExt, Database};
use rand::Rng;
use routers::{login::LoginRouter, rate::RateRouter, search::SearchRouter, IntoRouter};
use sqlx::sqlite::{SqliteConnectOptions, SqlitePoolOptions};
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

    let pool = SqlitePoolOptions::new()
        .before_acquire(|conn, _| {
            Box::pin(async move { conn.register_functions().await.map(|_| true) })
        })
        .connect_with(
            SqliteConnectOptions::from_str(
                dotenvy::var("DATABASE")
                    .unwrap_or("sqlite://dev.sqlite".to_string())
                    .as_str(),
            )
            .unwrap()
            .pragma(
                "key",
                dotenvy::var("DATABASE_KEY").unwrap_or("secret".to_string()),
            ),
        )
        .await
        .unwrap();

    let state = AppState {
        database: Database::new(Arc::new(pool)),
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
                .nest("/rating", RateRouter.into_router())
                .layer(middleware::from_fn(auth::authorize)),
        )
        .nest_service("/", ServeFile::new("../frontend/dist/index.html"))
        .nest_service("/example", ServeDir::new("./example"))
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
