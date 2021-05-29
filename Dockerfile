FROM node:14

WORKDIR /app

COPY ./src/ /app/

RUN yarn install

EXPOSE 3000

CMD [ "yarn", "start" ]