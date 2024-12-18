use std::ops::Deref;

use serde::Deserialize;
use sqlx::{query, query_as, FromRow};
use uuid::Uuid;

use super::Table;

pub(crate) type RatingTable = Table<Rating>;

#[derive(FromRow, Deserialize)]
pub struct Rating(pub u32);

impl Deref for Rating {
    type Target = u32;
    fn deref(&self) -> &u32 {
        &self.0
    }
}
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
    ) -> Result<(), sqlx::Error> {
        query("INSERT OR REPLACE INTO user_ratings (course, user, rating) VALUES (?1, ?2, ?3)")
            .bind(course_id)
            .bind(user_id)
            .bind(*rating)
            .execute(&*self.0)
            .await
            .map(|_| ())
    }
}
