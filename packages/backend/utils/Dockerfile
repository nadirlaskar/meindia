# Use the official Node.js image as the base image
FROM node:16 AS media_base_service

# Create directory for app
RUN mkdir -p /app

# Set the working directory inside the container
WORKDIR /app

# create package.json for mono-repo
RUN npm init -y

# create package.json for mono-repo
RUN npm init -w ./backend/utils -y

COPY package.json ./backend/utils

# Install project dependencies
RUN npm install -w ./backend/utils

# Copy utils 
COPY . ./backend/utils

# Set the working directory inside the container
RUN npm install -w utils