use crate::AppState;
use axum::Router;

mod favorites;

pub(crate) struct UserRouter;

impl Into<Router<AppState>> for UserRouter {
    fn into(self) -> axum::Router<AppState> {
        Router::new()
            .nest("/favorites", favorites::UserFavoritesRouter.into())
    }
}
