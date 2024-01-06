FROM node:18.19.0

WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --omit=dev

COPY . .

CMD [ "node", "index.js" ]