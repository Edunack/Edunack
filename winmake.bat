@ECHO OFF
SET DATABASE_URL="sqlite://db.sqlite"

if %1=="run" (
    cd frontend
    cmd /c "npm run build"
    cd ../backend
    cmd /c "cargo run"
    cd ..
) else if %1=="build" (
    cd frontend
    cmd /c "npm run build"
    cd ../backend
    cmd /c "cargo build"
    cd ..
)
