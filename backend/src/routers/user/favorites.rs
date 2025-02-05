use crate::{
    auth::Claims,
    db::user::favorites::UserFavoritesTable,
    AppState,
};

use axum::{
    extract::State,
    middleware,
    response::{IntoResponse, Response},
    routing::{delete, get, post},
    Extension, Json, Router,
};

pub(super) struct UserFavoritesRouter;

impl UserFavoritesRouter {
    pub async fn favorite_get(
        State(state): State<AppState>,
        Extension(ext): Extension<Claims>,
    ) -> Response {
        let favorites_table = UserFavoritesTable::new(state.database.get_conn());

        return Json(
            favorites_table
                .find_all_by_user(ext.data.id)
                .await
                .into_iter()
                .map(|c| c.course)
                .collect::<Vec<_>>(),
        )
        .into_response();
    }

    pub async fn favorite_post(
        State(state): State<AppState>,
        Extension(ext): Extension<Claims>,
    ) -> Response {
        todo!()
    }

    pub async fn favorite_delete(
        State(state): State<AppState>,
        Extension(ext): Extension<Claims>,
    ) -> Response {
        todo!()
    }
}

impl Into<Router<AppState>> for UserFavoritesRouter {
    fn into(self) -> axum::Router<AppState> {
        Router::new()
            .route("/", get(Self::favorite_get))
            .route("/", post(Self::favorite_post))
            .route("/", delete(Self::favorite_delete))
            .layer(middleware::from_fn(crate::auth::force_authorize))
    }
}
