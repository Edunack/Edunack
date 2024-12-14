use sqlx::{query, query_scalar};

use crate::db::models::course::Course;

use super::Table;

impl Table<Course> {
    pub async fn find_medium_name(&self, medium: i32, language: &str) -> Option<String> {
        query_scalar(
            format!(
                "SELECT name FROM course_mediums WHERE id = ?1 \
                AND (language = '{}' OR language = 'en') ORDER BY language {}",
                language, if language > "en" { "desc" } else { "asc" }
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

    pub async fn exists_by_url(&self, url: &str) -> bool {
        query_scalar("SELECT EXISTS(SELECT 1 FROM courses WHERE url = ?1)")
            .bind(url)
            .fetch_one(&*self.0)
            .await
            .unwrap()
    }
}
