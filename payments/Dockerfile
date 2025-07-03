FROM node:21.7.3-alpine

WORKDIR /app

COPY package.json .

RUN npm install --omit=dev

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
