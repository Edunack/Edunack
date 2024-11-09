@echo off

if %~1=="" (
    echo "Missing argument: 'run' or 'build'"
    goto end
)

if %~1==run (
    cd ./frontend
    cmd /c "npm run build"
    cd ../backend
    cmd /c "cargo run -F bundledssl"
    cd ..
    goto end
)

if %~1==build (
    cd ./frontend
    cmd /c "npm run build"
    cd ../backend
    cmd /c "cargo build -F bundledssl"
    cd ..
    goto end
)

:end

