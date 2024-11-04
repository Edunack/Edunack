build:
	cd ./backend && cargo build
	cd ./frontend && npm run build

run: build
	cd ./backend && cargo run

shell:
	nix develop --command "zellij" "--layout" "programming" "options" "--default-shell=zsh"
