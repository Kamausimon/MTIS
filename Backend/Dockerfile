# Use official Node.js image
FROM node:18 

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first (for efficient caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend source code
COPY . .

# Expose the backend port
EXPOSE 4000  

# Command to start the backend server
CMD ["node", "server.js"]
