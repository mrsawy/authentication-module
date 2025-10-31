# Quick Start Guide 🚀

## TL;DR - Get Running in 3 Steps

### Step 1: Generate Lock Files
```bash
# Windows
.\setup.ps1

# Linux/Mac
chmod +x setup.sh && ./setup.sh

# Or use make
make setup
```

### Step 2: Start Docker
```bash
docker-compose up -d
```

### Step 3: Access Your Apps
- Frontend: http://localhost:3001
- Backend: http://localhost:3000
- API Docs: http://localhost:3000/api/docs

## What Just Happened?

The setup script:
1. ✅ Installed pnpm (if needed)
2. ✅ Generated `pnpm-lock.yaml` files for both client and server
3. ✅ Installed all dependencies locally

Docker Compose:
1. ✅ Started MongoDB on port 27017
2. ✅ Started Redis on port 6379
3. ✅ Started NATS on ports 4222, 8222
4. ✅ Built and started NestJS server on port 3000
5. ✅ Built and started Next.js client on port 3001

## Common Commands

```bash
# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Restart everything
docker-compose restart

# Check service health
make health

# Clean everything and start fresh
make clean && make setup && make up
```

## Troubleshooting

### "pnpm-lock.yaml not found"
Run the setup script first:
```bash
make setup
```

### "Port already in use"
Check what's using the ports:
```bash
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Linux/Mac
lsof -i :3000
lsof -i :3001
```

### "Cannot connect to Docker daemon"
Make sure Docker Desktop is running.

### Reset Everything
```bash
# Stop and remove everything
docker-compose down -v

# Remove all Docker data
docker system prune -af --volumes

# Re-setup
make setup
make up
```

## Development Mode

For hot-reload during development:
```bash
docker-compose -f docker-compose.dev.yml up
```

## Testing

```bash
# Test server
cd apps/server && pnpm test

# Test client
cd apps/client && pnpm test

# Or use make
make test-all
```

## Next Steps

1. Register a new user at http://localhost:3001/signup
2. Login at http://localhost:3001/login
3. Explore the API at http://localhost:3000/api/docs
4. Check NATS monitoring at http://localhost:8222

Happy coding! 🎉