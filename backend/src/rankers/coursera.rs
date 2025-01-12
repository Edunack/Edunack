use std::future::Future;

use serde::Deserialize;

use crate::db::{category::Category, course::Course};

use super::Ranker;

pub struct CourseraRanker {
    pub key: String,
    pub secret: String,
    pub token: Option<Token>,
}

#[derive(Deserialize)]
struct Token {
    pub token_type: String,
    pub access_token: String,
    pub grant_type: String,
    pub issued_at: i64,
    pub expires_in: i64,
}

impl CourseraRanker {
    const ENV_NAME: &'static str = "COURSERA";
    const BASE_URL: &'static str = "https://api.coursera.org";
    const TOKEN_PATH: &'static str = "/oath2/client_credentials/token";
}

#[async_trait::async_trait]
impl Ranker for CourseraRanker {
    fn env_name() -> &'static str {
        Self::ENV_NAME
    }

    fn new(key: String, secret: String) -> Self {
        Self {
            key,
            secret,
            token: None,
        }
    }

    async fn update_token(&mut self) -> Result<(), Box<dyn std::error::Error>>{
        let client = reqwest::Client::new();
        let token = client.post(format!("{}{}", Self::BASE_URL, Self::TOKEN_PATH))
            .basic_auth(&self.key.clone(), Some(&self.secret.clone()))
            .header(reqwest::header::CONTENT_TYPE, "application/x-www-form-urlencoded")
            .form(&[("grant_type", "client_credentials")])
            .send()
            .await?
            .json::<Token>()
            .await?;

        self.token = Some(token);
        Ok(())
    }

    fn get_token(&self) -> Option<super::Token> {
        self.token.as_ref().map(|t| super::Token {
            access_token: t.access_token.clone(),
            issued_at: t.issued_at,
            expires_in: t.expires_in,
        })
    }

    async fn get_courses(&self, category: Category) -> Result<Vec<Course>, Box<dyn std::error::Error>> {
        todo!()
    }
}
