deploy:
	npm run build
	scp -P 5555 -r dist/* user@1.1.1.1:/home/user/app
