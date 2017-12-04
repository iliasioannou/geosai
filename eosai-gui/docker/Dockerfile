FROM planetek/eosai-gui:master

RUN git pull origin master
WORKDIR  eosai-gui
RUN grunt clean build --target=development --verbose
WORKDIR dist

EXPOSE 8080
CMD ["node", "server.js"]

