use edunack_macros::QueryGen;
use sqlx::prelude::FromRow;
use uuid::Uuid;

#[derive(Debug, FromRow, QueryGen)]
#[query_gen(query = select_query)]
pub struct User {
    pub id: Uuid,
    pub username: String,
    pub email: String,
    #[query_gen(skip)]
    pub password: String,
}

pub fn select_query(column: &str) -> String {
    format!("SELECT * FROM users WHERE {column} = ?1")
}
