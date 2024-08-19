# Stage 1: Build the application
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
# RUN npm install
RUN npm ci

COPY . .

# # Copy the .env file
# COPY .env .env

# Generate Prisma Client if needed
RUN npx prisma generate

RUN npm run build

# Stage 2: Serve the application
FROM node:18-alpine

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/.env .env

# Expose the port the app runs on
EXPOSE 5000

# Command to run the application
CMD ["node", "dist/main"]




# # Stage 1: Build the application
# FROM node:18-alpine AS build

# # Set working directory
# WORKDIR /app

# # Copy package.json and package-lock.json
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy the rest of the application files
# COPY . .

# RUN npx prisma generate

# # Build the application
# RUN npm run build

# # Stage 2: Serve the application
# FROM node:18-alpine

# # Set working directory
# WORKDIR /app

# # Copy only the necessary files from the build stage
# COPY --from=build /app/dist ./dist
# COPY --from=build /app/node_modules ./node_modules
# COPY --from=build /app/package*.json ./

# # Expose the port the app runs on
# EXPOSE 3000

# # Command to run the application
# CMD ["node", "dist/main"]# Stage 1: Build the application
# FROM node:18-alpine AS product

# # Set working directory
# WORKDIR /app

# # Copy package.json and package-lock.json
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy the rest of the application files
# COPY . .

# # Build the application
# RUN npm run build

# # Stage 2: Serve the application
# FROM node:18-alpine

# # Set working directory
# WORKDIR /app

# # Copy only the necessary files from the build stage
# COPY --from=product /app/dist ./dist
# COPY --from=product /app/node_modules ./node_modules
# COPY --from=product /app/package*.json ./

# # Expose the port the app runs on
# EXPOSE 5000

# # Command to run the application
# CMD ["node", "dist/main"]