use super::IntoRouter;
use crate::AppState;
use axum::Router;

mod favorites;

pub(crate) struct UserRouter;

impl IntoRouter for UserRouter {
    fn into_router(self) -> axum::Router<AppState> {
        Router::new()
            .nest("/favorites", favorites::UserFavoritesRouter.into_router())
    }
}
