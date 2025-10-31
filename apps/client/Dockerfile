FROM node:22.16.0-alpine3.21 

# Install system dependencies
RUN apk add --no-cache libc6-compat git

# Setup pnpm
RUN npm i -g corepack@0.31.0
RUN corepack enable pnpm

WORKDIR /app

# Set environment variables
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy workspace configuration files (as root)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/client/package.json ./apps/client/package.json

# Install dependencies (as root)
RUN pnpm install --filter client --frozen-lockfile

# Copy client configuration files
COPY apps/client/next.config.ts ./apps/client/
COPY apps/client/postcss.config.mjs ./apps/client/
COPY apps/client/tsconfig.json ./apps/client/

# Copy client source code
COPY apps/client/public ./apps/client/public
COPY apps/client/app ./apps/client/app
COPY apps/client/components ./apps/client/components
COPY apps/client/lib ./apps/client/lib
COPY apps/client/.env ./apps/client/
COPY apps/client/middleware.ts ./apps/client/

# Set working directory to client
WORKDIR /app/apps/client

# Build the application (as root)
RUN pnpm store prune
RUN rm -rf node_modules pnpm-lock.yaml
RUN pnpm install --prefer-offline=false
RUN pnpm build

# Create nextjs user and set permissions AFTER build
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 && \
    chown -R nextjs:nodejs /app

# Switch to nextjs user
USER nextjs

# Expose port
EXPOSE 3001

# Set port environment variable
ENV PORT=3001

# Start the application
CMD ["pnpm", "start"]