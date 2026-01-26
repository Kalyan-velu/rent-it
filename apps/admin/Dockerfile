# Build stage
FROM node:20-alpine AS builder

RUN npm install -g pnpm@9.0.0

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY turbo.json ./

# Copy workspace packages
COPY packages ./packages
COPY apps/admin ./apps/admin

# Install dependencies
RUN pnpm install

# Build
RUN pnpm --filter @rent-a-wheel/admin build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/apps/admin/dist /usr/share/nginx/html

# Copy nginx configuration
COPY apps/admin/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --quiet --tries=1 --spider http://localhost:3001 || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
