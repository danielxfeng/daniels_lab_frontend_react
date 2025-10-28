FROM node:24 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY .env.sample .env

COPY . .
RUN npm run build

FROM node:24 AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
RUN npm install -g serve
EXPOSE 8080
CMD ["serve", "-s", "dist", "-l", "8080"]