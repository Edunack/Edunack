build:
	cd ./backend && cargo build
	cd ./frontend && npm run build

run: build
	cd ./backend && cargo run

env:
	nix develop --command "zsh"

shell:
	nix develop --command "launch-zellij" "--layout" "programming" "options" "--default-shell=zsh"
