FROM node:18.18.2-alpine

RUN apk add --no-cache bash
RUN npm i -g @nestjs/cli typescript ts-node

# Set the working directory in the container
WORKDIR /app

# RUN  npm install -g typescript@latest
# RUN npm install -g @nestjs/cli

# Copy package.json and package-lock.json to the container
COPY package.json ./

# Install app dependencies
RUN npm install

# Copy the rest of your application code to the containernpm 
COPY . .

# CMD ["sh", "-c", "npm run migration:run && npm run seed:run && npm run start"]
CMD ["sh", "-c", "npm run start"]

