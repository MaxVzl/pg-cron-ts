# Dockerfile for building a Node.js application with TypeScript
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY src/ ./src

RUN npm run build

# Final stage
FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY jobs/ ./jobs
COPY package*.json ./

RUN npm install --only=dev

CMD ["npm", "start"]
