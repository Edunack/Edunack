build:
	cd ./backend && cargo build
	cd ./frontend && npm run build

run: build
	cd ./backend && cargo run

deploy:
	cd ./frontend && npm run build
	cd ./backend && cargo run --release > ../edunack.log &

kill:
	pkill edunack

env:
	nix develop --command "zsh"

shell:
	nix develop --command "launch-zellij" "--layout" "programming" "options" "--default-shell=zsh"
