FROM node:20-alpine

COPY package.json /app/

WORKDIR /app/

RUN npm install 

COPY . /app/
EXPOSE 8080

CMD ["npm", "start"]