FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy workspace files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages ./packages
COPY apps/api ./apps/api

# Install dependencies
RUN pnpm install --frozen-lockfile

# Generate Prisma client
WORKDIR /app/apps/api
RUN pnpm db:generate

# Build packages
WORKDIR /app
RUN pnpm --filter @candidate-screening/domain build
RUN pnpm --filter @candidate-screening/scoring build

# Build API
RUN pnpm --filter @candidate-screening/api build

# Expose port
EXPOSE 4000

# Start the application
WORKDIR /app/apps/api
CMD ["npm", "run", "start:prod"]
