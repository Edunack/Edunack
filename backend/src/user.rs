use sqlx::{types::Uuid, Decode};

#[derive(Debug, Decode)]
pub struct User {
    pub id: Uuid,
    pub username: String,
    pub email: String,
    pub password: String,
}

