FROM media_base_service

# Create directory for services
RUN npm init -w backend/services/meta-updater -y

# Copy the package.json files to the container
# This will install dependencies separately to leverage Docker caching
COPY package.json  ./backend/services/meta-updater

# Install project dependencies
RUN npm install -w ./backend/services/meta-updater

# Copy the entire service directory to the container
COPY . ./backend/services/meta-updater

# Build the TypeScript code
RUN npm run build --workspaces --if-present

# Expose the port on which the service will run (assuming port 4000)
EXPOSE 4000

# Start the service
CMD [ "npm", "run", "start", "--workspaces", "--if-present" ]
