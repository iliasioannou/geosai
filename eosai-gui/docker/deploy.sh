#! /bin/bash
docker build -t planetek/node-bower-compass-grunt:4 -f Dockerfile.base .
docker build --no-cache -t planetek/eosai-gui:$1 --build-arg branch=$1 .
# docker-compose up -d gui
