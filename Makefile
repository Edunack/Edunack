build:
	cd ./backend && cargo build -F linkssl
	cd ./frontend && npm run build

run: build
	cd ./backend && cargo run -F linkssl

env:
	nix develop --command "zsh"

shell:
	nix develop --command "zellij" "--layout" "programming" "options" "--default-shell=zsh"
