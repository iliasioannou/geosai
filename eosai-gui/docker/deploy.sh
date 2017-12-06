#! /bin/bash
docker build -t dockerhub.planetek.it/node-bower-compass-grunt:4 -f Dockerfile.base .
docker push dockerhub.planetek.it/node-bower-compass-grunt:4
docker build -t dockerhub.planetek.it/pkh111_eosai-gui:base -f Dockerfile.base.code .
docker push dockerhub.planetek.it/pkh111_eosai-gui:base
docker build --no-cache -t planetek/eosai-gui:$1 --build-arg branch=$1 -f Dockerfile.final .
docker psuh dockerhub.planetek.it/pkh111_eosai-gui:$1
