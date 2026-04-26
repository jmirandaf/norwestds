FROM node:22-alpine AS base
WORKDIR /app

COPY apps/designpro-api/package*.json ./
RUN npm ci --omit=dev

COPY apps/designpro-api/prisma ./prisma
RUN npx prisma generate

COPY apps/designpro-api/src ./src

# Catalog seed data from worker
COPY apps/designpro-worker/data/profiles.json ./data/profiles.json

RUN mkdir -p uploads

ENV NODE_ENV=production
EXPOSE 8788

CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed 2>/dev/null || true && node src/server.js"]
