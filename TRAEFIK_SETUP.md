# Traefik Setup for Carvane Application

## Overview
This setup uses Traefik as a reverse proxy to route traffic between your frontend and backend services with custom hostnames.

## Services Configuration

### Traefik (Reverse Proxy)
- **Dashboard**: http://localhost:8080
- **Port**: 80 (HTTP), 443 (HTTPS)

### Frontend (Next.js)
- **URL**: http://carvane.localhost
- **Internal Port**: 3000

### Backend (Go API)
- **URL**: http://api.carvane.localhost
- **Internal Port**: 8000

### Database (PostgreSQL)
- **Internal Port**: 5432
- **Not exposed externally** (only accessible within Docker network)

## Setup Instructions

### 1. Add Host Entries
You need to add the following entries to your `/etc/hosts` file:

```bash
# Run this command (requires sudo):
sudo ./setup-hosts.sh

# Or manually add these lines to /etc/hosts:
127.0.0.1 carvane.localhost
127.0.0.1 api.carvane.localhost
```

### 2. Start Services
```bash
docker-compose up -d
```

### 3. Access Your Application
- **Frontend**: http://carvane.localhost
- **Backend API**: http://api.carvane.localhost/health
- **Traefik Dashboard**: http://localhost:8080

## Testing Without Host Entries
If you can't modify the hosts file, you can test using curl with Host headers:

```bash
# Test frontend
curl -H "Host: carvane.localhost" http://localhost/

# Test backend
curl -H "Host: api.carvane.localhost" http://localhost/health
```

## API Configuration
The frontend is configured to use the new API URL through the `lib/api.ts` file:

```typescript
const API_BASE_URL = 'http://api.carvane.localhost';
```

## Benefits of This Setup
1. **Single Entry Point**: All traffic goes through port 80
2. **Custom Domains**: Easy to remember URLs
3. **Load Balancing**: Traefik can handle multiple instances
4. **SSL Ready**: Easy to add HTTPS certificates later
5. **Dashboard**: Monitor routing and services
6. **Service Discovery**: Automatic detection of new services

## Troubleshooting
- If services don't start, check: `docker-compose logs`
- If routing doesn't work, check Traefik dashboard: http://localhost:8080
- If hostnames don't resolve, verify `/etc/hosts` entries
