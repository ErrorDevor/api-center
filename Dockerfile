# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# NEXT_PUBLIC_* vars are inlined into the client bundle at build time, so
# they must be present here, not just in a runtime .env on the server (see
# docker-compose.yml's matching build.args, and .env.example for what each
# one does). Defaults point at nginx's same-origin /gateway/ proxy (see
# nginx/conf.d/default.conf) so the built image works even if the server's
# .env doesn't override them.
ARG NEXT_PUBLIC_PROVIDERS_JSON_URL=/gateway/data/providers.json
ARG NEXT_PUBLIC_MODELS_JSON_URL=/gateway/data/models.json
ARG NEXT_PUBLIC_API_DESCRIPTIONS_JSON_URL=/gateway/data/api_descriptions.json
ARG NEXT_PUBLIC_PROVIDER_DESCRIPTIONS_JSON_URL=/gateway/data/provider_descriptions.json
ENV NEXT_PUBLIC_PROVIDERS_JSON_URL=$NEXT_PUBLIC_PROVIDERS_JSON_URL
ENV NEXT_PUBLIC_MODELS_JSON_URL=$NEXT_PUBLIC_MODELS_JSON_URL
ENV NEXT_PUBLIC_API_DESCRIPTIONS_JSON_URL=$NEXT_PUBLIC_API_DESCRIPTIONS_JSON_URL
ENV NEXT_PUBLIC_PROVIDER_DESCRIPTIONS_JSON_URL=$NEXT_PUBLIC_PROVIDER_DESCRIPTIONS_JSON_URL

RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
