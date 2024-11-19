use std::sync::{Arc, RwLock};

use crate::db::models::user::User;
use rusqlite::{types::ToSqlOutput, Connection, ToSql};
use uuid::Uuid;

use super::Table;

impl Table<User> {
    pub fn insert(&self, user: &User) -> Result<(), rusqlite::Error> {
        self.0
            .write()
            .unwrap()
            .execute(
                "INSERT INTO users (id, username, email, password) VALUES (?1, ?2, ?3, ?4)",
                [
                    user.id.to_sql().unwrap(),
                    user.username.to_sql().unwrap(),
                    user.email.to_sql().unwrap(),
                    user.password.to_sql().unwrap(),
                ],
            )
            .map(|_| ())
    }

    pub fn find_by_id(&self, id: Uuid) -> Option<User> {
        self.0
            .write()
            .unwrap()
            .query_row("SELECT * FROM users WHERE id = ?1", [id], |row| {
                Ok(User {
                    id: row.get("id")?,
                    username: row.get("username")?,
                    email: row.get("email")?,
                    password: row.get("password")?,
                })
            })
            .ok()
    }

    pub fn find_by_email(&self, email: &str) -> Option<User> {
        self.0
            .write()
            .unwrap()
            .query_row("SELECT * FROM users WHERE email = ?1", [email], |row| {
                Ok(User {
                    id: row.get("id")?,
                    username: row.get("username")?,
                    email: row.get("email")?,
                    password: row.get("password")?,
                })
            })
            .ok()
    }

    pub fn find_by_username(&self, username: &str) -> Option<User> {
        self.0
            .write()
            .unwrap()
            .query_row(
                "SELECT * FROM users WHERE username = ?1",
                [username],
                |row| {
                    Ok(User {
                        id: row.get("id")?,
                        username: row.get("username")?,
                        email: row.get("email")?,
                        password: row.get("password")?,
                    })
                },
            )
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

    pub fn find_by_username_or_email(&self, username: &str, email: &str) -> Option<User> {
        self.0
            .write()
            .unwrap()
            .query_row(
                "SELECT * FROM users WHERE email regexp ?1 OR username regexp ?1 order by ?2",
                [
                    format!("^({})$|^({})$", username, email),
                    "username".min("email").to_string(),
                ],
                |row| {
                    //println!("{:?}", row);
                    Ok(User {
                        id: row.get("id")?,
                        username: row.get("username")?,
                        email: row.get("email")?,
                        password: row.get("password")?,
                    })
                },
            )
            .ok()
    }
}
