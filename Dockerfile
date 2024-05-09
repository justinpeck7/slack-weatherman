FROM node:20-bookworm-slim
RUN apt-get update && apt-get install -y build-essential python3
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY package.json package-lock.json* ./
RUN npm i --omit=dev
COPY . .

CMD npm run start
