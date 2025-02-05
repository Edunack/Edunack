use std::collections::HashMap;

use argon2::{password_hash::SaltString, Argon2, PasswordHash, PasswordHasher, PasswordVerifier};
use axum::{
    body::Bytes, extract::State, http::{HeaderMap, HeaderValue, StatusCode}, response::{IntoResponse, Response}, routing::post, Json, Router
};
use axum_extra::extract::cookie::Cookie;
use http::header;
use lettre::{message::Mailbox, AsyncTransport};
use rand::rngs::OsRng;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::{
    auth::{Claims, ClaimsData},
    db::user::{User, UserTable},
    AppState,
};

pub struct AuthRouter;

#[derive(Deserialize)]
pub struct LoginParams {
    #[serde(alias = "username", alias = "email")]
    pub login: String,
    pub password: String,
}

#[derive(Serialize)]
pub struct LoginResponse {
    pub id: Uuid,
    pub username: String,
    pub email: String,
}

#[derive(Deserialize)]
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


        let res = match Claims::new(ClaimsData {
            id: user.id,
            purpose: "auth".to_string(),
        }, chrono::Duration::days(30)).encode() {
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
        headers: HeaderMap,
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

        let email: Mailbox = match params.email.clone().parse() {
            Ok(email) => email,
            Err(e) => {
                println!("Invalid email: {e}");
                return (StatusCode::BAD_REQUEST, "Email").into_response();
            }
        };

        match user_table
            .insert(&User {
                id,
                username: params.username.clone(),
                email: email.to_string(),
                password,
                verified: false,
            })
            .await
        {
            Ok(_) => {}
            Err(error) => {
                println!("{error:?}");
                return StatusCode::INTERNAL_SERVER_ERROR.into_response();
            }
        };

        let token = match Claims::new(ClaimsData {
            id,
            purpose: "verify".to_string(),
        }, chrono::Duration::days(1)).encode() {
            Ok(token) => token,
            Err(error) => {
                println!("{error:?}");
                return StatusCode::INTERNAL_SERVER_ERROR.into_response();
            }
        };
        let message = lettre::Message::builder()
            .to(email)
            .from("Edunack <noreply@edunack.eu>".parse().unwrap())
            .subject("Verify your account")
            .body(format!(
                "Please verify your account: http://{}/example/verify.html?token={token}",
                headers
                    .get("host")
                    .map(|host| host.to_str().unwrap())
                    .unwrap_or("edunack.eu"),
            ))
            .unwrap();

        match email_transport.send(message).await {
            Ok(_) => {}
            Err(error) => {
                if cfg!(debug_assertions) {
                    println!("{error:?}");
                } else {
                    return (StatusCode::INTERNAL_SERVER_ERROR, error.to_string()).into_response();
                }
            }
        }

        StatusCode::OK.into_response()
    }

    pub async fn verify(
        State(AppState { database, .. }): State<AppState>,
        headers: HeaderMap,
        body: Bytes
    ) -> Response {
        let Some(content_type) = headers.get("content-type") else {
            return StatusCode::BAD_REQUEST.into_response();
        };

        let token = match content_type.to_str() {
            Ok("text/plain") => {
                String::from_utf8(body.to_vec()).unwrap()
            }
            Ok("application/json") => {
                let json = serde_json::from_slice::<HashMap<String, String>>(&body).unwrap();
                json.get("token").unwrap().clone()
            }
            _ => return StatusCode::BAD_REQUEST.into_response(),
        };

        let claims = match Claims::decode(&token) {
            Ok(claims) => claims,
            Err(_) => return StatusCode::BAD_REQUEST.into_response(),
        };

        if claims.purpose != "verify" {
            return StatusCode::BAD_REQUEST.into_response();
        }

        let user_table = UserTable::new(database.get_conn());

        let user = match user_table
            .find_by_id(claims.id)
            .await
        {
            Some(user) => user,
            None => return StatusCode::INTERNAL_SERVER_ERROR.into_response(),
        };
        match user_table
            .update(&User { verified: true, ..user })
            .await {
            Ok(_) => StatusCode::OK,
            Err(error) => {
                println!("{error:?}");
                StatusCode::INTERNAL_SERVER_ERROR
            },
        }.into_response()
    }

    pub async fn change_password() -> Response {
        StatusCode::OK.into_response()
    }

    pub async fn forgot_password() -> Response {
        StatusCode::OK.into_response()
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
            .route("/verify", post(Self::verify))
    }
}
