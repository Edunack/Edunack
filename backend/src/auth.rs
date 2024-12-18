use axum::{extract::Request, http::StatusCode, middleware::Next, response::Response};
use axum_extra::extract::cookie::CookieJar;
use tokio::sync::OnceCell;

use jsonwebtoken::{encode, DecodingKey, EncodingKey, Header, TokenData, Validation};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Claims {
    exp: usize,
    iat: usize,
    pub id: Uuid,
}

pub static SECRET: OnceCell<String> = OnceCell::const_new();

pub fn encode_jwt(id: &Uuid) -> Result<String, ()> {
    let now = chrono::Utc::now();
    let delta = chrono::Duration::days(1);
    let exp = (now + delta).timestamp() as usize;
    let iat = now.timestamp() as usize;
    let claims = Claims {
        exp,
        iat,
        id: id.clone(),
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
    .map_err(|_e| { /*println!("{:?}", _e)*/ })?;

    Ok(decoded)
}

pub async fn authorize(
    jar: CookieJar,
    mut request: Request,
    next: Next,
) -> Result<Response, StatusCode> {
    println!("{}", request.uri());

    let get_auth = |jar: CookieJar| -> Option<Claims> {
        Some(decode_jwt(jar.get("Authorization")?.value()).ok()?.claims)
    };
    request.extensions_mut().insert(get_auth(jar));

    Ok(next.run(request).await)
}

pub async fn force_authorize(
    mut request: Request,
    next: Next,
) -> Result<Response, StatusCode> {
    let ext: Option<Claims> = request.extensions_mut().remove::<Option<Claims>>().unwrap();
    match ext {
        Some(ext) => {
            request.extensions_mut().insert(ext);
            Ok(next.run(request).await)
        }
        None => Err(StatusCode::UNAUTHORIZED),
    }
}
