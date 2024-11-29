pub mod category;
pub mod course;
pub mod user;

pub mod rating {
    use sqlx::FromRow;

    #[derive(FromRow)]
    pub struct Rating(pub u32);

}
