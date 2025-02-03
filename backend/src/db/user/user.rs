use edunack_macros::QueryGen;
use sqlx::{prelude::FromRow, query, query_as};
use uuid::Uuid;

use super::super::Table;

pub(crate) type UserTable = Table<User>;

#[derive(Debug, FromRow, QueryGen)]
#[query_gen(query = select_query)]
pub struct User {
    pub id: Uuid,
    pub username: String,
    pub email: String,
    #[query_gen(skip)]
    pub password: String,
    #[query_gen(skip)]
    pub verified: bool,
}

pub fn select_query(column: &str) -> String {
    format!("SELECT * FROM users WHERE {column} = ?1")
}

impl Table<User> {
    pub async fn insert(&self, user: &User) -> Result<(), sqlx::Error> {
        query("INSERT INTO users (id, username, email, password, verified) VALUES (?1, ?2, ?3, ?4, ?5)")
            .bind(user.id.clone())
            .bind(user.username.clone())
            .bind(user.email.clone())
            .bind(user.password.clone())
            .bind(user.verified)
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
