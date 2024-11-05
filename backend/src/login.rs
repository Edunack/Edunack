use std::collections::HashMap;

use axum::{
    extract::State,
    http::{HeaderMap, HeaderName, HeaderValue, StatusCode},
    response::{IntoResponse, Response},
    routing::post,
    Form, Json, Router,
};
use jsonwebtoken::Header;
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
        Form(params): Form<LoginParams>,
    ) -> Result<Response, StatusCode> {
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

        let res = auth::encode_jwt(&user.email).map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

        let mut headers = HeaderMap::new();
        headers.insert(http::header::LOCATION, HeaderValue::from_static("/"));
        headers.insert(
            http::header::SET_COOKIE,
            HeaderValue::from_str(format!("Authorization={}; Path=/; HttpOnly", res).as_str())
                .unwrap(),
        );

        Ok((StatusCode::FOUND, headers).into_response())
    }

    pub async fn register(
        State(state): State<AppState>,
        Form(params): Form<RegisterParams>,
    ) -> Result<impl IntoResponse, StatusCode> {
        let db: RwLockReadGuard<Database> = state.database.read().await;

        if db.find_user_by_username(&params.username).await.is_some() {
            return Err(StatusCode::BAD_REQUEST);
        }
        let id = Uuid::new_v4();
        match db
            .insert_user(&User {
                id,
                username: params.username.clone(),
                email: params.email.clone(),
                password: bcrypt::hash(params.password.clone(), bcrypt::DEFAULT_COST)
                    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?,
            })
            .await
        {
            Ok(_) => {
                let mut headers = HeaderMap::new();
                headers.insert(http::header::LOCATION, HeaderValue::from_static("/login"));
                Ok((StatusCode::FOUND, headers).into_response())
            }
            Err(_) => Err(StatusCode::INTERNAL_SERVER_ERROR),
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
