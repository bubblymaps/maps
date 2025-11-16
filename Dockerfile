# syntax=docker/dockerfile:1

############################################
# Base images
############################################
FROM node:20-slim AS base
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

############################################
# Dependencies
############################################
FROM base AS deps

# Install OS deps required by some Node modules (e.g., Prisma/OpenSSL)
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Install Node dependencies
ENV NODE_ENV=development
COPY package.json ./
COPY package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

############################################
# Build
############################################
FROM base AS builder

# INITIAL ENV
ENV NODE_ENV=production
ENV RESEND_API_KEY="placeholder"
ENV DATABASE_URL="postgresql://user:pass@host:5432/database?schema=public"

# Reinstall build-time tools (eslint/typescript/prisma) via devDeps
ENV NODE_ENV=production
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client before building Next.js
RUN npx prisma generate

# Build Next.js (outputs .next including standalone server)
RUN npm run build

############################################
# Runtime (slim, non-root)
############################################
FROM base AS runner

# Add non-root user
RUN groupadd -g 1001 nodejs \
  && useradd -r -u 1001 -g nodejs nextjs

# Copy Next.js standalone server
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Ensure Prisma engines are available (belt-and-suspenders)
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

USER 1001
EXPOSE 3000
ENV PORT=3000

# Next.js standalone produces server.js at repository root of the standalone tree
CMD ["node", "server.js"]
