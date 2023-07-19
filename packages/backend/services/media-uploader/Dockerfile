FROM media_base_service

# Create directory for services
RUN mkdir /app/backend/services/media-uploader

# Set the working directory inside the container
WORKDIR /app/backend/services/media-uploader

# Copy the package.json and package-lock.json files to the container
# This will install dependencies separately to leverage Docker caching
COPY package.json package-lock.json ./

# Install project dependencies
RUN npm install

# Copy the entire service directory to the container
COPY . ./

# Build the TypeScript code
RUN npm run build

# Expose the port on which the service will run (assuming port 3000)
EXPOSE 3000

# Start the service
CMD [ "node", "dist/server.js" ]
