FROM media_base_service

# Create directory for services
RUN npm init -w ./backend/services/meta-provider -y

# Copy the package.json and package-lock.json files to the container
# This will install dependencies separately to leverage Docker caching
COPY package.json ./backend/services/meta-provider

# Install project dependencies
RUN npm install -w ./backend/services/meta-provider

# Copy the entire service directory to the container
COPY . ./backend/services/meta-provider

# Build the TypeScript code
RUN npm run build --workspaces --if-present

# Expose the port on which the service will run (assuming port 5555)
EXPOSE 5555

# Start the service
CMD [ "npm", "run", "start", "--workspaces", "--if-present" ]
