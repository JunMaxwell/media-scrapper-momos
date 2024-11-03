# Stage 1: Building the code
FROM node:20-bullseye AS builder

COPY . /app/ui

# Set the working directory
WORKDIR /app/ui

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the project
RUN npm run build

# Stage 2: Run the built code
FROM node:20-bullseye-slim AS runner

WORKDIR /app/ui

# Set environment variables
ENV NODE_ENV production

# Install PM2 globally
RUN npm install --global pm2

# Copy necessary files from builder stage
COPY --from=builder /app/ui/next.config.ts ./
COPY --from=builder /app/ui/public ./public
COPY --from=builder /app/ui/.next ./.next
COPY --from=builder /app/ui/node_modules ./node_modules
COPY --from=builder /app/ui/package.json ./package.json

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

# Expose the port Next.js runs on
EXPOSE 3000

# Launch app with PM2
CMD ["pm2-runtime", "npm", "--", "start"]