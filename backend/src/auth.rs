use axum::{extract::Request, http::StatusCode, middleware::Next, response::Response};
use tokio::sync::OnceCell;

use jsonwebtoken::{encode, DecodingKey, EncodingKey, Header, TokenData, Validation};
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Claims {
    exp: usize,
    iat: usize,
    email: String,
}

pub static SECRET: OnceCell<String> = OnceCell::const_new();

pub fn encode_jwt(email: &str) -> Result<String, ()> {
    let now = chrono::Utc::now();
    let delta = chrono::Duration::days(1);
    let exp = (now + delta).timestamp() as usize;
    let iat = now.timestamp() as usize;
    let claims = Claims {
        exp,
        iat,
        email: email.to_string(),
    };
    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(SECRET.get().unwrap().as_ref()),
    )
    .map_err(|_| ())
}

pub fn decode_jwt(token: &str) -> Result<TokenData<Claims>, ()> {
    let decoded = jsonwebtoken::decode::<Claims>(
        token,
        &DecodingKey::from_secret(SECRET.get().unwrap().as_ref()),
        &Validation::default(),
    )
    .map_err(|_| ())?;

    Ok(decoded)
}

pub async fn authorize(request: Request, next: Next) -> Result<Response, StatusCode> {
    println!("{}", request.uri());

    Err(StatusCode::IM_A_TEAPOT)
//    Ok(next.run(request).await)
}
