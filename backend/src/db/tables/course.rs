use rusqlite::ToSql;
use uuid::Uuid;

use crate::db::models::course::Course;

use super::Table;

impl Table<Course> {
    pub fn insert(&self, course: Course) -> Result<(), rusqlite::Error> {
        self.0
            .write()
            .unwrap()
            .execute(
                "INSERT INTO courses (id, category, author, medium, url, description, image, price) \
                VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)",
                [
                    course.id.to_sql().unwrap(),
                    course.category.to_sql().unwrap(),
                    course.author.to_sql().unwrap(),
                    course.medium.to_sql().unwrap(),
                    course.url.to_sql().unwrap(),
                    course.description.to_sql().unwrap(),
                    course.image.to_sql().unwrap(),
                    course.price.to_sql().unwrap(),
                ],
            )
            .map(|_| ())?;

        self.0.write().unwrap().execute(
            "INSERT INTO course_translations (course, language, name) VALUES (?1, ?2, ?3)",
            [
                course.id.to_sql().unwrap(),
                "en".to_sql().unwrap(),
                course.name.to_sql().unwrap(),
            ]
        ).map(|_| ())
    }

    pub fn find_by_id(&self, id: Uuid, language: &str) -> Option<Course> {
        todo!()
    }

    pub fn find_by_category(&self, category: uuid::Uuid, language: &str) -> Vec<Course> {
        let conn = self.0.read().unwrap();
        let mut query = conn
            .prepare(
                format!(
                    "SELECT * FROM \
                    (SELECT courses.*, name from courses \
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
                println!("{:?}", row);
                Ok(Course {
                    id: row.get("id")?,
                    category: row.get("category")?,
                    name: row.get("name")?,
                    author: row.get("author")?,
                    description: row.get("description")?,
                    image: row.get("image")?,
                    price: row.get("price")?,
                    rating: 0.0,
                    medium: row.get("medium")?,
                    url: row.get("url")?,
                })
            },
        );
        match res {
            Ok(user) => user.filter_map(Result::ok).collect(),
            Err(e) => {
                println!("{:?}", e);
                vec![]
            },
        }
    }

    pub fn find_by_author(&self, author: &str, language: &str) -> Vec<Course> {
        let conn = self.0.read().unwrap();
        let mut query = conn
            .prepare(
                format!(
                    "SELECT * FROM \
                    (SELECT courses.*, name from courses \
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
                description: row.get("description")?,
                image: row.get("image")?,
                price: row.get("price")?,
                rating: 0.0,
                medium: row.get("medium")?,
                url: row.get("url")?,
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
                    (SELECT courses.*, name from courses \
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
                description: row.get("description")?,
                image: row.get("image")?,
                price: row.get("price")?,
                rating: 0.0,
                medium: row.get("medium")?,
                url: row.get("url")?,
            })
        });
        match res {
            Ok(user) => user.filter_map(Result::ok).collect(),
            Err(_) => vec![],
        }
    }

    pub fn find_by_url(&self, name: &str, language: &str) -> Option<Course> {
        let res = self.0.read().unwrap().query_row(
            format!(
                "SELECT * FROM \
                    (SELECT courses.*, name from courses \
                     INNER JOIN course_translations ON courses.id = course_translations.course \
                     WHERE url LIKE ?1 AND (language like ?2 or language like 'en') \
                     GROUP BY id, language ORDER BY language {}) GROUP BY id",
                if language > "en" { "desc" } else { "asc" }
            )
            .as_str(),
            [name, language],
            |row| {
                println!("{:?}", row);
                Ok(Course {
                    id: row.get("id")?,
                    category: row.get("category")?,
                    name: row.get("name")?,
                    author: row.get("author")?,
                    description: row.get("description")?,
                    image: row.get("image")?,
                    price: row.get("price")?,
                    rating: 0.0,
                    medium: row.get("medium")?,
                    url: row.get("url")?,
                })
            },
        );
        match res {
            Ok(user) => Some(user),
            Err(_) => None,
        }
    }

    pub fn exists_by_url(&self, url: &str) -> bool {
        self.0
            .read()
            .unwrap()
            .query_row(
                "SELECT EXISTS(SELECT 1 FROM courses WHERE url = ?1)",
                [url],
                |row| row.get(0),
            )
            .unwrap()
    }
}
