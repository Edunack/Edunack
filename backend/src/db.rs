use sqlx::SqlitePool;
use uuid::Uuid;

use crate::user::User;

pub struct Database(SqlitePool);

impl Database {
    pub fn new(pool: SqlitePool) -> Self {
        Self(pool)
    }

    pub fn user(&self) -> UserDatabase {
        UserDatabase(self.0.clone())
    }
}

pub struct UserDatabase(SqlitePool);

impl UserDatabase {
    pub async fn insert(&self, user: &User) -> Result<(), sqlx::Error> {
        sqlx::query!(
            "INSERT INTO users (id, username, email, password) VALUES (?1, ?2, ?3, ?4)",
            user.id,
            user.username,
            user.email,
            user.password
        )
        .execute(&self.0)
        .await
        .map(|_| ())
    }

    pub async fn find_by_id(&self, id: Uuid) -> Option<User> {
        match sqlx::query_as!(
            User,
            r#"SELECT id as "id: uuid::Uuid", username, email, password FROM users WHERE id = ?1"#,
            id
        )
        .fetch_one(&self.0)
        .await
        {
            Ok(user) => Some(user),
            Err(_) => None,
        }
    }

    pub async fn find_by_email(&self, email: &str) -> Option<User> {
        match sqlx::query_as!(
            User,
            r#"SELECT id as "id: uuid::Uuid", username, email, password FROM users WHERE email = ?1"#,
            email
        )
        .fetch_one(&self.0).await {
            Ok(user) => Some(user),
            Err(_) => None,
        }
    }

    pub async fn find_by_username(&self, username: &str) -> Option<User> {
        match sqlx::query_as!(
            User,
            r#"SELECT id as "id: uuid::Uuid", username, email, password FROM users WHERE username = ?1"#,
            username
        )
        .fetch_one(&self.0).await {
            Ok(user) => Some(user),
            Err(_) => None,
        }
    }

    pub async fn exists_by_username(&self, username: &str) -> bool {
        match sqlx::query!(
            "SELECT * FROM users WHERE username = ?1",
            username
        )
        .fetch_optional(&self.0)
        .await
        {
            Ok(res) => res.is_some(),
            Err(_) => false,
        }
    }

    pub async fn exists_by_email(&self, email: &str) -> bool {
        match sqlx::query!(
            "SELECT * FROM users WHERE email = ?1",
            email
        )
        .fetch_optional(&self.0)
        .await
        {
            Ok(res) => res.is_some(),
            Err(_) => false,
        }
    }

    pub async fn exists_by_username_or_email(&self, target: &str) -> bool {
        match sqlx::query!(
            "SELECT * FROM users WHERE username = ?1 OR email = ?1",
            target,
        )
        .fetch_optional(&self.0)
        .await
        {
            Ok(res) => res.is_some(),
            Err(_) => false,
        }
    }
}
