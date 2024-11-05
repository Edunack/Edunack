use std::sync::Arc;

use axum::{extract::Request, http::{Method, StatusCode, Uri}, middleware, Router, ServiceExt};
use db::Database;
use login::LoginRouter;
use rand::Rng;
use router::{ExampleRouter, IntoRouter};
use sqlx::SqlitePool;
use tokio::{net::TcpListener, sync::RwLock};
use tower::ServiceBuilder;
use tower_http::{
    cors::{Any, CorsLayer},
    normalize_path::NormalizePath,
    services::{ServeDir, ServeFile},
};
mod auth;
mod db;
mod login;
mod router;
mod user;

#[derive(Clone)]
pub struct AppState {
    database: Arc<RwLock<Database>>,
}

#[tokio::main]
async fn main() {
    auth::SECRET
        .get_or_init(|| async {
            let secret = std::env::var("SECRET").unwrap_or_else(|_| {
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
    let conn = SqlitePool::connect("sqlite://db.sqlite").await.unwrap();

    let state = AppState {
        database: Arc::new(RwLock::new(Database::new(conn))),
    };

    let app = Router::new()
        //.fallback(|uri: Uri| async move {
        //    (StatusCode::NOT_FOUND, format!("No route for {uri}"))
        //})
        .nest(
            "/api",
            Router::new()
                .nest("/sth", ExampleRouter.into_router())
                .nest("/sth2", ExampleRouter.into_router())
                .nest("/", LoginRouter.into_router())
                .layer(middleware::from_fn(auth::authorize))
        )
        .nest_service("/", ServeFile::new("../frontend/dist/index.html"))
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
