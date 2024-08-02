FROM node:20.16.0-alpine3.19

#Create a directory for the app
WORKDIR /usr/src/app

#Install app dependencies
COPY package*.json ./
RUN npm install

#Bundle app source
COPY . .

EXPOSE 3000
CMD [ "node", "server.js" ]

