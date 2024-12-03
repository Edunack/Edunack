use sqlx::{query, query_as, Sqlite};
use uuid::Uuid;

use crate::db::models::rating::Rating;

use super::Table;

impl Table<Rating> {
    pub async fn find_rating(&self, course_id: Uuid, user_id: Uuid) -> Option<Rating> {
        query_as("SELECT * from user_likes WHERE course_id = ?1 AND user_id = ?2")
            .bind(course_id)
            .bind(user_id)
            .fetch_optional(&*self.0)
            .await
            .ok()?
    }

    pub async fn insert_or_update_rating(
        &self,
        course_id: Uuid,
        user_id: Uuid,
        rating: Rating,
    ) -> Result<(), ()> {
        query(
            "IF EXISTS (SELECT * FROM user_likes WHERE course_id = ?1 AND user_id = ?2) (
                UPDATE user_likes SET rating = ?3 WHERE course_id = ?1 AND user_id = ?2
            ) ELSE (
                INSERT INTO user_likes (course_id, user_id, rating) VALUES (?1, ?2, ?3)
            )",
        )
        .bind(course_id)
        .bind(user_id)
        .bind(*rating)
        .execute(&*self.0)
        .await
        .map(|_| ())
        .map_err(|_| ())
    }
}
