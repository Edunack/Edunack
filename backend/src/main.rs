use axum::{extract::Request, http::Method, routing::get, Router, ServiceExt};
use tokio::net::TcpListener;
use tower::ServiceBuilder;
use tower_http::{
    cors::{Any, CorsLayer},
    normalize_path::NormalizePath,
    services::ServeDir,
};

struct SthRouter;

impl SthRouter {
    pub async fn root() -> String {
        "root".to_string()
    }
}

impl IntoRouter for SthRouter {
    fn into_router(self) -> axum::Router {
        Router::new().route("/", get(Self::root))
    }
}

pub trait IntoRouter {
    fn into_router(self) -> axum::Router;
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .nest(
            "/api",
            Router::new()
                .nest("/sth", SthRouter.into_router())
                .nest("/sth2", SthRouter.into_router()),
        )
        .nest_service("/", ServeDir::new("../frontend/dist"))
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
