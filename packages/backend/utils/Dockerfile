# Use the official Node.js image as the base image
FROM node:16 AS media_base_service

# Create directory for utils
RUN mkdir -p /app/backend/utils

# Create directory for services
RUN mkdir /app/backend/services

# Copy utils 
COPY . /app/backend/utils

# Set the working directory inside the container
WORKDIR /app/backend/utils

# Install utils dependencies
RUN npm install

# Build the TypeScript code for utils
RUN npm run build