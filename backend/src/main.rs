use std::{str::FromStr, sync::Arc};

use axum::{extract::Request, http::Method, middleware, Router, ServiceExt};
use db::{ConnectionExt, Database};
use lettre::{
    message::Mailbox, transport::smtp::authentication::Credentials, Address, AsyncSmtpTransport,
    AsyncTransport, Message,
};
use rand::Rng;
use rankers::Ranker;
use routers::{auth::AuthRouter, rate::RateRouter, search::SearchRouter, user::UserRouter};
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
mod rankers;
mod routers;

#[derive(Clone)]
pub struct AppState {
    rankers: Vec<Arc<dyn Ranker>>,
    database: Database,
    email_transport: Arc<lettre::AsyncSmtpTransport<lettre::Tokio1Executor>>,
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
            Box::pin(async move { conn.before_acquire().await.map(|_| true) })
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
            )
            .pragma("foreign_keys", "ON"),
        )
        .await
        .unwrap();
    let smtp_conn = AsyncSmtpTransport::<lettre::Tokio1Executor>::relay(
        &dotenvy::var("SMTP_HOST").unwrap_or("localhost".to_string()),
    )
    .unwrap()
    .credentials(Credentials::new(
        dotenvy::var("SMTP_USER").unwrap_or("".to_string()),
        dotenvy::var("SMTP_PASS").unwrap_or("".to_string()),
    ))
    .build();

    match smtp_conn.test_connection().await {
        Ok(_) => {}
        Err(_) => {
            println!("SMTP connection failed");
        }
    }
    let state = AppState {
        rankers: vec![
            Arc::new(rankers::coursera::CourseraRanker::env()),
            Arc::new(rankers::youtube::YoutubeRanker::env()),
        ],
        database: Database::new(Arc::new(pool)),
        email_transport: Arc::new(smtp_conn),
    };
    //state.email_transport.clone().send(
    //    Message::builder()
    //    .to(Mailbox::new(None, "mail".parse().unwrap()))
    //    .from(Mailbox::new(Some("Edunack".to_string()), "noreply@edunack.eu".parse().unwrap()))
    //    .subject("test")
    //    .body(String::from("test"))
    //    .unwrap(),
    //).await.unwrap();

    let app = Router::new()
        //.fallback(|uri: Uri| async move {
        //    (StatusCode::NOT_FOUND, format!("No route for {uri}"))
        //})
        .fallback_service(ServeFile::new("../frontend/dist/index.html"))
        .nest(
            "/api",
            Router::new()
                .nest("/auth", AuthRouter.into())
                .nest("/search", SearchRouter.into())
                .nest("/rating", RateRouter.into())
                .nest("/user", UserRouter.into())
                .layer(middleware::from_fn(auth::authorize)),
        )
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
    let port = dotenvy::var("PORT").unwrap_or("3000".to_string());
    let listener = TcpListener::bind(format!("0.0.0.0:{}", port))
        .await
        .unwrap();
    axum::serve::serve(listener, ServiceExt::<Request>::into_make_service(app))
        .await
        .unwrap();
}
