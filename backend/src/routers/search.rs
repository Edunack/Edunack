use axum::{extract::State, response::IntoResponse, routing::post, Json, Router};
use scraper::Selector;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use super::IntoRouter;
use crate::AppState;

pub struct SearchRouter;

#[derive(Serialize, Deserialize)]
pub struct SearchParams {
    html: String,
}

#[derive(Serialize, Deserialize)]
pub struct SearchResponse {
    id: Uuid,
    name: String,
    url: String,
    image: String,
    description: String,
    rating: f64,
}

impl SearchRouter {
    pub async fn search(State(state): State<AppState>, body: String) -> axum::response::Response {
        let html = scraper::Html::parse_fragment(body.as_str());
        let mut courses: Vec<SearchResponse> = vec![];

        let anchor_selector = Selector::parse("a.gs-title").unwrap();
        let description_selector = Selector::parse("div.gs-bidi-start-align.gs-snippet").unwrap();
        let image_selector = Selector::parse("img.gs-image").unwrap();

        for element in html.select(&Selector::parse("div.gsc-result").unwrap()) {
            let a = element.select(&anchor_selector).next().unwrap();
            let desc = element.select(&description_selector).next().unwrap();

            courses.push(SearchResponse {
                id: Uuid::new_v4(),
                name: a.text().collect::<String>(),
                url: a.attr("href").unwrap().to_string(),
                image: match element.select(&image_selector).next() {
                    Some(img) => img.attr("src").unwrap().to_string(),
                    None => "".to_string(),
                },
                description: desc.text().collect::<String>(),
                rating: 0.0,
            });
        }

        Json(courses).into_response()
    }
}

impl IntoRouter for SearchRouter {
    fn into_router(self) -> Router<AppState> {
        Router::new().route("/", post(Self::search))
    }
}
