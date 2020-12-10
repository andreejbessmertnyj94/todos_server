FROM node:14-slim
ENV NODE_ENV=development

WORKDIR /rest_server

#COPY ["package.json", "yarn.lock", "./"]

COPY . .

RUN yarn install
