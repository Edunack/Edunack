use axum::{extract::Request, http::StatusCode, middleware::Next, response::Response};
use axum_extra::extract::cookie::CookieJar;
use tokio::sync::OnceCell;

use jsonwebtoken::{encode, DecodingKey, EncodingKey, Header, TokenData, Validation};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct GenericClaims<T> {
    exp: usize,
    iat: usize,
    #[serde(flatten)]
    pub data: T,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct ClaimsData {
    pub id: Uuid,
    pub purpose: String,
}

pub type Claims = GenericClaims<ClaimsData>;

pub static SECRET: OnceCell<String> = OnceCell::const_new();

impl<T> GenericClaims<T> {
    pub fn new(data: T, delta: chrono::Duration) -> Self {
        Self {
            exp: (chrono::Utc::now() + delta).timestamp() as usize,
            iat: chrono::Utc::now().timestamp() as usize,
            data,
        }
    }

    pub fn encode(&self) -> Result<String, ()> where T: Serialize {
        encode(
            &Header::default(),
            self,
            &EncodingKey::from_secret(SECRET.get().unwrap().as_ref()),
        ).map_err(|_| ())
    }

    pub fn decode(token: &str) -> Result<T, ()> where T: for<'de> Deserialize<'de> {
        let data: TokenData<Self> = jsonwebtoken::decode::<Self>(
            token,
            &DecodingKey::from_secret(SECRET.get().unwrap().as_ref()),
            &Validation::default(),
        )
        .map_err(|_e| { /*println!("{:?}", _e)*/ })?;

        if data.claims.exp < chrono::Utc::now().timestamp() as usize {
            return Err(());
        }
        Ok(data.claims.data)
    }
}

pub async fn authorize(
    jar: CookieJar,
    mut request: Request,
    next: Next,
) -> Result<Response, StatusCode> {
    println!("{}", request.uri());

    let get_auth = |jar: CookieJar| -> Option<Claims> {
        Some(GenericClaims::decode(jar.get("Authorization")?.value()).ok()?)
    };
    request.extensions_mut().insert(get_auth(jar));

    Ok(next.run(request).await)
}

pub async fn force_authorize(mut request: Request, next: Next) -> Result<Response, StatusCode> {
    let ext: Option<Claims> = request.extensions_mut().remove::<Option<Claims>>().unwrap();
    match ext {
        Some(ext) => {
            request.extensions_mut().insert(ext);
            Ok(next.run(request).await)
        }
        None => Err(StatusCode::UNAUTHORIZED),
    }
}
