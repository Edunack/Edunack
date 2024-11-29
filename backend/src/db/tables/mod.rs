use std::{
    marker::PhantomData,
    sync::Arc,
};

use sqlx::{Pool, SqlitePool};

pub mod user;
pub mod course;
pub mod category;
pub mod rating;

pub struct Table<T>(Arc<SqlitePool>, PhantomData<T>);

impl<T> Table<T> {
    pub fn new(conn: Arc<SqlitePool>) -> Self {
        Self(conn, PhantomData)
    }
}



