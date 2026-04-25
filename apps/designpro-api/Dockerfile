FROM node:22-alpine AS base
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY prisma ./prisma
RUN npx prisma generate

COPY src ./src

RUN mkdir -p uploads

ENV NODE_ENV=production
EXPOSE 8788

CMD ["sh", "-c", "npx prisma migrate deploy && node src/server.js"]
