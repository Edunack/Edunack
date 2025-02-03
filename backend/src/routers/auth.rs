use std::collections::HashMap;

use argon2::{password_hash::SaltString, Argon2, PasswordHash, PasswordHasher, PasswordVerifier};
use axum::{
    extract::State,
    http::{HeaderMap, HeaderValue, StatusCode},
    response::{IntoResponse, Response},
    routing::post,
    Json, Router,
};
use axum_extra::extract::cookie::Cookie;
use rand::rngs::OsRng;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::{
    auth,
    db::user::{User, UserTable},
    AppState,
};

pub struct AuthRouter;

#[derive(Serialize, Deserialize)]
pub struct LoginParams {
    #[serde(alias = "username", alias = "email")]
    pub login: String,
    pub password: String,
}

#[derive(Serialize, Deserialize)]
pub struct LoginResponse {
    pub id: Uuid,
    pub username: String,
    pub email: String,
}

#[derive(Serialize, Deserialize)]
pub struct RegisterParams {
    pub username: String,
    pub email: String,
    pub password: String,
}

impl AuthRouter {
    pub async fn login(State(state): State<AppState>, Json(params): Json<LoginParams>) -> Response {
        let user_table = UserTable::new(state.database.get_conn());
        let user = match user_table.find_by_username(params.login.clone()).await {
            Some(user) => user,
            None => match user_table.find_by_email(params.login.clone()).await {
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

        let res = match auth::encode_jwt(&user.id) {
            Ok(res) => res,
            Err(_) => return StatusCode::INTERNAL_SERVER_ERROR.into_response(),
        };

        (
            StatusCode::OK,
            HeaderMap::try_from(&HashMap::from([(
                http::header::SET_COOKIE,
                HeaderValue::from_str(
                    Cookie::build(("Authorization", &res))
                        .path("/")
                        .http_only(true)
                        .same_site(axum_extra::extract::cookie::SameSite::Lax)
                        .build()
                        .to_string()
                        .as_str(),
                )
                .unwrap(),
                //HeaderValue::from_str(format!("Authorization={}; Path=/; HttpOnly; SameSite=Lax", res).as_str())
                //    .unwrap(),
            )]))
            .unwrap(),
            Json(LoginResponse {
                id: user.id,
                username: user.username,
                email: user.email,
            }),
        )
            .into_response()
    }

    //#[axum_macros::debug_handler]
    pub async fn register(
        State(AppState {
            database,
            email_transport,
            ..
        }): State<AppState>,
        Json(params): Json<RegisterParams>,
    ) -> Response {
        let user_table = UserTable::new(database.get_conn());
        if let Some(user) = user_table
            .find_by_username_or_email(&params.username, &params.email)
            .await
        {
            if user.username == params.username || user.username == params.email {
                return (StatusCode::BAD_REQUEST, "Username").into_response();
            }
            return (StatusCode::BAD_REQUEST, "Email").into_response();
        }
        let id = Uuid::new_v4();

        let salt = SaltString::generate(&mut OsRng);
        let password = match Argon2::default().hash_password(params.password.as_bytes(), &salt) {
            Ok(pass) => pass.to_string(),
            Err(error) => {
                println!("{error:?}");
                return StatusCode::INTERNAL_SERVER_ERROR.into_response();
            }
        };

        match user_table
            .insert(&User {
                id,
                username: params.username.clone(),
                email: params.email.clone(),
                password,
                verified: false,
            })
            .await
        {
            Ok(_) => StatusCode::CREATED.into_response(),
            Err(error) => {
                println!("{error:?}");
                StatusCode::INTERNAL_SERVER_ERROR.into_response()
            }
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

impl Into<Router<AppState>> for AuthRouter {
    fn into(self) -> Router<AppState> {
        Router::new()
            .route("/login", post(Self::login))
            .route("/register", post(Self::register))
            .route("/logout", post(Self::logout))
    }
}
