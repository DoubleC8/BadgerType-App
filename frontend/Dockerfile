# ==========================================
# STAGE 1: Build the React App
# ==========================================
FROM node:18-alpine as builder

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Build the Vite project for production
RUN npm run build

# ==========================================
# STAGE 2: Serve with Nginx
# ==========================================
FROM nginx:alpine

# Copy our custom Nginx configuration to fix React Router
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built static files from Stage 1 into the Nginx server
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80 (the standard web port)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]