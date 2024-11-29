use sqlx::{query_as, Sqlite};
use uuid::Uuid;

use crate::db::models::category::Category;

use super::Table;

impl Table<Category> {
    pub async fn find_by_id(&self, id: Uuid, language: &str) -> Option<Category> {
        query_as(
            format!(
                "SELECT id, name FROM categories WHERE id LIKE ?1 AND \
            (language = ?2 OR language='en') order by language {}",
                if language > "en" { "desc" } else { "asc" }
            )
            .as_str(),
        )
        .bind(id)
        .bind(language)
        .fetch_optional(&*self.0)
        .await
        .ok()?
    }

    pub async fn find_by_name(&self, name: &str, language: &str) -> Vec<Category> {
        query_as(
            // wtf is this query
            format!(
                "SELECT *, all_index_of(?1, name) as aio from \
                (SELECT categories.*, count(courses.id) as count FROM categories \
                LEFT JOIN courses ON categories.id = courses.category WHERE \
                cimatch(?1, name) AND (language = ?2 OR language='en') \
                group by categories.id, language order by count(courses.id) desc, language {}) \
                group by id order by aio, count desc",
                if language > "en" { "desc" } else { "asc" }
            )
            .as_str(),
        )
        .bind(name)
        .bind(language)
        .fetch_all(&*self.0)
        .await
        .unwrap_or_else(|_| vec![])
    }
}
