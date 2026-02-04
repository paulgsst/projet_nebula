FROM node:20-alpine

RUN apk --no-cache add dumb-init

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3333

CMD ["dumb-init", "node", "ace", "serve", "--watch"]
