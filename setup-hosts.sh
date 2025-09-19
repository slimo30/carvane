#!/bin/bash

# Script to add all carvane.localhost domains to /etc/hosts
# Run with: sudo ./setup-hosts.sh

echo "Adding all carvane.localhost domains to /etc/hosts..."

# Define all the domains
domains=(
    "carvane.localhost"
    "api.carvane.localhost"
    "restaurant-dashboard.carvane.localhost"
    "minio.carvane.localhost"
    "minio-console.carvane.localhost"
)

# Add each domain if it doesn't exist
for domain in "${domains[@]}"; do
    if grep -q "$domain" /etc/hosts; then
        echo "$domain already exists in /etc/hosts"
    else
        echo "127.0.0.1 $domain" >> /etc/hosts
        echo "Added $domain to /etc/hosts"
    fi
done

echo ""
echo "Hosts file updated successfully!"
echo ""
echo "You can now access:"
echo "  Main Frontend: http://carvane.localhost"
echo "  Restaurant Dashboard: http://restaurant-dashboard.carvane.localhost"
echo "  Backend API: http://api.carvane.localhost"
echo "  MinIO API: http://minio.carvane.localhost"
echo "  MinIO Console: http://minio-console.carvane.localhost"
echo "  Traefik Dashboard: http://localhost:8080"