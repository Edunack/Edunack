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

use crate::{
    db::{
        category::{Category, CategoryTable},
        course::{Course, CourseTable, Order},
    },
    AppState,
};

pub struct SearchRouter;

//#[derive(Serialize, Deserialize)]
//pub struct SearchParams {
//    name: Option<String>,
//    category: Option<Uuid>,
//    language: Option<String>,
//}

#[derive(Serialize, Deserialize)]
#[serde(untagged)]
pub enum SearchCoursesBy {
    ID {
        course: Uuid,
    },
    Name {
        name: String,
    },
    Category {
        category: Uuid,
        order: Option<Order>,
    },
}

#[derive(Serialize, Deserialize)]
pub struct SearchCourses {
    #[serde(flatten)]
    by: SearchCoursesBy,
    language: Option<String>,
}

impl SearchCourses {
    pub fn language(&self) -> &str {
        self.language.as_deref().unwrap_or("en")
    }
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
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
    rating_count: i32,
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
        let categories_table = CategoryTable::new(db.get_conn());
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
        let categories_table = CategoryTable::new(db.get_conn());
        match categories_table.find_by_id(id, lang).await {
            Some(category) => Json(category).into_response(),
            None => StatusCode::NOT_FOUND.into_response(),
        }
    }

    //#[axum::debug_handler]
    pub async fn search(
        State(state): State<AppState>,
        Json(params): Json<SearchCourses>,
    ) -> axum::response::Response {
        let lang = params.language();
        let db = state.database.clone();
        let courses_table = CourseTable::new(db.get_conn());
        if let SearchCoursesBy::ID { course, .. } = params.by {
            return Json(courses_table.find_by_id(course, lang).await).into_response();
        }
        Json(
            futures::future::join_all(
                match params.by {
                    SearchCoursesBy::Name { ref name, .. } => {
                        courses_table.find_all_by_name_tolerant(name.clone(), lang).await
                    }
                    SearchCoursesBy::Category {
                        category,
                        ref order,
                        ..
                    } => {
                        courses_table
                            .find_all_by_category(category, lang, order.clone())
                            .await
                    }
                    _ => unreachable!(),
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
                            .find_medium_name(course.medium, lang)
                            .await
                            .unwrap(),
                        description: course.description.clone(),
                        rating: course.rating,
                        rating_count: course.rating_count,
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
        let courses_table = CourseTable::new(state.database.get_conn());
        for elem in elements {
            if courses_table.exists_by_url(elem.url.as_str()).await {
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
                rating_count: 0,
                medium: 0,
                category,
            };
            println!("{:?}", course);
            courses_table.insert(course.clone()).await.unwrap();
        }

        StatusCode::OK.into_response()
    }
}

impl Into<Router<AppState>> for SearchRouter {
    fn into(self) -> Router<AppState> {
        Router::new()
            .route("/", post(Self::search))
            .route("/google/{category}", post(Self::google))
            .route("/categories/{id}", get(Self::category))
            .route("/categories", get(Self::categories))
    }
}
