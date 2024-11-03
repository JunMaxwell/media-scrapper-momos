# Use the official Node.js image as the base image
FROM node:20-bullseye

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .


# Build the application
RUN npm run build

# Expose the port the app runs on
EXPOSE 8080

# Run Prisma 
RUN npm run prisma:generate

# Run prisma migrage:prod
RUN npm run migrate:deploy:prod

# Start the application
CMD ["npm", "run", "start:prod"]
