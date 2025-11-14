
# Use the official lightweight Node.js image
FROM node:22-slim

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy local code to the container image
COPY . ./

# Build the Next.js app
RUN npm run build

# Set environment to production
ENV NODE_ENV=production
ENV PORT=8080

# Expose the port Cloud Run expects
EXPOSE 8080

# Start the Next.js app
CMD ["npm", "start"]
