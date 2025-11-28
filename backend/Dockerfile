# Stage 1: Dependencies
FROM node:20-alpine AS dependencies

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev --ignore-scripts

# Stage 2: Production
FROM node:20-alpine AS production

WORKDIR /app

RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

COPY --from=dependencies --chown=nodejs:nodejs /app/node_modules ./node_modules

COPY --chown=nodejs:nodejs package*.json ./
COPY --chown=nodejs:nodejs server.js ./
COPY --chown=nodejs:nodejs controllers ./controllers
COPY --chown=nodejs:nodejs models ./models
COPY --chown=nodejs:nodejs routes ./routes
COPY --chown=nodejs:nodejs middlewares ./middlewares
COPY --chown=nodejs:nodejs services ./services
COPY --chown=nodejs:nodejs utils ./utils
COPY --chown=nodejs:nodejs config ./config

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

CMD ["node", "server.js"]