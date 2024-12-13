use crate::db::models::user::User;
use sqlx::{query, query_as};

use super::Table;

impl Table<User> {
    pub async fn insert(&self, user: &User) -> Result<(), sqlx::Error> {
        query("INSERT INTO users (id, username, email, password) VALUES (?1, ?2, ?3, ?4)")
            .bind(user.id.clone())
            .bind(user.username.clone())
            .bind(user.email.clone())
            .bind(user.password.clone())
            .execute(&*self.0)
            .await
            .map(|_| ())
    }

    pub async fn find_by_username_or_email(&self, username: &str, email: &str) -> Option<User> {
        query_as("SELECT * FROM users WHERE email IN (?1, ?2) OR username IN (?1, ?2)")
            .bind(email)
            .bind(username)
            .fetch_one(&*self.0)
            .await
            .ok()
    }
}
