all: build

build:
	ember build --environment=production
	rm -rf ../public
	mv dist ../public
	rm -rf ../public/api

server:
	ember server --watcher=polling

.PHONY: server
