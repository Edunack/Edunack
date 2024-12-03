pub mod category;
pub mod course;
pub mod user;

pub mod rating {
    use std::ops::Deref;

    use serde::Deserialize;
    use sqlx::FromRow;

    #[derive(FromRow, Deserialize)]
    pub struct Rating(pub u32);

    impl Deref for Rating {
        type Target = u32;
        fn deref(&self) -> &u32 {
            &self.0
        }
    }
}
