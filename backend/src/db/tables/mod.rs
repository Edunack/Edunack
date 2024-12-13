use std::{marker::PhantomData, sync::Arc};

use sqlx::SqlitePool;

pub mod category;
pub mod course;
pub mod rating;
pub mod user;

pub struct Table<T>(Arc<SqlitePool>, PhantomData<T>);

impl<T> Table<T> {
    pub fn new(conn: Arc<SqlitePool>) -> Self {
        Self(conn, PhantomData)
    }

    pub fn get_conn(&self) -> Arc<SqlitePool> {
        self.0.clone()
    }
}
