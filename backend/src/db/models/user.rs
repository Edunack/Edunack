use sqlx::prelude::FromRow;
use uuid::Uuid;


#[derive(Debug, FromRow)]
pub struct User {
    pub id: Uuid,
    pub username: String,
    pub email: String,
    pub password: String,
}

