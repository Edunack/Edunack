use std::{
    marker::PhantomData,
    sync::{Arc, RwLock},
};

use rusqlite::Connection;

pub mod user;
pub mod course;
pub mod category;

pub struct Table<T>(Arc<RwLock<Connection>>, PhantomData<T>);

impl<T> Table<T> {
    pub fn new(conn: Arc<RwLock<Connection>>) -> Self {
        Self(conn, PhantomData)
    }
}
