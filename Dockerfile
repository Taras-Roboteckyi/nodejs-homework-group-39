FROM node 

WORKDIR /app

COPY . /app

RUN npm install

EXPOSE 4600


CMD ["node", "server"]