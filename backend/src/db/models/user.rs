use edunack_macros::QueryGen;
use sqlx::prelude::FromRow;
use uuid::Uuid;

use super::course::Order;

#[derive(Debug, FromRow, QueryGen)]
#[query_gen(query_generator = select_query)]
pub struct User {
    pub id: Uuid,
    pub username: String,
    pub email: String,
    #[query_gen(skip)]
    pub password: String,
}

pub fn select_query(column: &str, _language: Option<&str>, _order: Option<Order>) -> String {
    if _language.is_some() || _order.is_some() {
        panic!("language and order are not supported");
    }
    format!("SELECT * FROM users WHERE {column} = ?1")
}
