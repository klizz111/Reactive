// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title BasicOrigin
 * @notice Deployed on an origin chain (e.g. Ethereum Sepolia).
 *
 * This contract simply emits an event. A Reactive Contract deployed on
 * Reactive Network subscribes to that event and triggers a callback to
 * the destination chain when it fires.
 *
 * Flow:
 *   1. User calls emitEvent() on this contract (origin chain)
 *   2. BasicReactive on Reactive Network detects the event
 *   3. BasicReactive sends a callback to BasicCallback (destination chain)
 */
contract BasicOrigin {
    /// @notice Emitted whenever a user triggers an action on this contract.
    event ActionTriggered(address indexed sender, uint256 value, uint256 timestamp);

    /**
     * @notice Emit an event to be picked up by a Reactive Contract.
     * @param value Arbitrary value to include in the event payload.
     */
    function emitEvent(uint256 value) external {
        emit ActionTriggered(msg.sender, value, block.timestamp);
    }
}
