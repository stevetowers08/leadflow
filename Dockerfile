FROM node:18-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy source code
COPY . .

# Remove the old index.js backup to avoid confusion
RUN rm -f index.js.backup

# Expose port
EXPOSE 8080

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Start the MCP server explicitly
CMD ["node", "mcp-http-server.js"]