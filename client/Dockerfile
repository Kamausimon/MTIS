# Use official Node.js image
FROM node:18 

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy frontend source code
COPY . .

# Build the frontend app
RUN npm run build

# Expose the frontend port
EXPOSE 3000  

# Start the frontend server
CMD ["npm", "start"]
