$command = $args[0]

function Make-Env {
    $env:DATABASE_URL="sqlite://db.sqlite"
}

switch ($command) {
    "env" {
        Make-Env
    }
    "run" {
        Make-Env
        cd ./frontend && npm run build && cd ..
        cd ./backend && cargo run && cd ..
    }
    "build" {
        Make-Env
        cd ./frontend && npm run build && cd ..
        cd ./backend && cargo build && cd ..
    }
}
