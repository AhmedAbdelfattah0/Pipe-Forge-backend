# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
# Handlebars templates are loaded at runtime via __dirname (resolved to dist/features/pipelines/services/)
# template.service.ts resolves: path.resolve(__dirname, '..', 'templates')
# which maps to dist/features/pipelines/templates/
COPY --from=builder /app/src/features/pipelines/templates ./dist/features/pipelines/templates
EXPOSE 3001
CMD ["node", "dist/index.js"]
