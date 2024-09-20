FROM node:20.17.0-alpine

WORKDIR /app

COPY ./package.json ./
RUN npm set registry https://registry.npmmirror.com/
RUN npm install

COPY ./ ./

CMD ["npm", "run", "run"]