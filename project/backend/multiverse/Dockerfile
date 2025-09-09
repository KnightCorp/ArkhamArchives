# Use Node.js 18 Alpine as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application
COPY . .

# Expose the port the app runs on
EXPOSE 3001

# Environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Command to run the application
CMD ["node", "server.js"]
