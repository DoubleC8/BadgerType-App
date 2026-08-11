# ==========================================
# STAGE 1: Build the React App
# ==========================================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

# NEW: Accept the Clerk key as a build argument!
ARG VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY

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
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]