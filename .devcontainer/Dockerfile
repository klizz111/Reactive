# syntax=docker/dockerfile:1
FROM mcr.microsoft.com/devcontainers/base:ubuntu

# Install dependencies
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
 && apt-get install -y --no-install-recommends \
    curl ca-certificates git build-essential clang llvm lld pkg-config libssl-dev cmake unzip \
    jq \
 && rm -rf /var/lib/apt/lists/*

# Install Foundry (forge, cast, anvil)
RUN curl -L https://foundry.paradigm.xyz | bash \
 && /bin/bash -lc "source $HOME/.foundry/bin && foundryup -y"

# Ensure foundry binaries are on PATH for all users
ENV FOUNDRY_HOME=/root/.foundry
ENV PATH="$FOUNDRY_HOME/bin:${PATH}"

# Optional: install Node.js (LTS) for frontend/tooling
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash - \
 && apt-get update \
 && apt-get install -y nodejs \
 && rm -rf /var/lib/apt/lists/*

SHELL ["/bin/bash", "-lc"]