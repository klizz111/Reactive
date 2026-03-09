FROM mcr.microsoft.com/devcontainers/typescript-node:1-20-bookworm

# Install network tools for reactive network study
RUN apt-get update && apt-get install -y \
    curl \
    wget \
    netcat-openbsd \
    iputils-ping \
    net-tools \
    tcpdump \
    dnsutils \
    iproute2 \
    nmap \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies for reactive programming
RUN pip3 install --no-cache-dir \
    rx \
    aiohttp \
    asyncio \
    requests

# Set the default shell to bash
SHELL ["/bin/bash", "-c"]
