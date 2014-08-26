all: build

build:
	grunt build
	git checkout ../public/saa-groups

server:
	grunt server

serve:
	grunt server

.PHONY: server
