use std::sync::Arc;

use models::{category::Category, course::Course, rating::Rating, user::User};
use rusqlite_ext::RusqliteFunctionExt;
use sqlx::{SqliteConnection, SqlitePool};
use tables::Table;

pub mod models;
pub mod tables;

#[derive(Clone)]
pub struct Database(Arc<SqlitePool>);

impl Database {
    pub fn new(conn: Arc<SqlitePool>) -> Self {
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

    pub fn rating(&self) -> Table<Rating> {
        Table::new(self.0.clone())
    }
}
pub mod rusqlite_ext {
    use std::sync::Arc;

    use axum::BoxError;
    use regex::{Regex, RegexBuilder};

    pub trait RusqliteFunctionExt {
        fn register_all(&self) -> rusqlite::Result<()> {
            self.register_regexp()?;
            self.register_cimatch()?;
            self.register_all_index_of()
        }
        fn register_regexp(&self) -> rusqlite::Result<()>;

        fn register_cimatch(&self) -> rusqlite::Result<()>;

        fn register_all_index_of(&self) -> rusqlite::Result<()>;
    }

    fn make_regex(vr: rusqlite::types::ValueRef) -> Result<Regex, BoxError> {
        let mut reg = ".*?".to_string();
        for c in vr.as_str()?.chars() {
            reg.push('(');
            reg.push_str(regex::escape(c.to_string().as_str()).as_str());
            reg.push_str(").*?");
        }
        reg.pop();
        Ok(RegexBuilder::new(reg.as_str())
            .case_insensitive(true)
            .build()?)
    }

    impl RusqliteFunctionExt for rusqlite::Connection {
        fn register_regexp(&self) -> rusqlite::Result<()> {
            self.create_scalar_function(
                "regexp",
                2,
                rusqlite::functions::FunctionFlags::SQLITE_UTF8
                    | rusqlite::functions::FunctionFlags::SQLITE_DETERMINISTIC,
                move |ctx| {
                    assert_eq!(ctx.len(), 2, "called with unexpected number of arguments");
                    let regexp: Arc<Regex> = ctx
                        .get_or_create_aux(0, |vr| -> Result<_, BoxError> {
                            Ok(Regex::new(vr.as_str()?)?)
                        })?;
                    let is_match = {
                        let text = ctx
                            .get_raw(1)
                            .as_str()
                            .map_err(|e| rusqlite::Error::UserFunctionError(e.into()))?;

                        regexp.is_match(text)
                    };

                    Ok(is_match)
                },
            )
        }
        fn register_cimatch(&self) -> rusqlite::Result<()> {
            self.create_scalar_function(
                "cimatch",
                2,
                rusqlite::functions::FunctionFlags::SQLITE_UTF8
                    | rusqlite::functions::FunctionFlags::SQLITE_DETERMINISTIC,
                move |ctx| {
                    assert_eq!(ctx.len(), 2, "called with unexpected number of arguments");

                    let regexp: Arc<Regex> = ctx.get_or_create_aux(0, make_regex).unwrap();

                    let is_match = {
                        let text = ctx
                            .get_raw(1)
                            .as_str()
                            .map_err(|e| rusqlite::Error::UserFunctionError(e.into()))?;

                        regexp.is_match(text)
                    };

                    Ok(is_match)
                },
            )
        }

        fn register_all_index_of(&self) -> rusqlite::Result<()> {
            self.create_scalar_function(
                "all_index_of",
                2,
                rusqlite::functions::FunctionFlags::SQLITE_UTF8
                    | rusqlite::functions::FunctionFlags::SQLITE_DETERMINISTIC,
                move |ctx| {
                    assert_eq!(ctx.len(), 2, "called with unexpected number of arguments");
                    let regexp: Arc<Regex> = ctx.get_or_create_aux(0, make_regex).unwrap();

                    let ret: usize = {
                        let text = ctx
                            .get_raw(1)
                            .as_str()
                            .map_err(|e| rusqlite::Error::UserFunctionError(e.into()))?;
                        regexp
                            .captures(text)
                            .unwrap()
                            .iter()
                            .skip(1)
                            .map(|c| 1 << c.unwrap().start())
                            .sum()
                    };

                    Ok(ret)
                },
            )
        }
    }
}

pub trait ConnectionExt {
    async fn register_functions(&mut self) -> sqlx::Result<()>;
}

impl ConnectionExt for SqliteConnection {
    async fn register_functions(&mut self) -> sqlx::Result<()> {
        let mut handle_lock = self.lock_handle().await?;
        let handle = handle_lock.as_raw_handle().as_ptr();
        // Safety: we know that the handle is a SQLite connection is locked and is not used anywhere else.
        // The registered functions will be dropped when SQLX drops DB connection.
        let rc = unsafe { rusqlite::Connection::from_handle(handle) }.unwrap();
        rc.register_all().unwrap(); // this calls rc.create_scalar_function(...)
        Ok(())
    }
}
