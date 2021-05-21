FROM node:14
RUN mkdir /app
WORKDIR /app
COPY ./ /app/
RUN yarn install