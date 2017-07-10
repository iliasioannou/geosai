FROM planetek/node-bower-compass-grunt:4
MAINTAINER Maurizio Cosmai <cosmai@planetek.it>
ARG branch

RUN git clone -b $branch https://teamEreticoTfs:hIEMK-i=d@tfs.planetek.it/SBU-GS/pkz029_UU_CMEMS/_git/pkz029_UU_CMEMS_Web_App
WORKDIR pkz029_UU_CMEMS_Web_App/cmems-gui
RUN npm install
RUN bower install  --allow-root
RUN grunt clean build --target=development --verbose
WORKDIR dist

EXPOSE 8080
CMD ["node", "server.js"]
