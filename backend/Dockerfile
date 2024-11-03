# Stage 1: Building the code
FROM node:20-alpine AS base

FROM base AS builder

COPY . /backend

WORKDIR /backend

ENV NODE_ENV build

# Copy root package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the backend prisma folder
COPY backend/prisma ./prisma

# Generate Prisma client and build the project
RUN npx prisma generate \
    && npm prune --omit=dev

# Build the project
RUN npm run build --prefix backend

# Copy the backend dist folder
COPY backend/dist ./dist

# Stage 2: Run the built code
FROM base AS runner

# Set environment variables
ENV NODE_ENV production

WORKDIR /backend

# Copy built assets from builder stage
COPY --from=builder /backend/package*.json ./
COPY --from=builder /backend/node_modules/ ./node_modules/

# Expose the port the app runs on
EXPOSE 8080

# Run the app using dotenv
CMD ["node", "dist/src/main"]