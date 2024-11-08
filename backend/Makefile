default: schema database

schema:
	sqlcipher dev.sqlite "PRAGMA key='$(shell sed -n -e 's/DATABASE_KEY=\(.*$\\)/\1/p' .env)';" ".output schema.sql" .schema

database:
	sqlite3 sqlx.sqlite ".read schema.sql"

