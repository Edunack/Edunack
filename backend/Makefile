default:

# schema:
# 	sqlcipher dev.sqlite "PRAGMA key='$(shell sed -n -e 's/DATABASE_KEY=\(.*$\\)/\1/p' .env)';" ".output schema.sql" .schema

# sqlx:
# 	sqlite3 sqlx.sqlite ".read schema.sql"

encrypted:
	sqlcipher $(shell sed -n -e 's/DATABASE=\(.*$\\)/\1/p' .env) "PRAGMA key='$(shell sed -n -e 's/DATABASE_KEY=\(.*$\\)/\1/p' .env)';" ".read schema.sql"
