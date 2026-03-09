import { expect } from "chai";
import { ethers } from "hardhat";

describe("BasicOrigin", function () {
  it("should emit ActionTriggered when emitEvent is called", async function () {
    const [sender] = await ethers.getSigners();
    const BasicOrigin = await ethers.getContractFactory("BasicOrigin");
    const origin = await BasicOrigin.deploy();

    const value = 42n;
    await expect(origin.emitEvent(value))
      .to.emit(origin, "ActionTriggered")
      .withArgs(sender.address, value, (ts: bigint) => ts > 0n);
  });
});

describe("BasicCallback", function () {
  async function deploy() {
    const signers = await ethers.getSigners();
    const callbackProxy = signers[0].address;
    const other = signers[1];
    const BasicCallback = await ethers.getContractFactory("BasicCallback");
    const callback = await BasicCallback.deploy(callbackProxy);
    return { callback, callbackProxy, other };
  }

  it("should store the callback proxy address", async function () {
    const { callback, callbackProxy } = await deploy();
    expect(await callback.callbackProxy()).to.equal(callbackProxy);
  });

  it("should emit CallbackReceived when called by callback proxy", async function () {
    const { callback, other } = await deploy();
    await expect(callback.execute(other.address, 100n, 9999n))
      .to.emit(callback, "CallbackReceived")
      .withArgs(other.address, 100n, 9999n);
  });

  it("should revert when called by non-proxy address", async function () {
    const { callback, other } = await deploy();
    await expect(
      (callback.connect(other) as typeof callback).execute(other.address, 1n, 1n),
    ).to.be.revertedWith("BasicCallback: caller is not callback proxy");
  });

  it("should revert on deploy with zero address proxy", async function () {
    const BasicCallback = await ethers.getContractFactory("BasicCallback");
    await expect(
      BasicCallback.deploy(ethers.ZeroAddress),
    ).to.be.revertedWith("BasicCallback: zero address");
  });
});
