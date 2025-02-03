use edunack_macros::QueryGen;
use serde::{Deserialize, Serialize};
use sqlx::{query, query_as, query_scalar, FromRow};
use uuid::Uuid;

use super::Table;

pub(crate) type CourseTable = Table<Course>;

#[derive(Serialize, Debug, FromRow, Clone, QueryGen)]
#[query_gen(single = false, all, query = select_query_wrapper, add_params = "language: &str")]
pub struct Course {
    #[query_gen(single, all = false)]
    pub id: Uuid,
    pub author: String,
    #[query_gen(add_params = "language: &str, order: Option<Order>", query = select_query)]
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

pub fn select_query_wrapper(column: &str, language: &str) -> String {
    select_query(column, language, None)
}

pub fn select_query(column: &str, language: &str, order: Option<Order>) -> String {
    let q = format!(
        "select * from (select courses.*, name, avg(coalesce(rating, 0)) as rating, \
            count(rating) as rating_count from courses \
            inner join course_translations on courses.id = course_translations.course \
            left join user_ratings on courses.id = user_ratings.course \
            where {} like ?1 and (language like '{}' or language like 'en') \
            group by id, language order by language {}) group by id {}",
        column,
        language,
        if language > "en" { "desc" } else { "asc" },
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

impl Table<Course> {
    pub async fn find_medium_name(&self, medium: i32, language: &str) -> Option<String> {
        query_scalar(
            format!(
                "SELECT name FROM course_mediums JOIN course_medium_translations WHERE course_mediums.id = ?1 \
                AND (language = '{}' OR language = 'en') ORDER BY language {}",
                language,
                if language > "en" { "desc" } else { "asc" }
            )
            .as_str(),
        )
        .bind(medium)
        .fetch_optional(&*self.0)
        .await
        .ok()?
    }
    pub async fn insert(&self, course: Course) -> Result<(), ()> {
        let mut tx = self.0.begin().await.unwrap();

        query(
            "INSERT INTO courses (id, category, author, medium, url, description, image, price)\
            VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
        )
        .bind(course.id)
        .bind(course.category)
        .bind(course.author)
        .bind(course.medium)
        .bind(course.url)
        .bind(course.description)
        .bind(course.image)
        .bind(course.price)
        .execute(&mut *tx)
        .await
        .map_err(|_| ())?;

        query("INSERT INTO course_translations (course, language, name) VALUES (?1, ?2, ?3)")
            .bind(course.id)
            .bind("en")
            .bind(course.name)
            .execute(&mut *tx)
            .await
            .map_err(|_| ())?;

        tx.commit().await.map_err(|_| ())?;

        Ok(())
    }

    pub async fn exists_by_url(&self, url: &str) -> bool {
        query_scalar("SELECT EXISTS(SELECT 1 FROM courses WHERE url = ?1)")
            .bind(url)
            .fetch_one(&*self.0)
            .await
            .unwrap()
    }

    pub async fn find_all_by_name_tolerant(&self, name: String, language: &str) -> Vec<Course> {
        query_as(
            // absolutely unreadable
            format!(
                "select *, all_index_of(?1, name) as aio from \
               (select courses.*, name, avg(coalesce(rating, 0)) as rating, \
                count(rating) as rating_count from courses \
                inner join course_translations on courses.id = course_translations.course \
                left join user_ratings on courses.id = user_ratings.course \
                where cimatch(?1, name) and (language like '{}' or language like 'en') \
                group by id, language order by language {}) group by id order by aio",
                language,
                if language > "en" { "desc" } else { "asc" },
            )
            .as_str(),
        )
        .bind(name)
        .fetch_all(&*self.0)
        .await
        .unwrap_or_else(|e| {
            println!("{:?}", e);
            vec![]
        })
    }
}
