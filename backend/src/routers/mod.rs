use axum::{routing::get, Router};
pub mod login;
pub mod search;
pub mod rate;

use crate::AppState;

pub struct ExampleRouter;

impl ExampleRouter {
    pub async fn root() -> String {
        "root".to_string()
    }
}

impl IntoRouter for ExampleRouter {
    fn into_router(self) -> axum::Router<AppState> {
        Router::new().route("/", get(Self::root))
    }
}

pub trait IntoRouter {
    fn into_router(self) -> axum::Router<AppState>;
}

