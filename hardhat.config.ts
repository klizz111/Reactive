import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const privateKey = process.env.PRIVATE_KEY ?? "";

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    // Ethereum Sepolia testnet
    sepolia: {
      url: process.env.SEPOLIA_RPC ?? "https://ethereum-sepolia-rpc.publicnode.com",
      accounts: privateKey ? [privateKey] : [],
      chainId: 11155111,
    },
    // Reactive Network Kopli testnet
    reactive: {
      url: process.env.REACTIVE_RPC ?? "https://kopli-rpc.rnk.dev/",
      accounts: privateKey ? [privateKey] : [],
      chainId: 5318008,
    },
  },
};

export default config;
