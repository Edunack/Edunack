use axum::{extract::State, http::StatusCode, response::IntoResponse, routing::post, Json, Router};
use serde::{Deserialize, Serialize};
use tokio::sync::RwLockReadGuard;
use uuid::Uuid;

use crate::{auth, db::Database, router::IntoRouter, user::User, AppState};

pub struct LoginRouter;

#[derive(Serialize, Deserialize)]
pub struct LoginParams {
    #[serde(alias = "username", alias = "email")]
    pub login: String,
    pub password: String,
}

#[derive(Serialize, Deserialize)]
pub struct RegisterParams {
    pub username: String,
    pub email: String,
    pub password: String,
}

impl LoginRouter {
    pub async fn login(
        State(state): State<AppState>,
        Json(params): Json<LoginParams>,
    ) -> Result<Json<String>, StatusCode> {
        let db: RwLockReadGuard<Database> = state.database.read().await;
        let user = match db.find_user_by_username(&params.login).await {
            Some(user) => user,
            None => match db.find_user_by_email(&params.login).await {
                Some(user) => user,
                None => return Err(StatusCode::UNAUTHORIZED),
            },
        };

        if !bcrypt::verify(params.password, &user.password)
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        {
            return Err(StatusCode::UNAUTHORIZED);
        }

        let res = auth::encode_jwt(&user.email)
            .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

        Ok(Json(res))
    }

    pub async fn register(State(state): State<AppState>, Json(params): Json<RegisterParams>) -> Result<impl IntoResponse, StatusCode> {
        let db: RwLockReadGuard<Database> = state.database.read().await;

        if db.find_user_by_username(&params.username).await.is_some() {
            return Err(StatusCode::BAD_REQUEST);
        }
        let id = Uuid::new_v4();
        match db.insert_user(&User {
            id,
            username: params.username.clone(),
            email: params.email.clone(),
            password: bcrypt::hash(params.password.clone(), bcrypt::DEFAULT_COST).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?
        }).await {
            Ok(_) => {Ok(StatusCode::CREATED)},
            Err(_) => {Err(StatusCode::INTERNAL_SERVER_ERROR)}
        }
    }
}

impl IntoRouter for LoginRouter {
    fn into_router(self) -> Router<AppState> {
        Router::new()
            .route("/login", post(Self::login))
            .route("/register", post(Self::register))
    }
}
