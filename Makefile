.PHONY: build start start-detached stop-detached test lint check-coverage

build:
	docker build -t cairo-worker-dev .

start: build
	docker run -p 3121:3121 -it --rm --name cairo-worker-dev cairo-worker-dev

start-detached: build
	docker run -p 3121:3121 -d --name cairo-worker-detached cairo-worker-dev && sleep 2

stop-detached:
	docker stop cairo-worker-detached && docker rm cairo-worker-detached

test: start-detached
	mocha test/integration.js ; make stop-detached

benchmark: start-detached
	rm -rf benchmark-results ; mkdir benchmark-results ; node test/benchmark.js ; make stop-detached

lint:
	jscs -v . ; jshint .
