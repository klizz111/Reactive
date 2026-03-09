// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title IReactive
 * @notice Interface that all Reactive Contracts must implement.
 *
 * Reactive Contracts are deployed on Reactive Network and respond
 * to on-chain events from any EVM-compatible chain. When a subscribed
 * event is detected, `react()` is called by the Reactive Network system.
 *
 * See https://dev.reactive.network for full documentation.
 */
interface IReactive {
    /**
     * @notice Called by Reactive Network when a subscribed event is detected.
     * @param chain_id       Chain ID of the origin chain that emitted the event.
     * @param _contract      Address of the contract that emitted the event.
     * @param topic_0        First topic (event signature hash).
     * @param topic_1        Second topic (indexed parameter 1).
     * @param topic_2        Third topic (indexed parameter 2).
     * @param topic_3        Fourth topic (indexed parameter 3).
     * @param data           ABI-encoded non-indexed event parameters.
     * @param block_number   Block number of the origin transaction.
     * @param op_code        Reserved for future use; currently always 0.
     */
    function react(
        uint256 chain_id,
        address _contract,
        uint256 topic_0,
        uint256 topic_1,
        uint256 topic_2,
        uint256 topic_3,
        bytes calldata data,
        uint256 block_number,
        uint256 op_code
    ) external;
}
