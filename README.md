# Reactive Network

> Repository for studying [Reactive Network](https://reactive.network/) — an EVM automation layer for event-driven, cross-chain smart contracts.

A **Hardhat + Solidity** development environment pre-configured for GitHub Codespaces.

## What is Reactive Network?

[Reactive Network](https://reactive.network/) is a blockchain protocol built around **Reactive Contracts (RCs)** — Solidity smart contracts that automatically react to on-chain events across EVM chains. Instead of requiring users or bots to submit transactions, Reactive Contracts listen for events on any EVM chain and execute callbacks autonomously.

```
Origin Chain             Reactive Network          Destination Chain
────────────             ────────────────          ─────────────────
BasicOrigin              BasicReactive             BasicCallback
  emitEvent()  ──event──▶  react()       ──call──▶  execute()
```

## 🚀 Getting Started with GitHub Codespaces

1. Click the green **Code** button at the top of this repository.
2. Select the **Codespaces** tab → **Create codespace on main**.

The environment will automatically:
- Install Node.js 20 and Foundry (forge, cast, anvil)
- Install all npm dependencies (`npm install`)
- Configure VS Code with Solidity, Hardhat, ESLint, and Prettier extensions

---

## 📁 Project Structure

```
.
├── .devcontainer/
│   ├── devcontainer.json       # GitHub Codespaces configuration
│   └── Dockerfile              # Dev container (Node.js 20 + Foundry)
├── contracts/
│   ├── interfaces/
│   │   ├── IReactive.sol       # Interface all Reactive Contracts implement
│   │   └── ISubscriptionService.sol  # Reactive Network subscription interface
│   ├── BasicOrigin.sol         # Origin chain contract (emits events)
│   ├── BasicCallback.sol       # Destination chain contract (receives callbacks)
│   └── BasicReactive.sol       # Reactive Network contract (subscribes & relays)
├── scripts/
│   └── deploy.ts               # Deployment script
├── test/
│   └── Basic.test.ts           # Hardhat tests for origin & callback contracts
├── hardhat.config.ts           # Hardhat configuration (Sepolia + Reactive Kopli)
├── .env.example                # Environment variable template
└── package.json
```

---

## 🛠️ Local Development

### Prerequisites

- Node.js 20+

### Setup

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env
# Edit .env and fill in your PRIVATE_KEY
```

### Compile Contracts

```bash
npm run compile
```

### Run Tests (local Hardhat network)

```bash
npm test
```

### Deploy

```bash
# Step 1: Deploy BasicOrigin and BasicCallback to Sepolia
npm run deploy:sepolia

# Step 2: After setting ORIGIN_CONTRACT_ADDR and CALLBACK_CONTRACT_ADDR in .env,
#         deploy BasicReactive to Reactive Network (Kopli testnet)
npm run deploy:reactive
```

---

## 📋 Contracts

### `BasicOrigin.sol` — Origin Chain

Emits an `ActionTriggered` event when `emitEvent(value)` is called. Deploy this on any EVM chain (e.g. Ethereum Sepolia).

### `BasicReactive.sol` — Reactive Network

Subscribes to `ActionTriggered` events from `BasicOrigin`. When triggered, emits a `Callback` event that Reactive Network relays to the destination chain. Deploy this on the [Reactive Network Kopli testnet](https://dev.reactive.network/kopli-testnet).

### `BasicCallback.sol` — Destination Chain

Receives cross-chain callbacks from Reactive Network via the [callback proxy](https://dev.reactive.network/origins-and-destinations#callback-proxy-address). Emits `CallbackReceived` upon successful execution.

---

## 🔑 Environment Variables

See `.env.example` for all required variables:

| Variable | Description |
|---|---|
| `PRIVATE_KEY` | Wallet private key for signing transactions |
| `SEPOLIA_RPC` | Ethereum Sepolia RPC URL |
| `REACTIVE_RPC` | Reactive Network (Kopli) RPC URL |
| `CALLBACK_PROXY_ADDR` | Reactive Network callback proxy on destination chain |
| `ORIGIN_CONTRACT_ADDR` | Deployed address of `BasicOrigin` |
| `CALLBACK_CONTRACT_ADDR` | Deployed address of `BasicCallback` |

---

## 🌐 Useful Links

- [Reactive Network Documentation](https://dev.reactive.network/)
- [Kopli Testnet Info](https://dev.reactive.network/kopli-testnet)
- [Kopli Faucet](https://kopli.reactscan.net/faucet)
- [ReactScan Explorer](https://kopli.reactscan.net/)
- [Reactive Smart Contract Demos](https://github.com/Reactive-Network/reactive-smart-contract-demos)
- [Hardhat Documentation](https://hardhat.org/docs)
