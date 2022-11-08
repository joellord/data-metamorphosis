FROM node:16
WORKDIR /opt/app
COPY package.json .
RUN npm install

COPY ./*.js ./
COPY ./public ./public

EXPOSE 80

CMD node .