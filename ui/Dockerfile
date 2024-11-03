# Stage 1: Building the code
FROM node:20-bullseye AS base

FROM base AS builder

COPY . /ui

# Set the working directory
WORKDIR /ui

# Install PM2 globally
RUN npm install --global pm2

# Copy root package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Build the project
RUN npm run build --prefix ui

COPY ui/package*.json ./
COPY ui/next.config.ts ./
COPY ui/public ./public
COPY ui/.next ./.next
COPY ui/node_modules ./node_modules

# Stage 2: Run the built code
FROM base AS runner

WORKDIR /ui

# Copy built assets from builder stage
COPY --from=builder /ui/next.config.ts ./
COPY --from=builder /ui/public ./public
COPY --from=builder /ui/.next ./.next
COPY --from=builder /ui/node_modules ./node_modules
COPY --from=builder /ui/package.json ./package.json

# Install production dependencies
RUN npm install --omit=dev

# Set environment variables
ENV NODE_ENV production

# Expose the port Next.js runs on
EXPOSE 3000

# Launch app with PM2
CMD [ "pm2-runtime", "start", "npm", "--", "run", "dev" ]