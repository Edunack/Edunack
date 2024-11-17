use std::sync::{Arc, RwLock};

use models::{category::Category, course::Course, user::User};
use rusqlite::Connection;
use tables::Table;

pub mod tables;
pub mod models;

#[derive(Clone)]
pub struct Database(Arc<RwLock<Connection>>);

impl Database {
    pub fn new(conn: Arc<RwLock<Connection>>) -> Self {
        Self(conn)
    }

    pub fn user(&self) -> Table<User> {
        Table::new(self.0.clone())
    }

    pub fn course(&self) -> Table<Course> {
        Table::new(self.0.clone())
    }

    pub fn category(&self) -> Table<Category> {
        Table::new(self.0.clone())
    }
}
