FROM mcr.microsoft.com/devcontainers/typescript-node:1-20-bookworm

# Install Foundry (forge, cast, anvil) for Solidity development
# Foundry is an alternative toolchain to Hardhat; having both gives flexibility.
RUN curl -L https://foundry.paradigm.xyz | bash \
    && /root/.foundry/bin/foundryup \
    && ln -s /root/.foundry/bin/forge /usr/local/bin/forge \
    && ln -s /root/.foundry/bin/cast /usr/local/bin/cast \
    && ln -s /root/.foundry/bin/anvil /usr/local/bin/anvil

# Set the default shell to bash
SHELL ["/bin/bash", "-c"]
