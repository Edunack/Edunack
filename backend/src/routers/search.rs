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
    db::{
        models::{category::Category, course::Course},
        tables::Table,
    },
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
        let categories = categories_table.find_by_name(name.as_str(), lang);

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
        match categories_table.find_by_id(id, lang) {
            Some(category) => return Json(category).into_response(),
            None => return StatusCode::NOT_FOUND.into_response(),
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

        let map = |course: &Course| SearchResponse {
            id: course.id,
            category: course.category,
            name: course.name.clone(),
            author: course.author.to_string(),
            price: course.price.to_string(),
            url: course.url.clone(),
            image: course.image.clone(),
            medium: courses_table.find_medium_name(course.medium, lang.as_str()).unwrap(),
            description: course.description.clone(),
            rating: 0.0,
        };

        if let Some(name) = params.name {
            Json(
                courses_table
                    .find_by_name(format!("%{}%", name).as_str(), lang.as_str())
                    .iter()
                    .map(map)
                    .collect::<Vec<_>>(),
            )
            .into_response()
        } else if let Some(category) = params.category {
            Json(
                courses_table
                    .find_by_category(category, lang.as_str())
                    .iter()
                    .map(map)
                    .collect::<Vec<_>>(),
            )
            .into_response()
        } else {
            StatusCode::UNPROCESSABLE_ENTITY.into_response()
        }
    }
}

impl SearchRouter {
    pub async fn google(
        State(state): State<AppState>,
        Path(category): Path<Uuid>,
        body: String,
    ) -> axum::response::Response {
        let html = scraper::Html::parse_fragment(body.as_str());

        let anchor_selector = Selector::parse("a.gs-title").unwrap();
        let description_selector = Selector::parse("div.gs-bidi-start-align.gs-snippet").unwrap();
        let image_selector = Selector::parse("img.gs-image").unwrap();
        let url_selector = Selector::parse(".gs-visibleUrl > span").unwrap();

        for element in html.select(&Selector::parse("div.gsc-result").unwrap()) {
            let a = element.select(&anchor_selector).next().unwrap();
            let desc = element.select(&description_selector).next().unwrap();
            let url = element.select(&url_selector).next().unwrap();

            //courses.push(GoogleSearchResponse {
            //    id: Uuid::new_v4(),
            //    name: a.text().collect::<String>(),
            //    url: a.attr("href").unwrap().to_string(),
            //    image: match element.select(&image_selector).next() {
            //        Some(img) => img.attr("src").unwrap().to_string(),
            //        None => "".to_string(),
            //    },
            //    description: desc.text().collect::<String>(),
            //    author: url.text().collect::<String>(),
            //    price: "free".to_string(),
            //    rating: 0.0,
            //});
            if state
                .database
                .course()
                .exists_by_url(a.attr("href").unwrap().to_string().as_str())
            {
                continue;
            }
            let course = Course {
                id: Uuid::new_v4(),
                name: a.text().collect::<String>(),
                url: a.attr("href").unwrap().to_string(),
                image: match element.select(&image_selector).next() {
                    Some(img) => img.attr("src").unwrap().to_string(),
                    None => "".to_string(),
                },
                description: desc.text().collect::<String>(),
                author: url.text().collect::<String>(),
                price: "free".to_string(),
                rating: 0.0,
                medium: 0,
                category,
            };
            println!("{:?}", course);
            state.database.course().insert(course).unwrap();
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
