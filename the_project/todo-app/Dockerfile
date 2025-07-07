# the_project/todo_app/Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package.json etc, install deps…
COPY package*.json ./
RUN npm install

# Copy source + public folder
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
