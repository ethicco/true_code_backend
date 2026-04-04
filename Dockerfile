FROM node:24.14.1-alpine3.22

WORKDIR /app

ARG NODE_ENV=production

COPY package-lock.json package.json ./
RUN npm install
COPY . .

RUN npm run build

CMD [ "npm", "run", "start:prod" ]