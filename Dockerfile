# Use Node.js 24 Alpine as base image
FROM node:24-alpine

# Set working directory
WORKDIR /app

# Install curl for health checks
RUN apk add --no-cache curl

# Accept build arguments for environment variables
ARG VITE_API_BASE_URL
ARG VITE_TRANSPORT_API_URL
ARG VITE_COMMON_API_URL
ARG VITE_MEDIA_API_URL

# Export them as environment variables for the build process
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_TRANSPORT_API_URL=${VITE_TRANSPORT_API_URL}
ENV VITE_COMMON_API_URL=${VITE_COMMON_API_URL}
ENV VITE_MEDIA_API_URL=${VITE_MEDIA_API_URL}

# Copy package files
COPY package.json ./

# Install all dependencies (including devDependencies for build) without running postinstall scripts
RUN npm install --legacy-peer-deps --ignore-scripts || npm install --force --ignore-scripts

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Install serve to serve the built application
RUN npm install -g serve

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S transportapp -u 1001 -G nodejs

# Change ownership of app directory
RUN chown -R transportapp:nodejs /app

# Switch to non-root user
USER transportapp

# Expose port 3070
EXPOSE 3070

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3070 || exit 1

# Start the application using serve
CMD ["serve", "-s", "dist", "-l", "3070"]
