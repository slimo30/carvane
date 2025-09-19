# Development image
FROM node:18-alpine

WORKDIR /app

# Install pnpm
RUN corepack enable pnpm

# Install system deps (needed for Next.js in Alpine)
RUN apk add --no-cache libc6-compat

# Copy package files only
COPY package.json pnpm-lock.yaml* ./

# Install deps
RUN pnpm install --no-frozen-lockfile

# Expose port
EXPOSE 3000

ENV NODE_ENV development
ENV NEXT_TELEMETRY_DISABLED 1
ENV HOSTNAME "0.0.0.0"
ENV WATCHPACK_POLLING true

# Run the Next.js dev server with polling for file changes
CMD ["pnpm", "dev", "--turbo"]
