FROM node:20-alpine

RUN apk --no-cache add dumb-init netcat-openbsd

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN chmod +x entrypoint.sh

EXPOSE 3333

CMD ["dumb-init", "./entrypoint.sh"]
