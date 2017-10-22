FROM node:8

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . ./

EXPOSE "8910:8910"

CMD [ "npm", "start" ]
