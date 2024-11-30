use std::collections::HashMap;

use axum::{
    extract::{Path, Query, State},
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};
use http::StatusCode;
use scraper::Selector;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use super::IntoRouter;
use crate::{
    db::models::{category::Category, course::Course},
    AppState,
};

pub struct SearchRouter;

#[derive(Serialize, Deserialize)]
pub struct SearchParams {
    name: Option<String>,
    category: Option<Uuid>,
    language: Option<String>,
}

#[derive(Serialize, Deserialize)]
pub struct SearchResponse {
    id: Uuid,
    category: Uuid,
    name: String,
    url: String,
    image: String,
    description: String,
    author: String,
    price: String,
    medium: String,
    rating: f64,
}

impl SearchRouter {
    pub async fn categories(
        State(state): State<AppState>,
        Query(params): Query<HashMap<String, String>>,
    ) -> axum::response::Json<Vec<Category>> {
        let name = match params.get("name") {
            Some(name) => name.to_string(),
            None => "".to_string(),
        };

        let lang = match params.get("lang") {
            Some(lang) => lang,
            None => "en",
        };
        let db = state.database.clone();
        let categories_table = db.category();
        let categories = categories_table.find_by_name(name.as_str(), lang).await;

        Json(categories)
    }

    pub async fn category(
        State(state): State<AppState>,
        Path(id): Path<Uuid>,
        Query(params): Query<HashMap<String, String>>,
    ) -> axum::response::Response {
        let lang = match params.get("lang") {
            Some(lang) => lang,
            None => "en",
        };
        let db = state.database.clone();
        let categories_table = db.category();
        match categories_table.find_by_id(id, lang).await {
            Some(category) => Json(category).into_response(),
            None => StatusCode::NOT_FOUND.into_response(),
        }
    }

    //#[axum::debug_handler]
    pub async fn search(
        State(state): State<AppState>,
        Json(params): Json<SearchParams>,
    ) -> axum::response::Response {
        let lang = match params.language {
            Some(lang) => lang,
            None => "en".to_string(),
        };
        let db = state.database.clone();
        let courses_table = db.course();

        Json(
            futures::future::join_all(
                if let Some(name) = params.name {
                    courses_table
                        .find_by_name(format!("%{}%", name).as_str(), lang.as_str())
                        .await
                } else if let Some(category) = params.category {
                    courses_table
                        .find_by_category(category, lang.as_str())
                        .await
                } else {
                    return StatusCode::UNPROCESSABLE_ENTITY.into_response();
                }
                .iter()
                .map(|course| async {
                    SearchResponse {
                        id: course.id,
                        category: course.category,
                        name: course.name.clone(),
                        author: course.author.to_string(),
                        price: course.price.to_string(),
                        url: course.url.clone(),
                        image: course.image.clone(),
                        medium: courses_table
                            .find_medium_name(course.medium, lang.as_str())
                            .await
                            .unwrap(),
                        description: course.description.clone(),
                        rating: 0.0,
                    }
                }),
            )
            .await,
        )
        .into_response()
    }
}

impl SearchRouter {
    pub async fn google(
        State(state): State<AppState>,
        Path(category): Path<Uuid>,
        body: String,
    ) -> axum::response::Response {
        struct Element {
            url: String,
            name: String,
            description: String,
            image: Option<String>,
            author: String,
        }
        let elements = {
            let html = scraper::Html::parse_fragment(body.as_str());

            let anchor_selector = Selector::parse("a.gs-title").unwrap();
            let description_selector =
                Selector::parse("div.gs-bidi-start-align.gs-snippet").unwrap();
            let image_selector = Selector::parse("img.gs-image").unwrap();
            let url_selector = Selector::parse(".gs-visibleUrl > span").unwrap();
            let results_selector = Selector::parse("div.gsc-result").unwrap();

            let elements = html.select(&results_selector).map(|e| {
                (
                    e.select(&anchor_selector).next().unwrap(),
                    e.select(&description_selector).next().unwrap(),
                    e.select(&url_selector).next().unwrap(),
                    e.select(&image_selector).next(),
                )
            });

            elements
                .into_iter()
                .map(|e| {
                    Element {
                        //name
                        name: e.0.text().collect::<String>(),
                        //url
                        url: e.0.attr("href").unwrap().to_string(),
                        //description
                        description: e.1.text().collect::<String>(),
                        //author
                        author: e.2.text().collect::<String>(),
                        //image
                        image: e
                            .3
                            .and_then(|img| img.attr("src"))
                            .map(|src| src.to_string()),
                    }
                })
                .collect::<Vec<_>>()
        };
        for elem in elements {
            if state
                .database
                .course()
                .exists_by_url(elem.url.as_str())
                .await
            {
                println!("Skipping {}", elem.name);
                continue;
            }
            let course = Course {
                id: Uuid::new_v4(),
                name: elem.name.clone(),
                url: elem.url.clone(),
                image: elem.image.clone().unwrap_or("".to_string()),
                description: elem.description.clone(),
                author: elem.author.clone(),
                price: "free".to_string(),
                rating: 0.0,
                medium: 0,
                category,
            };
            println!("{:?}", course);
            state
                .database
                .course()
                .insert(course.clone())
                .await
                .unwrap();
        }

        StatusCode::OK.into_response()
    }
}

impl IntoRouter for SearchRouter {
    fn into_router(self) -> Router<AppState> {
        Router::new()
            .route("/", post(Self::search))
            .route("/google/:category", post(Self::google))
            .route("/categories/:id", get(Self::category))
            .route("/categories", get(Self::categories))
    }
}
