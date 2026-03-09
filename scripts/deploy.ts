import { ethers } from "hardhat";

/**
 * Deployment script for the Basic Reactive Network demo.
 *
 * This script deploys the three contracts that make up the basic demo:
 *   1. BasicOrigin   — on the origin chain (emits events)
 *   2. BasicCallback — on the destination chain (receives callbacks)
 *   3. BasicReactive — on Reactive Network (subscribes & relays events)
 *
 * Usage:
 *   # Deploy origin & callback to Sepolia
 *   npx hardhat run scripts/deploy.ts --network sepolia
 *
 *   # Deploy reactive contract to Reactive Network (Kopli testnet)
 *   npx hardhat run scripts/deploy.ts --network reactive
 *
 * Required environment variables (see .env.example):
 *   PRIVATE_KEY, CALLBACK_PROXY_ADDR, ORIGIN_CONTRACT_ADDR, CALLBACK_CONTRACT_ADDR
 */
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const network = await ethers.provider.getNetwork();
  const chainId = network.chainId;
  console.log("Network chain ID:", chainId.toString());

  // ─── Step 1: Deploy BasicOrigin (origin chain) ──────────────────────────────
  if (!process.env.ORIGIN_CONTRACT_ADDR) {
    console.log("\nDeploying BasicOrigin...");
    const BasicOrigin = await ethers.getContractFactory("BasicOrigin");
    const origin = await BasicOrigin.deploy();
    await origin.waitForDeployment();
    console.log("BasicOrigin deployed to:", await origin.getAddress());
    console.log("  → Set ORIGIN_CONTRACT_ADDR in .env to", await origin.getAddress());
  }

  // ─── Step 2: Deploy BasicCallback (destination chain) ────────────────────────
  if (!process.env.CALLBACK_CONTRACT_ADDR) {
    const callbackProxy = process.env.CALLBACK_PROXY_ADDR;
    if (!callbackProxy) {
      console.warn(
        "\nSkipping BasicCallback: set CALLBACK_PROXY_ADDR in .env",
        "\nSee https://dev.reactive.network/origins-and-destinations#callback-proxy-address",
      );
    } else {
      console.log("\nDeploying BasicCallback...");
      const BasicCallback = await ethers.getContractFactory("BasicCallback");
      const callback = await BasicCallback.deploy(callbackProxy);
      await callback.waitForDeployment();
      console.log("BasicCallback deployed to:", await callback.getAddress());
      console.log("  → Set CALLBACK_CONTRACT_ADDR in .env to", await callback.getAddress());
    }
  }

  // ─── Step 3: Deploy BasicReactive (Reactive Network) ────────────────────────
  const originAddr = process.env.ORIGIN_CONTRACT_ADDR;
  const callbackAddr = process.env.CALLBACK_CONTRACT_ADDR;

  if (originAddr && callbackAddr) {
    // Sepolia chain ID = 11155111, Reactive (Kopli) = 5318008
    const SEPOLIA_CHAIN_ID = 11155111n;

    console.log("\nDeploying BasicReactive to Reactive Network...");
    const BasicReactive = await ethers.getContractFactory("BasicReactive");
    const reactive = await BasicReactive.deploy(
      SEPOLIA_CHAIN_ID,
      originAddr,
      SEPOLIA_CHAIN_ID, // destination = Sepolia (same chain for this basic demo)
      callbackAddr,
    );
    await reactive.waitForDeployment();
    console.log("BasicReactive deployed to:", await reactive.getAddress());
  } else {
    console.log(
      "\nSkipping BasicReactive deployment:",
      "set ORIGIN_CONTRACT_ADDR and CALLBACK_CONTRACT_ADDR in .env first.",
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
