use std::{future::Future, pin::Pin};

use axum::async_trait;
use chrono::TimeZone;

use crate::db::{category::Category, course::Course};

pub mod coursera;
pub mod youtube;

#[derive(Clone)]
pub struct Token {
    pub access_token: String,
    pub issued_at: i64,
    pub expires_in: i64,
}

#[async_trait]
pub trait Ranker {
    fn env_name() -> &'static str where Self: Sized;
    fn new(key: String, secret: String) -> Self where Self: Sized;
    async fn update_token(&mut self) -> Result<(), Box<dyn std::error::Error>>;
    fn get_token(&self) -> Option<Token>;

    async fn update_if_expired(&mut self) -> Result<bool, Box<dyn std::error::Error>> {
        let token = self.get_token();

        if token.is_none() || token.and_then(|t| Some(t.expires_in + t.issued_at)).unwrap() > (chrono::Utc::now() + chrono::Duration::seconds(30)).timestamp() {
            Ok(false)
        } else {
            self.update_token().await?;
            Ok(true)
        }
    }

    fn env() -> Self where Self: Sized {
        let key = std::env::var(format!("{}_KEY", Self::env_name())).unwrap_or_default();
        let secret = std::env::var(format!("{}_SECRET", Self::env_name())).unwrap_or_default();
        Self::new(key, secret)
    }

    async fn get_courses(&self, category: Category) -> Result<Vec<Course>, Box<dyn std::error::Error>>;
}
