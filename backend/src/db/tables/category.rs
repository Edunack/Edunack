use rusqlite::{MappedRows, ToSql};
use uuid::Uuid;

use crate::db::models::category::Category;

use super::Table;

impl Table<Category> {
    pub fn find_by_id(&self, id: Uuid, language: &str) -> Option<Category> {
        self.0.write().unwrap().query_row(
            format!("SELECT * FROM categories WHERE id LIKE ?1 AND (language = ?2 OR language='en') order by language {}", if language > "en" {"desc"} else {"asc"}).as_str(),
            [id.to_sql().unwrap(), language.to_sql().unwrap()],
            |row| {
                Ok(Category {
                    id: row.get("id")?,
                    name: row.get("name")?,
                })
            },
        ).ok()
    }

    pub fn find_by_name(&self, name: &str, language: &str) -> Vec<Category> {
        let conn = self.0.write().unwrap();
        // wtf is this query
        let mut query = conn
            .prepare(
                format!(
                    "SELECT *, all_index_of(?1, name) as aio from \
                    (SELECT categories.*, count(courses.id) as count FROM categories \
                    LEFT JOIN courses ON categories.id = courses.category WHERE \
                    cimatch(?1, name) AND (language = ?2 OR language='en') \
                    group by categories.id, language order by count(courses.id) desc, language {}) \
                    group by id order by aio, count desc",
                    if language > "en" { "desc" } else { "asc" }
                )
                .as_str(),
            )
            .unwrap();
        let res = query.query_map([name, language], |row| {
            Ok(Category {
                id: row.get("id")?,
                name: row.get("name")?,
            })
        });
        match res {
            Ok(user) => user.filter_map(Result::ok).collect(),
            Err(_) => vec![],
        }
    }

}
