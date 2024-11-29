use std::ops::Deref;

use crate::db::models::user::User;
use sqlx::{query, query_as, Sqlite};
use uuid::Uuid;

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

    pub async fn find_by_id(&self, id: Uuid) -> Option<User> {
        query_as("SELECT * FROM users WHERE id = ?1")
            .bind(id)
            .fetch_one(&*self.0)
            .await
            .ok()
    }

    pub async fn find_by_email(&self, email: &str) -> Option<User> {
        query_as("SELECT * FROM users WHERE email = ?1")
            .bind(email)
            .fetch_one(&*self.0)
            .await
            .ok()
    }

    pub async fn find_by_username(&self, username: &str) -> Option<User> {
        query_as("SELECT * FROM users WHERE username = ?1")
            .bind(username)
            .fetch_one(&*self.0)
            .await
            .ok()
    }

    //pub async fn exists_by_username(&self, username: &str) -> bool {
    //    match sqlx::query!("SELECT * FROM users WHERE username = ?1", username)
    //        .fetch_optional(&self.0)
    //        .await
    //    {
    //        Ok(res) => res.is_some(),
    //        Err(_) => false,
    //    }
    //}
    //
    //pub async fn exists_by_email(&self, email: &str) -> bool {
    //    match sqlx::query!("SELECT * FROM users WHERE email = ?1", email)
    //        .fetch_optional(&self.0)
    //        .await
    //    {
    //        Ok(res) => res.is_some(),
    //        Err(_) => false,
    //    }
    //}

    pub async fn find_by_username_or_email(&self, username: &str, email: &str) -> Option<User> {
        query_as("SELECT * FROM users WHERE email IN (?1, ?2) OR username IN (?1, ?2)")
            .bind(email)
            .bind(username)
            .fetch_one(&*self.0)
            .await
            .ok()
    }
}
