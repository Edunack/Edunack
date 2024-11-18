use serde::Serialize;
use uuid::Uuid;

#[derive(Serialize, Debug)]
pub struct Course {
    pub id: Uuid,
    pub author: String,
    pub category: Uuid,
    pub name: String,
    pub description: String,
    pub image: String,
    pub price: String,
    pub rating: f64,
    pub medium: i32,
    pub url: String,
}

