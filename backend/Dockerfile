# Multi-stage Dockerfile for PayPilot AI Backend API & Multi-Agent Engine

# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and tsconfig
COPY tsconfig.json ./
COPY src ./src

# Compile TypeScript to dist/
RUN npm run build

# Stage 2: Production runtime stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled code from builder
COPY --from=builder /app/dist ./dist

# Expose HTTP port (Cloud Run injects PORT; local defaults to 5000)
EXPOSE 5000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-5000}/health || exit 1

CMD ["node", "dist/server.js"]
