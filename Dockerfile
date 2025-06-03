# Use minimal Node image based on Debian Bullseye
FROM node:18-bullseye

# Install only what's needed for Puppeteer + Chromium
RUN apt-get update && apt-get install -y \
  chromium \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdrm2 \
  libgbm1 \
  libgtk-3-0 \
  libnss3 \
  libxcomposite1 \
  libxdamage1 \
  libxrandr2 \
  xdg-utils \
  --no-install-recommends && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

# Environment variables to skip Puppeteer Chromium download
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Create app directory and copy files
WORKDIR /app
COPY . .

# Install only production dependencies
RUN npm install --omit=dev

# Start the server
CMD ["node", "index.js"]
