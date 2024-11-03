# Stage 1: Building the code
FROM node:20-bullseye AS builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Copy the ui package.json
COPY ui/package.json ./ui/

# Install dependencies
RUN npm ci

# Copy the rest of the code
COPY . .

# Build the project
RUN npm run build --prefix ui

# Stage 2: Run the built code
FROM node:20-bullseye AS runner

WORKDIR /app

# Copy built assets from builder stage
COPY --from=builder /app/ui/.next ./ui/.next
COPY --from=builder /app/ui/public ./ui/public
COPY --from=builder /app/ui/package.json ./ui/package.json
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json

# Install next globally
RUN npm install -g next

# Install only production dependencies
RUN npm install

# Set environment variables
ENV NODE_ENV production

# Expose the port Next.js runs on
EXPOSE 3000

# Run the Next.js app
CMD ["npm", "run", "start", "--prefix", "ui"]