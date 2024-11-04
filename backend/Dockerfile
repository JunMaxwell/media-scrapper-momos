# Stage 1: Building the code
FROM node:20-bullseye AS builder

COPY . /app/backend

WORKDIR /app/backend

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy TypeScript configuration files
COPY tsconfig*.json ./

# Copy source code and prisma schema
COPY src ./src
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Build the project
RUN npm run build

# Remove dev dependencies
RUN npm prune --omit=dev

# Stage 2: Run the built code
FROM node:20-bullseye-slim AS runner

WORKDIR /app/backend

ENV NODE_ENV production

# Copy built assets from builder stage
COPY --from=builder /app/backend/package*.json ./
COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/prisma ./prisma

# Install typescript and ts-node globally
RUN npm install --save bcrypt nanoid

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

# Expose the port the app runs on
EXPOSE 8080

# Run the app
CMD ["node", "dist/main.js"]