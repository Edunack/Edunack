use edunack_macros::QueryGen;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;

#[derive(Serialize, Debug, FromRow, Clone, QueryGen)]
#[query_gen(language, single = false, all, query = select_query)]
pub struct Course {
    #[query_gen(single, all = false)]
    pub id: Uuid,
    pub author: String,
    #[query_gen(order)]
    pub category: Uuid,
    pub name: String,
    pub description: String,
    pub image: String,
    pub price: String,
    pub rating: f64,
    #[query_gen(skip)]
    pub rating_count: i32,
    pub medium: i32,
    pub url: String,
}

pub fn select_query(column: &str, language: Option<&str>, order: Option<Order>) -> String {
    if language.is_none() {
        panic!("language is required");
    }
    let q = format!(
        "select * from (select courses.*, name, avg(coalesce(rating, 0)) as rating, \
            count(rating) as rating_count from courses \
            inner join course_translations on courses.id = course_translations.course \
            left join user_ratings on courses.id = user_ratings.course \
            where {} like ?1 and (language like ?2 or language like 'en') \
            group by id, language order by language {}) group by id {}",
        column,
        if language.unwrap() > "en" {
            "desc"
        } else {
            "asc"
        },
        order
            .and_then(|o| Some(format!("order by {}", o.to_string())))
            .unwrap_or_default()
    );
    //println!("{}", q);
    q
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum Order {
    Rating,
    ID,
    RatingCount,
}

impl ToString for Order {
    fn to_string(&self) -> String {
        match self {
            Order::Rating => "rating",
            Order::ID => "id",
            Order::RatingCount => "rating_count",
        }
        .to_string()
    }
}
