#!/bin/bash

USER_NAME=user123

docker stop mande_db
docker rm mande_db && docker rmi ${USER_NAME}/mande_backend ${USER_NAME}/mande_db

cd database_postgres
docker build -t ${USER_NAME}/mande_db . && docker run --name mande_db -p 5432:5432 -e POSTGRES_PASSWORD=mysecretpassword -d ${USER_NAME}/mande_db

cd ..
cd backend_express
docker build -t ${USER_NAME}/mande_backend . && npm install
docker run -it --rm -p 3000:3000 -v $(pwd):/usr/src/app --link mande_db:postgres --name mande_app ${USER_NAME}/mande_backend


