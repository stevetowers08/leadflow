# Docker Desktop Deployment Guide

## Docker Desktop Setup

Since Docker Desktop isn't currently in your PATH, here's how to deploy to Docker Desktop:

### Option 1: Using Docker Desktop GUI

1. **Open Docker Desktop** on Windows

2. **Build the image:**
   - Open PowerShell in this directory
   - Run: `cd C:\Dev\Recruitement-01`
   - Run: `docker build -f Dockerfile.prod -t recruitedge-platform .`

3. **Run the container:**

   ```powershell
   docker run -p 80:80 --name recruitedge recruitedge-platform
   ```

4. **Access your app:**
   - http://localhost
   - Or share via Docker Desktop port forwarding

### Option 2: Using Docker Desktop Desktop App

1. **Build Image via UI:**
   - Open Docker Desktop
   - Go to Images tab
   - Click "Build" button
   - Set Build Context: `C:\Dev\Recruitement-01`
   - Set Dockerfile: `Dockerfile.prod`
   - Tag: `recruitedge-platform:latest`
   - Click Build

2. **Run Container:**
   - Click on the image
   - Click "Run" button
   - Set Port Mapping: `80:80`
   - Click Run

3. **Share on Internet:**
   - Right-click container in Docker Desktop
   - Select "Ports" tab
   - Enable "Expose container port to the host"
   - Or use ngrok: `ngrok http 80`

### Option 3: Docker Compose for Production

I've created `docker-compose.prod.yml` for you:

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.prod
    ports:
      - '80:80'
    restart: unless-stopped
    environment:
      - VITE_SUPABASE_URL=https://jedfundfhzytpnbjkspn.supabase.co
      - VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
```

**Run it:**

```powershell
docker-compose -f docker-compose.prod.yml up -d
```

### Exposing to Internet via ngrok

1. **Install ngrok:**

   ```powershell
   choco install ngrok
   # Or download from ngrok.com
   ```

2. **Run container:**

   ```powershell
   docker run -p 80:80 recruitedge-platform
   ```

3. **Expose via ngrok:**

   ```powershell
   ngrok http 80
   ```

4. **Copy the ngrok URL** (e.g., `https://abc123.ngrok.io`)

### Quick Start Commands

**Build:**

```powershell
docker build -f Dockerfile.prod -t recruitedge-platform .
```

**Run:**

```powershell
docker run -d -p 80:80 --name recruitedge recruitedge-platform
```

**Stop:**

```powershell
docker stop recruitedge
docker rm recruitedge
```

**View logs:**

```powershell
docker logs -f recruitedge
```

## Files Created

✅ `Dockerfile.prod` - Production Dockerfile with nginx  
✅ `nginx.conf` - Nginx configuration for SPA routing  
✅ `DOCKER_DEPLOYMENT_GUIDE.md` - This guide

## What's Different from Dev Dockerfile

- **Uses nginx** instead of Vite dev server
- **Serves static files** from `/dist` directory
- **Smaller image** (nginx:alpine vs node:18-alpine)
- **Production optimized** with gzip compression
- **Security headers** included

## Sharing on Internet

Once running on Docker Desktop, expose port 80 using one of:

1. **ngrok** (easiest): `ngrok http 80`
2. **Port forwarding**: Configure in Docker Desktop network settings
3. **Tailscale**: Use Tailscale for secure local network sharing
4. **Cloudflare Tunnel**: Free secure tunnel

Your app will be accessible via the shared URL!
