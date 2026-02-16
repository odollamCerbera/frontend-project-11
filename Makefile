install:
	npm ci

develop:
	npm run dev

lint:
	npx eslint . $(ARGS)

build:
	NODE_ENV=production npm run build
