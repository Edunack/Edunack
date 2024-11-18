-- users table
CREATE TABLE IF NOT EXISTS users(
    id blob(16) not null primary key,
    username text not null,
    email text not null,
    password text not null
);

-- courses table
CREATE TABLE IF NOT EXISTS courses(
    id blob(16) not null primary key,
    category blob(16) not null,
    author text not null,
    medium int not null,
    url text,
    description text,
    image text,
    price text
);

-- course translation table
CREATE TABLE IF NOT EXISTS course_translations(
    course blob(16) not null,
    language varchar(2) not null,
    name text not null,
    PRIMARY KEY (course, language)
);

-- course medium table
CREATE TABLE IF NOT EXISTS course_mediums(
    id int not null,
    language varchar(2) not null,
    name text not null,
    PRIMARY KEY (id, language)
);

-- categories table
CREATE TABLE IF NOT EXISTS categories(
    id blob(16) not null,
    language varchar(2) not null,
    name text not null,
    PRIMARY KEY (id, language)
);
