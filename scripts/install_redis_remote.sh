#!/bin/bash

# Remote Redis Installation Script (With Auto-Proxy Support)
# Usage: bash install_redis_remote.sh [PORT] [PASSWORD]

DEFAULT_PORT=6379
REDIS_PORT=${1:-$DEFAULT_PORT}
REDIS_PASSWORD=${2:-$(openssl rand -hex 16)}

echo "=========================================="
echo "Starting Redis Installation on Remote Server"
echo "Port: $REDIS_PORT"
echo "Password: $REDIS_PASSWORD"
echo "=========================================="

# 0. Proxy Configuration for Docker (Critical for China servers)
configure_proxy_for_docker() {
    if [ -n "$HTTP_PROXY" ] || [ -n "$HTTPS_PROXY" ]; then
        echo "🌐 Detected Proxy in Shell Environment:"
        echo "   HTTP_PROXY: $HTTP_PROXY"
        echo "   HTTPS_PROXY: $HTTPS_PROXY"
        
        echo "⚙️  Configuring Docker Daemon to use this proxy..."
        
        mkdir -p /etc/systemd/system/docker.service.d
        cat <<EOF > /etc/systemd/system/docker.service.d/http-proxy.conf
[Service]
Environment="HTTP_PROXY=${HTTP_PROXY}"
Environment="HTTPS_PROXY=${HTTPS_PROXY}"
Environment="NO_PROXY=localhost,127.0.0.1,::1,docker-registry.somecorporation.com"
EOF
        
        # We need to reload checking if docker is installed first, 
        # but if it's not installed, we'll do it after installation.
        if command -v systemctl &> /dev/null && command -v docker &> /dev/null; then
             systemctl daemon-reload
             systemctl restart docker
             echo "✅ Docker Proxy Configured and Service Restarted."
        else
             echo "⚠️  Docker not yet installed or systemd not found. Will apply config but restart later."
        fi
    else
        echo "ℹ️  No HTTP_PROXY/HTTPS_PROXY environment variables detected."
        echo "    If you have a proxy (e.g. overseas server), please export it before running this script:"
        echo "    export HTTP_PROXY=http://ip:port; export HTTPS_PROXY=http://ip:port"
    fi
}

# Apply proxy config immediately if we have it, so that 'docker pull' later works
configure_proxy_for_docker

# 1. Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker not found. Installing Docker..."
    # The curl will respect HTTP_PROXY env var automatically
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    
    # Ensure service is started
    if command -v systemctl &> /dev/null; then
        systemctl enable docker
        systemctl start docker
        # Re-apply proxy config now that docker is installed
        configure_proxy_for_docker
    fi
    
    echo "Docker installed successfully."
else
    echo "Docker is already installed."
fi

CONTAINER_NAME="ideaflow-redis"
TARGET_IMAGE="redis:7-alpine"

# 2. Cleanup existing container
if [ "$(docker ps -a -q -f name=$CONTAINER_NAME)" ]; then
    echo "Stopping and removing existing container: $CONTAINER_NAME"
    docker stop $CONTAINER_NAME > /dev/null
    docker rm $CONTAINER_NAME > /dev/null
fi

# 3. Robust Image Pull Function
pull_image_robustly() {
    local target=$1
    
    # Strategy 1: If proxy is set, try direct pull first (Highest Probability of Success for User)
    if [ -n "$HTTP_PROXY" ] || [ -n "$HTTPS_PROXY" ]; then
        echo "Trying direct pull using configured proxy..."
        if docker pull "$target"; then
            echo "✅ Successfully pulled $target via proxy."
            return 0
        fi
        echo "⚠️  Direct pull failed even with proxy. Trying mirrors..."
    fi

    # Strategy 2: Mirrors
    local mirrors=("" "docker.1panel.live/library/" "docker.m.daocloud.io/library/" "hubs.atomgit.com/library/" "dockerproxy.com/library/")
    
    for prefix in "${mirrors[@]}"; do
        # Skip empty prefix if we already tried it in Strategy 1 (and it failed)
        if [ -z "$prefix" ] && ([ -n "$HTTP_PROXY" ] || [ -n "$HTTPS_PROXY" ]); then
            continue
        fi

        local pull_url="${prefix}${target}"
        echo "Trying to pull: ${pull_url} ..."
        
        if docker pull "$pull_url"; then
            echo "✅ Successfully pulled $pull_url"
            
            # If we used a mirror, retag it to the standard name
            if [ -n "$prefix" ]; then
                echo "Retagging $pull_url to $target..."
                docker tag "$pull_url" "$target"
                docker rmi "$pull_url"
            fi
            return 0
        else
            echo "⚠️ Failed to pull $pull_url"
        fi
    done
    
    return 1
}

# Execute Pull
echo "Pulling Redis image ($TARGET_IMAGE)..."
if ! pull_image_robustly "redis:7-alpine"; then
    echo "❌ All attempts to pull the image failed."
    echo "DEBUG INFO:"
    echo "  - Proxy set? HTTP_PROXY=$HTTP_PROXY"
    echo "  - Docker Proxy Config: /etc/systemd/system/docker.service.d/http-proxy.conf (Exists: $([ -f /etc/systemd/system/docker.service.d/http-proxy.conf ] && echo Yes || echo No))"
    echo "Please check your server's network connectivity."
    exit 1
fi

# 4. Run Redis Container
echo "Starting Redis container..."
docker run -d \
  --name "$CONTAINER_NAME" \
  --restart always \
  -p "$REDIS_PORT":6379 \
  $TARGET_IMAGE \
  redis-server --requirepass "$REDIS_PASSWORD" --appendonly yes

# 5. Verification
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    echo "=========================================="
    echo "✅ Redis installed and running successfully!"
    echo "Container Name: $CONTAINER_NAME"
    echo "Port Mapped: $REDIS_PORT"
    echo "Password: $REDIS_PASSWORD"
    echo "=========================================="
    echo ""
    echo "Please update your local .env file with these credentials:"
    echo "REDIS_HOST=<YOUR_SERVER_IP>"
    echo "REDIS_PORT=$REDIS_PORT"
    echo "REDIS_PASSWORD=$REDIS_PASSWORD"
else
    echo "❌ Failed to start Redis container."
    exit 1
fi
