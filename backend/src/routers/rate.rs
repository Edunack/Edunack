use axum::{
    extract::{Path, State},
    middleware,
    response::{IntoResponse, Response},
    routing::{get, post},
    Extension, Json, Router,
};
use http::StatusCode;
use serde::Deserialize;
use uuid::Uuid;

use crate::{auth::{Claims}, db::{rating::{Rating, RatingTable}, user::UserTable}, AppState};

pub struct RateRouter;

#[derive(Deserialize)]
pub struct RatingParams {
    rating: u32,
}

impl RateRouter {
    //#[axum_macros::debug_handler]
    pub async fn post(
        State(state): State<AppState>,
        Path(course_id): Path<Uuid>,
        Extension(Claims { data: claims, .. }): Extension<Claims>,
        Json(params): Json<RatingParams>,
    ) -> Response {
        let rating_table = RatingTable::new(state.database.get_conn());
        let user_table = UserTable::new(state.database.get_conn());
        let user = match user_table.find_by_id(claims.id.clone()).await {
            Some(user) => user,
            None => return (StatusCode::INTERNAL_SERVER_ERROR, "User not found").into_response(),
        };
        if params.rating > 5 {
            return (StatusCode::BAD_REQUEST, "Invalid rating").into_response();
        }
        match rating_table
            .insert_or_update_rating(course_id, user.id, Rating(params.rating))
            .await
        {
            Ok(_) => StatusCode::OK,
            Err(e) => {
                println!("{:?}", e);
                StatusCode::INTERNAL_SERVER_ERROR
            },
        }
        .into_response()
    }

    pub async fn get(
        State(state): State<AppState>,
        Path(course_id): Path<Uuid>,
        Extension(Claims { data: claims, .. }): Extension<Claims>,
    ) -> Response {
        let rating_table = RatingTable::new(state.database.get_conn());
        let user_table = UserTable::new(state.database.get_conn());
        let user = match user_table.find_by_id(claims.id.clone()).await {
            Some(user) => user,
            None => return (StatusCode::INTERNAL_SERVER_ERROR, "User not found").into_response(),
        };
        let rating = rating_table
            .find_rating(course_id, user.id)
            .await
            .map(|r| r.0);
        (StatusCode::OK, Json(rating.unwrap_or(0))).into_response()
    }
}

impl Into<Router<AppState>> for RateRouter {
    fn into(self) -> axum::Router<AppState> {
        Router::new()
            .route("/{id}", post(Self::post))
            .route("/{id}", get(Self::get))
            .layer(middleware::from_fn(crate::auth::force_authorize))
    }
}
