use std::collections::HashMap;

use serde::Deserialize;
use uuid::Uuid;

use crate::db::{category::Category, course::Course};

use super::{Ranker, Token};

pub struct YoutubeRanker {
    pub token: Option<Token>,
}

impl YoutubeRanker {
    const ENV_NAME: &'static str = "YOUTUBE";
    const BASE_URL: &'static str = "https://www.googleapis.com/youtube/v3/search";
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ApiResult {
    pub kind: String,
    pub etag: String,
    pub next_page_token: Option<String>,
    pub region_code: String,
    pub items: Vec<Video>,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Video {
    pub kind: String,
    pub etag: String,
    pub id: Id,
    pub snippet: Snippet,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Id {
    pub kind: String,
    pub video_id: String,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Snippet {
    pub published_at: String,
    pub channel_id: String,
    pub title: String,
    pub description: String,
    pub thumbnails: HashMap<String, Thumbnail>,
    pub channel_title: String,
    pub live_broadcast_content: String,
    pub publish_time: String,
}

#[derive(Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Thumbnail {
    pub url: String,
    pub width: u32,
    pub height: u32,
}

#[async_trait::async_trait]
impl Ranker for YoutubeRanker {
    fn env_name() -> &'static str {
        Self::ENV_NAME
    }

    fn new(key: String, _secret: String) -> Self
    where
        Self: Sized,
    {
        Self {
            token: Some(Token {
                access_token: key,
                issued_at: chrono::Utc::now().timestamp(),
                expires_in: chrono::Duration::days(30).num_seconds(),
            }),
        }
    }

    async fn update_token(&mut self) -> Result<(), Box<dyn std::error::Error>> {
        self.token.as_mut().unwrap().issued_at = chrono::Utc::now().timestamp();
        Ok(())
    }

    fn get_token(&self) -> Option<Token> {
        self.token.clone()
    }

    async fn get_courses(
        &self,
        category: Category,
    ) -> Result<Vec<Course>, Box<dyn std::error::Error>> {
        let client = reqwest::Client::new();
        let query = format!("{} course", category.name);

        let req = client.get(format!(
            "{}?part=snippet&q={}&key={}&type=video&maxResults=20",
            Self::BASE_URL,
            urlencoding::encode(&query),
            self.token.as_ref().unwrap().access_token.clone()
        ));
        let res = req.send().await?.json::<ApiResult>().await?;
        Ok(res
            .items
            .iter()
            .map(|item| Course {
                id: Uuid::new_v4(),
                author: item.snippet.channel_title.clone(),
                category: category.id,
                name: item.snippet.title.clone(),
                description: item.snippet.description.clone(),
                image: item.snippet.thumbnails.get("medium").unwrap().url.clone(),
                price: "0".to_string(),
                rating: 0.,
                rating_count: 0,
                medium: 0,
                url: format!("https://www.youtube.com/watch?v={}", item.id.video_id),
            })
            .collect())
    }
}
