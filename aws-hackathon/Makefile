frontend = hackathon-frontend
backend = hackathon-backend

build-f:
	cd client && docker build -t $(frontend) .

build-b:
	cd server && docker build -t $(backend) .

start-f:
	docker run -p 5173:5173 --name web-app $(frontend)

start-b:
	docker run -p 8001:8001 --name api $(backend)

stop-f:
	docker rm -f web-app

stop-b:
	docker rm -f api