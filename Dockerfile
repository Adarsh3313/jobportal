# Build the React app
FROM node:22-alpine AS web
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend ./
RUN npm run build

# Run the API + serve the built app
FROM node:22-alpine
WORKDIR /app
COPY backend ./backend
COPY --from=web /app/frontend/dist ./frontend/dist
ENV NODE_ENV=production PORT=8080 DATA_DIR=/data
VOLUME /data
EXPOSE 8080
CMD ["node", "--no-warnings", "backend/server.js"]
