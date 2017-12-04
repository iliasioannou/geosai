#! /bin/bash
docker build -t planetek/node-bower-compass-grunt:4 -f Dockerfile.base .
docker build -t planetek/eosai-gui:$1 --build-arg branch=$1 -f Dockerfile.base.code .
docker build -t planetek/eosai-gui:$1 --build-arg --build-arg branch=$1 -f Dockerfile.final .
# docker-compose up -d gui
