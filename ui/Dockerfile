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
EXPOSE 3000

# Set environment variables
ENV NEXTAUTH_URL=http://localhost:3000
ENV NEXTAUTH_SECRET=your_secret_key_here
ENV NEXT_PUBLIC_API_URL=http://localhost:8080
ENV NODE_OPTIONS='--inspect'

# Start the application
CMD ["npm", "start"]
