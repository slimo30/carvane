#!/bin/bash

# Script to add carvane.localhost and api.carvane.localhost to /etc/hosts
# Run with: sudo ./setup-hosts.sh

echo "Adding carvane.localhost and api.carvane.localhost to /etc/hosts..."

# Check if entries already exist
if grep -q "carvane.localhost" /etc/hosts; then
    echo "carvane.localhost already exists in /etc/hosts"
else
    echo "127.0.0.1 carvane.localhost" >> /etc/hosts
    echo "Added carvane.localhost to /etc/hosts"
fi

if grep -q "api.carvane.localhost" /etc/hosts; then
    echo "api.carvane.localhost already exists in /etc/hosts"
else
    echo "127.0.0.1 api.carvane.localhost" >> /etc/hosts
    echo "Added api.carvane.localhost to /etc/hosts"
fi

echo "Hosts file updated successfully!"
echo ""
echo "You can now access:"
echo "  Frontend: http://carvane.localhost"
echo "  Backend API: http://api.carvane.localhost"
echo "  Traefik Dashboard: http://localhost:8080"
