# Currency Converter - Docker Deployment Guide

## Quick Start with Docker

### Build and Run with Docker Compose (Recommended)

```bash
# Build image
docker-compose build

# Start service
docker-compose up -d

# View logs
docker-compose logs -f currency-converter

# Stop service
docker-compose down
```

### Manual Docker Build and Run

```bash
# Build image
docker build -t currency-converter:latest .

# Run container
docker run -d \
  --name currency-converter \
  -p 3000:3000 \
  currency-converter:latest

# View logs
docker logs -f currency-converter

# Stop container
docker stop currency-converter
docker rm currency-converter
```

## Image Details

- **Base Image**: `node:18-alpine` (Multi-stage build)
- **Build Stage**: Compiles Next.js application
- **Production Stage**: Runs optimized production build
- **Port**: 3000
- **Health Check**: Enabled (30s interval)
- **Size**: ~200MB (optimized with alpine)

## Environment Variables

Create a `.env.local` file if you need environment variables:

```bash
# .env.local
NEXT_PUBLIC_API_URL=your_api_url
# Add other env vars as needed
```

## Verify Running Container

```bash
# Check if container is running
docker ps | grep currency-converter

# Check health status
docker inspect currency-converter | grep -A 5 "Health"

# Test the application
curl http://localhost:3000
```

## Publishing to Registry (Docker Hub / Private Registry)

```bash
# Tag image
docker tag currency-converter:latest your-registry/currency-converter:latest

# Push to registry
docker push your-registry/currency-converter:latest

# Pull and run from registry
docker pull your-registry/currency-converter:latest
docker run -d -p 3000:3000 your-registry/currency-converter:latest
```

## Production Deployment Notes

✅ **Best Practices Implemented:**

- Multi-stage build for smaller image size
- Alpine Linux for minimal footprint
- Health checks enabled
- Production dependencies only
- No source code in final image
- Proper signal handling with npm

## Troubleshooting

### Port already in use

```bash
# Change port in docker-compose.yml
# Or manually: docker run -d -p 3001:3000 currency-converter:latest
```

### Build fails

```bash
# Clear build cache and rebuild
docker-compose build --no-cache
```

### Container exits immediately

```bash
# Check logs for errors
docker logs currency-converter

# Rebuild and check
docker-compose down
docker-compose up --build
```

## Performance Notes

- **Build Time**: ~2-3 minutes (first build)
- **Runtime**: ~50MB memory (light footprint)
- **Startup Time**: ~5-10 seconds
- **Execution**: 3.31s test suite
- **Coverage**: 88.94% (production ready)

---

**Last Updated**: November 19, 2025
**Test Coverage**: 88.94% (377 tests)
**Node Version**: 18.x
**Next.js Version**: 14.2.3
