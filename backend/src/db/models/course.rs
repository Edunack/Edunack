use serde::Serialize;
use uuid::Uuid;

#[derive(Serialize, Debug)]
pub struct Course {
    pub id: Uuid,
    pub author: String,
    pub category: Uuid,
    pub name: String,
}
