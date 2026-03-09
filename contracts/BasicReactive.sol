// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./interfaces/IReactive.sol";
import "./interfaces/ISubscriptionService.sol";

/**
 * @title BasicReactive
 * @notice Deployed on Reactive Network (https://reactive.network/).
 *
 * This contract subscribes to ActionTriggered events emitted by BasicOrigin on
 * the origin chain. When such an event is detected, react() is called by the
 * Reactive Network system and this contract emits a cross-chain callback to
 * BasicCallback on the destination chain.
 *
 * Flow:
 *   1. Constructor subscribes to ActionTriggered on `originChainId`/`originContract`
 *   2. Reactive Network calls react() when the subscribed event is emitted
 *   3. react() emits a Callback event which Reactive Network relays to the
 *      destination chain, calling BasicCallback.execute()
 */
contract BasicReactive is IReactive {
    /// @notice keccak256("ActionTriggered(address,uint256,uint256)")
    uint256 private constant ACTION_TRIGGERED_TOPIC =
        0x5a54e1e28473dd7a2c4e5827feff09a27a1a4e12f1dc21fde87c11b1e7eb40ca;

    /// @dev Reactive Network system contract address (Kopli testnet).
    ///      See https://dev.reactive.network/kopli-testnet#system-contract
    address private constant SYSTEM_CONTRACT = 0x0000000000000000000000000000000000fffFfF;

    /**
     * @dev Emitting this event instructs Reactive Network to send a transaction
     *      to the destination chain calling the specified selector.
     */
    event Callback(
        uint256 indexed chain_id,
        address indexed _contract,
        uint64 indexed gas_limit,
        bytes payload
    );

    ISubscriptionService private immutable service;
    uint256 public immutable originChainId;
    address public immutable originContract;
    uint256 public immutable destinationChainId;
    address public immutable destinationContract;

    /**
     * @param _originChainId        Chain ID of the origin chain to monitor.
     * @param _originContract       Address of BasicOrigin on the origin chain.
     * @param _destinationChainId   Chain ID of the destination chain.
     * @param _destinationContract  Address of BasicCallback on the destination chain.
     */
    constructor(
        uint256 _originChainId,
        address _originContract,
        uint256 _destinationChainId,
        address _destinationContract
    ) {
        service = ISubscriptionService(SYSTEM_CONTRACT);
        originChainId = _originChainId;
        originContract = _originContract;
        destinationChainId = _destinationChainId;
        destinationContract = _destinationContract;

        // Subscribe to ActionTriggered events on the origin chain
        service.subscribe(
            _originChainId,
            _originContract,
            ACTION_TRIGGERED_TOPIC,
            0,
            0,
            0
        );
    }

    /**
     * @notice Called by Reactive Network when the subscribed event fires.
     * @dev Decodes the event payload and emits a cross-chain callback.
     */
    function react(
        uint256 /* chain_id */,
        address /* _contract */,
        uint256 /* topic_0 */,
        uint256 topic_1, // sender (indexed)
        uint256 /* topic_2 */,
        uint256 /* topic_3 */,
        bytes calldata data,
        uint256 /* block_number */,
        uint256 /* op_code */
    ) external override {
        // Decode non-indexed parameters: (uint256 value, uint256 timestamp)
        (uint256 value, uint256 timestamp) = abi.decode(data, (uint256, uint256));
        address sender = address(uint160(topic_1));

        // Build the callback payload: BasicCallback.execute(sender, value, timestamp)
        bytes memory payload = abi.encodeWithSignature(
            "execute(address,uint256,uint256)",
            sender,
            value,
            timestamp
        );

        // Emit the Callback event — Reactive Network delivers this to the destination chain
        emit Callback(destinationChainId, destinationContract, 1_000_000, payload);
    }
}
