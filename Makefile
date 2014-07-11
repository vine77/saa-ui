all: build

build:
	ember build --environment=production
	mkdir ../tmp
	mv ../public/static ../tmp/static
	rm -rf ../public
	mv dist ../public
	rm -rf ../public/api
	rm -rf ../public/fuel
	rm -rf ../public/ipm00
	mv ../tmp/static ../public/static
	rm -rf ../tmp

server:
	ember server --watcher=polling

.PHONY: server
