FROM node:8

ENV DEBUG chinese_whispers*,hapi*,seneca*
ENV SENECA_MESH_ISBASE 1
ENV SENECA_MESH_PINS []

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . ./

EXPOSE "8500:8500"

CMD [ "npm", "run", "start:base" ]
