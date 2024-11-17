default:
	sqlcipher $(shell sed -n -e 's/DATABASE=\(.*$\\)/\1/p' .env) -cmd "PRAGMA key='$(shell sed -n -e 's/DATABASE_KEY=\(.*$\\)/\1/p' .env)';" -cmd ".mode qbox"

# schema:
# 	sqlcipher dev.sqlite "PRAGMA key='$(shell sed -n -e 's/DATABASE_KEY=\(.*$\\)/\1/p' .env)';" ".output schema.sql" .schema

# sqlx:
# 	sqlite3 sqlx.sqlite ".read schema.sql"

clean: remove encrypted records

remove:
	rm $(shell sed -n -e 's/DATABASE=\(.*$\\)/\1/p' .env)

encrypted:
	sqlcipher $(shell sed -n -e 's/DATABASE=\(.*$\\)/\1/p' .env) "PRAGMA key='$(shell sed -n -e 's/DATABASE_KEY=\(.*$\\)/\1/p' .env)';" ".read schema.sql"

records:
	sqlcipher $(shell sed -n -e 's/DATABASE=\(.*$\\)/\1/p' .env) "PRAGMA key='$(shell sed -n -e 's/DATABASE_KEY=\(.*$\\)/\1/p' .env)';" ".read records.sql"
