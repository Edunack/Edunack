use serde::Serialize;
use sqlx::prelude::FromRow;

#[derive(Serialize, Debug, FromRow)]
pub struct Category {
    pub id: uuid::Uuid,
    pub name: String,
}
