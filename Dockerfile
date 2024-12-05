# Use the official Node.js image as the base image
FROM node:latest

# Install ffmpeg and ffprobe
RUN apt-get update && apt-get install -y ffmpeg && apt-get clean

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 3000 to the host
EXPOSE 3000

# Start the application
CMD ["node", "app.js"]
