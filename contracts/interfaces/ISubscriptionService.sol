// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title ISubscriptionService
 * @notice Interface for the Reactive Network subscription system contract.
 *
 * Reactive Contracts call `subscribe()` during construction to register which
 * events they want to observe. When a matching event is emitted on the
 * specified chain, Reactive Network calls `react()` on the subscriber.
 *
 * See https://dev.reactive.network for full documentation.
 */
interface ISubscriptionService {
    /**
     * @notice Subscribe to events emitted by a specific contract on a specific chain.
     * @param chain_id  Chain ID to monitor.
     * @param _contract Contract address to monitor (use address(0) for any contract).
     * @param topic_0   Event signature hash to filter on (use 0 for any event).
     * @param topic_1   First indexed parameter filter (use 0 for any value).
     * @param topic_2   Second indexed parameter filter (use 0 for any value).
     * @param topic_3   Third indexed parameter filter (use 0 for any value).
     */
    function subscribe(
        uint256 chain_id,
        address _contract,
        uint256 topic_0,
        uint256 topic_1,
        uint256 topic_2,
        uint256 topic_3
    ) external;

    /**
     * @notice Unsubscribe from a previously registered event subscription.
     */
    function unsubscribe(
        uint256 chain_id,
        address _contract,
        uint256 topic_0,
        uint256 topic_1,
        uint256 topic_2,
        uint256 topic_3
    ) external;
}
