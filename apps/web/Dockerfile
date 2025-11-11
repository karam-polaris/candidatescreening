FROM node:18-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy workspace files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages ./packages
COPY apps/web ./apps/web

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build packages
RUN pnpm --filter @candidate-screening/domain build
RUN pnpm --filter @candidate-screening/ui build

# Build web
RUN pnpm --filter @candidate-screening/web build

# Expose port
EXPOSE 3000

# Start the application
WORKDIR /app/apps/web
CMD ["npm", "run", "start"]
