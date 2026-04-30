# syntax=docker/dockerfile:1

# ─── Stage 1: Build ────────────────────────────────────────────────
# Compile the React/Vite app. Build-time env vars are passed via --build-arg
# (Coolify exposes its UI's build-arg fields here).
FROM node:24-alpine AS builder

WORKDIR /app

# Build-time environment variables (Vite inlines these into the bundle at build).
ARG VITE_API_BASE_URL
ARG VITE_TRANSPORT_API_URL
ARG VITE_COMMON_API_URL
ARG VITE_TRANSPORT_SERVICE_URL
ARG VITE_MEDIA_BASE_URL
ARG VITE_IMAGE_BASE_URL
ARG VITE_MEDIA_API_URL

ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}
ENV VITE_TRANSPORT_API_URL=${VITE_TRANSPORT_API_URL}
ENV VITE_COMMON_API_URL=${VITE_COMMON_API_URL}
ENV VITE_TRANSPORT_SERVICE_URL=${VITE_TRANSPORT_SERVICE_URL}
ENV VITE_MEDIA_BASE_URL=${VITE_MEDIA_BASE_URL}
ENV VITE_IMAGE_BASE_URL=${VITE_IMAGE_BASE_URL}
ENV VITE_MEDIA_API_URL=${VITE_MEDIA_API_URL}

# Copy package manifests first for better layer caching.
COPY package.json package-lock.json ./

# Deterministic install. Falls back to legacy-peer-deps if the install fails
# due to peer-dep conflicts (some deps in this project need it).
RUN npm ci --ignore-scripts \
    || npm install --legacy-peer-deps --ignore-scripts \
    || npm install --force --ignore-scripts

# Copy the rest of the source and build.
COPY . .
RUN npm run build


# ─── Stage 2: Runtime ──────────────────────────────────────────────
# Serve the static SPA with nginx. ~30 MB image, no Node runtime needed.
FROM nginx:1.27-alpine AS runtime

# nginx config tuned for SPA (history-mode routing) + gzip + sane caching.
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the production build from the builder stage.
COPY --from=builder /app/dist /usr/share/nginx/html

# Coolify maps its public port to whatever the container exposes; 3070 keeps
# parity with the dev port and the existing docker-compose / .env.
EXPOSE 3070

# Healthcheck: nginx serves index.html on /, so a 200 means the app is up.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://127.0.0.1:3070/ > /dev/null || exit 1

CMD ["nginx", "-g", "daemon off;"]
