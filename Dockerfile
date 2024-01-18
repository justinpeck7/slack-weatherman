FROM node:18.19.0-buster

WORKDIR /usr/src/app

COPY ["package.json", "package-lock.json*", "./"]
RUN npm install --omit=dev

COPY . .

CMD ts-node --compiler-options '{\"module\": \"commonjs\"}' index.ts