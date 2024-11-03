# Stage 1: Building the code
FROM node:20-bullseye AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Copy the backend package.json
COPY backend/package.json ./backend/

# Install dependencies
RUN npm ci

# Copy the rest of the code
COPY . .

# Build the project
RUN npm run build --prefix backend

# Stage 2: Run the built code
FROM node:20-bullseye AS runner

WORKDIR /app

# Copy built assets from builder stage
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/package.json ./backend/package.json
COPY --from=builder /app/backend/package-lock.json ./backend/package-lock.json
COPY --from=builder /app/backend/env ./backend/env
COPY --from=builder /app/backend/prisma ./backend/prisma
COPY --from=builder /app/package.json ./package.json

# Install dotenv globally
RUN npm install -g dotenv-cli

# Install only production dependencies
RUN npm install

# Set environment variables
ENV NODE_ENV production

# Expose the port the app runs on
EXPOSE 8080

# Run the app
CMD ["npm", "run", "start:prod", "--prefix", "backend"]