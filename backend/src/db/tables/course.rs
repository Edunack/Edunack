use sqlx::{query, query_as, query_scalar, Sqlite};
use uuid::Uuid;

use crate::db::models::course::Course;

use super::Table;

impl Table<Course> {
    pub async fn find_medium_name(&self, medium: i32, language: &str) -> Option<String> {
        query_scalar(
            format!(
                "SELECT name FROM course_mediums WHERE id = ?1 \
                AND (language = ?2 OR language = 'en') ORDER BY language {}",
                if language > "en" { "desc" } else { "asc" }
            )
            .as_str(),
        )
        .bind(medium)
        .bind(language)
        .fetch_optional(&*self.0)
        .await
        .ok()?
    }
    pub async fn insert(&self, course: Course) -> Result<(), ()> {
        let mut tx = self.0.begin().await.unwrap();

        query("INSERT INTO course_translations (course, language, name) VALUES (?1, ?2, ?3)")
            .bind(course.id)
            .bind("en")
            .bind(course.name)
            .execute(&mut *tx)
            .await
            .map_err(|_| ())?;

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

        tx.commit().await.map_err(|_| ())?;

        Ok(())
    }

    pub fn find_by_id(&self, id: Uuid, language: &str) -> Option<Course> {
        todo!()
    }

    pub async fn find_by_category(&self, category: uuid::Uuid, language: &str) -> Vec<Course> {
        query_as(
            format!(
                "SELECT * FROM (SELECT courses.*, name from courses \
                INNER JOIN course_translations ON courses.id = course_translations.course \
                WHERE category = ?1 AND (language like ?2 or language like 'en') \
                GROUP BY id, language ORDER BY language {}) GROUP BY id",
                if language > "en" { "desc" } else { "asc" }
            )
            .as_str(),
        )
        .bind(category)
        .bind(language)
        .fetch_all(&*self.0)
        .await
        .unwrap_or_else(|_| vec![])
    }

    pub async fn find_by_author(&self, author: &str, language: &str) -> Vec<Course> {
        query_as(
            format!(
                "SELECT * FROM (SELECT courses.*, name from courses \
                INNER JOIN course_translations ON courses.id = course_translations.course \
                WHERE author = ?1 AND (language like ?2 or language like 'en') \
                GROUP BY id, language ORDER BY language {}) GROUP BY id",
                if language > "en" { "desc" } else { "asc" }
            )
            .as_str(),
        )
        .bind(author)
        .bind(language)
        .fetch_all(&*self.0)
        .await
        .unwrap_or_else(|_| vec![])
    }

    pub async fn find_by_name(&self, name: &str, language: &str) -> Vec<Course> {
        query_as(
            format!(
                "SELECT * FROM (SELECT courses.*, name from courses \
                INNER JOIN course_translations ON courses.id = course_translations.course \
                WHERE course_translations.name LIKE ?1 AND (language like ?2 or language like 'en') \
                GROUP BY id, language ORDER BY language {}) GROUP BY id",
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

    pub async fn find_by_url(&self, name: &str, language: &str) -> Option<Course> {
        query_as(
            format!(
                "SELECT * FROM (SELECT courses.*, name from courses \
                INNER JOIN course_translations ON courses.id = course_translations.course \
                WHERE url LIKE ?1 AND (language like ?2 or language like 'en') \
                GROUP BY id, language ORDER BY language {}) GROUP BY id",
                if language > "en" { "desc" } else { "asc" }
            )
            .as_str(),
        )
        .bind(name)
        .bind(language)
        .fetch_optional(&*self.0)
        .await
        .ok()?
    }

    pub async fn exists_by_url(&self, url: &str) -> bool {
        query_scalar("SELECT EXISTS(SELECT 1 FROM courses WHERE url = ?1)")
            .bind(url)
            .fetch_one(&*self.0)
            .await
            .unwrap()
    }
}
