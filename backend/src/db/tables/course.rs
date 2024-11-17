use rusqlite::ToSql;
use uuid::Uuid;

use crate::db::models::course::Course;

use super::Table;

impl Table<Course> {
    pub fn find_by_id(&self, id: Uuid, language: &str) -> Option<Course> {
        todo!()
    }

    pub fn find_by_category(&self, category: uuid::Uuid, language: &str) -> Vec<Course> {
        let conn = self.0.read().unwrap();
        let mut query = conn
            .prepare(
                format!(
                    "SELECT * FROM \
                    (SELECT courses.id, category, author, name from courses \
                    INNER JOIN course_translations ON courses.id = course_translations.course \
                    WHERE category = ?1 AND (language like ?2 or language like 'en') \
                    GROUP BY id, language ORDER BY language {}) GROUP BY id",
                    if language > "en" { "desc" } else { "asc" }
                )
                .as_str(),
            )
            .unwrap();
        let res = query.query_map(
            [category.to_sql().unwrap(), language.to_sql().unwrap()],
            |row| {
                Ok(Course {
                    id: row.get("id")?,
                    category: row.get("category")?,
                    name: row.get("name")?,
                    author: row.get("author")?,
                })
            },
        );
        match res {
            Ok(user) => user.filter_map(Result::ok).collect(),
            Err(_) => vec![],
        }
    }

    pub fn find_by_author(&self, author: &str, language: &str) -> Vec<Course> {
        let conn = self.0.read().unwrap();
        let mut query = conn
            .prepare(
                format!(
                    "SELECT * FROM \
                    (SELECT courses.id, category, author, name from courses \
                     INNER JOIN course_translations ON courses.id = course_translations.course \
                     WHERE author = ?1 AND (language like ?2 or language like 'en') \
                     GROUP BY id, language ORDER BY language {}) GROUP BY id",
                    if language > "en" { "desc" } else { "asc" }
                )
                .as_str(),
            )
            .unwrap();
        let res = query.query_map([author, language], |row| {
            Ok(Course {
                id: row.get("id")?,
                category: row.get("category")?,
                name: row.get("name")?,
                author: row.get("author")?,
            })
        });
        match res {
            Ok(user) => user.filter_map(Result::ok).collect(),
            Err(_) => vec![],
        }
    }

    pub fn find_by_name(&self, name: &str, language: &str) -> Vec<Course> {
        let conn = self.0.read().unwrap();
        let mut query = conn
            .prepare(
                format!(
                    "SELECT * FROM \
                    (SELECT courses.id, category, author, name from courses \
                     INNER JOIN course_translations ON courses.id = course_translations.course \
                     WHERE course_translations.name LIKE ?1 AND (language like ?2 or language like 'en') \
                     GROUP BY id, language ORDER BY language {}) GROUP BY id",
                    if language > "en" { "desc" } else { "asc" }
                )
                .as_str(),
            )
            .unwrap();
        let res = query.query_map([name, language], |row| {
            println!("{:?}", row);
            Ok(Course {
                id: row.get("id")?,
                category: row.get("category")?,
                name: row.get("name")?,
                author: row.get("author")?,
            })
        });
        match res {
            Ok(user) => user.filter_map(Result::ok).collect(),
            Err(_) => vec![],
        }
    }
}
