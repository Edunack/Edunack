use std::collections::HashMap;

use argon2::{password_hash::SaltString, Argon2, PasswordHash, PasswordHasher, PasswordVerifier};
use axum::{
    extract::{FromRef, State},
    http::{HeaderMap, HeaderName, HeaderValue, StatusCode},
    response::{IntoResponse, Response},
    routing::post,
    Form, Json, Router,
};
use rand::rngs::OsRng;
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
    pub async fn login(State(state): State<AppState>, Json(params): Json<LoginParams>) -> Response {
        let db: RwLockReadGuard<Database> = state.database.read().await;
        let user_db = db.user();
        let user = match user_db.find_by_username(&params.login).await {
            Some(user) => user,
            None => match user_db.find_by_email(&params.login).await {
                Some(user) => user,
                None => {
                    return (StatusCode::UNAUTHORIZED, "Wrong username or password").into_response()
                }
            },
        };

        match Argon2::default().verify_password(
            params.password.as_bytes(),
            &PasswordHash::new(&user.password).unwrap(),
        ) {
            Ok(_) => {}
            Err(_) => {
                return (StatusCode::UNAUTHORIZED, "Wrong username or password").into_response()
            }
        }

        let res = match auth::encode_jwt(&user.email) {
            Ok(res) => res,
            Err(_) => return StatusCode::INTERNAL_SERVER_ERROR.into_response(),
        };

        (
            StatusCode::OK,
            HeaderMap::try_from(&HashMap::from([(
                http::header::SET_COOKIE,
                HeaderValue::from_str(format!("Authorization={}; Path=/; HttpOnly", res).as_str())
                    .unwrap(),
            )]))
            .unwrap(),
        )
            .into_response()
    }

    pub async fn register(
        State(state): State<AppState>,
        Json(params): Json<RegisterParams>,
    ) -> Response {
        let db: RwLockReadGuard<Database> = state.database.read().await;
        let user_db = db.user();
        if user_db.exists_by_username_or_email(&params.username).await {
            return (StatusCode::BAD_REQUEST, "Username").into_response();
        } else if user_db.exists_by_username_or_email(&params.email).await {
            return (StatusCode::BAD_REQUEST, "Email").into_response();
        }
        let id = Uuid::new_v4();

        let salt = SaltString::generate(&mut OsRng);

        let password = match Argon2::default().hash_password(params.password.as_bytes(), &salt) {
            Ok(pass) => pass.to_string(),
            Err(_) => return StatusCode::INTERNAL_SERVER_ERROR.into_response(),
        };

        match user_db
            .insert(&User {
                id,
                username: params.username.clone(),
                email: params.email.clone(),
                password,
            })
            .await
        {
            Ok(_) => StatusCode::CREATED.into_response(),
            Err(_) => StatusCode::INTERNAL_SERVER_ERROR.into_response(),
        }
    }

    pub async fn logout() -> Response {
        (
            StatusCode::OK,
            HeaderMap::try_from(&HashMap::from([(
                http::header::SET_COOKIE,
                HeaderValue::from_static(r#"Authorization="";"#),
            )]))
            .unwrap(),
        )
            .into_response()
    }
}

impl IntoRouter for LoginRouter {
    fn into_router(self) -> Router<AppState> {
        Router::new()
            .route("/login", post(Self::login))
            .route("/register", post(Self::register))
    }
}
