-- users table
CREATE TABLE IF NOT EXISTS users(id blob(16) not null primary key, username text not null, email text not null, password text not null);

-- course names table
CREATE TABLE IF NOT EXISTS course_names(id blob(16) not null primary key, course_id blob(16) not null, name text not null);

-- courses table
CREATE TABLE IF NOT EXISTS courses(id blob(16) not null primary key, url text not null);
