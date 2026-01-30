FROM node:20-alpine AS builder

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
RUN npm install --production=false

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src

EXPOSE 3001

CMD ["sh", "-c", "npx prisma migrate deploy && node src/index.js"]
