FROM media_base_service

# Create directory for services
RUN mkdir /app/backend/services/meta-updater

# Set the working directory inside the container
WORKDIR /app/backend/services/meta-updater

# Copy the package.json files to the container
# This will install dependencies separately to leverage Docker caching
COPY package.json  ./

# Install project dependencies
RUN npm install

# Copy the entire service directory to the container
COPY . ./

# Install utils
RUN npm install ../../utils;

# Build the TypeScript code
RUN npm run build

# Expose the port on which the service will run (assuming port 4000)
EXPOSE 4000

# Start the service
CMD [ "node", "dist/main.js" ]
