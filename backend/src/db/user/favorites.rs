use edunack_macros::QueryGen;
use sqlx::{query, FromRow};
use uuid::Uuid;

use crate::db::Table;

pub(crate) type UserFavoritesTable = Table<UserFavorites>;

#[derive(FromRow, QueryGen)]
#[query_gen(all, single(skip), query = select_query)]
pub(crate) struct UserFavorites {
    pub user: Uuid,
    pub course: Uuid,
}

impl Table<UserFavorites> {
    pub async fn insert(&self, user_favorites: &UserFavorites) -> Result<(), sqlx::Error> {
        query("INSERT INTO user_favorites (user, course) VALUES (?1, ?2)")
            .bind(user_favorites.user.clone())
            .bind(user_favorites.course.clone())
            .execute(&*self.0)
            .await
            .map_err(|e| {
                println!("{:?}", e);
                e
            })
            .map(|_| ())
    }

    pub async fn delete(&self, user_favorites: &UserFavorites) -> Result<(), sqlx::Error> {
        query("DELETE FROM user_favorites WHERE user = ?1 AND course = ?2")
            .bind(user_favorites.user.clone())
            .bind(user_favorites.course.clone())
            .execute(&*self.0)
            .await
            .map_err(|e| {
                println!("{:?}", e);
                e
            })
            .map(|_| ())
    }
}

fn select_query(column: &str) -> String {
    format!("SELECT * FROM user_favorites WHERE {column} = ?1")
}
