# Build stage
FROM node:20-alpine AS builder

RUN npm install -g pnpm@9.0.0

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY turbo.json ./

# Copy workspace packages
COPY packages ./packages
COPY apps/crm ./apps/crm

# Install dependencies
RUN pnpm install

# Build
RUN pnpm --filter @rent-a-wheel/crm build

# Production stage
FROM node:20-alpine

RUN npm install -g pnpm@9.0.0

WORKDIR /app

# Copy built files and dependencies
COPY --from=builder /app/apps/crm/.next ./.next
COPY --from=builder /app/apps/crm/public ./public
COPY --from=builder /app/apps/crm/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/crm/next.config.js ./next.config.js 2>/dev/null || true

# Expose port
EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["pnpm", "start"]
