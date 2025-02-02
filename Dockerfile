#use an official nodejs runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the current directory contents into the container at /usr/src/app
COPY . /usr/src/app

#copy package.json and package-lock.json to the working directory
COPY package*.json ./

#copy the rest of the application
COPY . .

# Install any needed packages specified in package.json
RUN npm install --omit=dev

# Make port 80 available to the world outside this container
EXPOSE 4000

# Define environment variable
ENV NAME world

# Run app.js when the container launches
CMD ["node", "server.js"]