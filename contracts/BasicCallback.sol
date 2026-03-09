// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title BasicCallback
 * @notice Deployed on a destination chain (e.g. Ethereum Sepolia).
 *
 * This contract receives cross-chain callbacks from Reactive Network.
 * The callback proxy address is set at deployment time; only that address
 * is allowed to call execute(), ensuring callbacks cannot be spoofed.
 *
 * Flow:
 *   1. BasicOrigin emits ActionTriggered on the origin chain
 *   2. BasicReactive on Reactive Network detects the event and calls execute()
 *      via the Reactive callback proxy on this destination chain
 */
contract BasicCallback {
    /// @notice Emitted when a cross-chain callback is successfully processed.
    event CallbackReceived(address indexed sender, uint256 value, uint256 timestamp);

    /// @notice Address of the Reactive Network callback proxy.
    address public immutable callbackProxy;

    /// @dev Reverts if the caller is not the authorised callback proxy.
    modifier onlyCallbackProxy() {
        require(msg.sender == callbackProxy, "BasicCallback: caller is not callback proxy");
        _;
    }

    /**
     * @param _callbackProxy The Reactive Network callback proxy address for this chain.
     *        See https://dev.reactive.network/origins-and-destinations#callback-proxy-address
     */
    constructor(address _callbackProxy) {
        require(_callbackProxy != address(0), "BasicCallback: zero address");
        callbackProxy = _callbackProxy;
    }

    /**
     * @notice Called by the Reactive callback proxy when the Reactive Contract fires.
     * @param sender    Address that triggered the original event on the origin chain.
     * @param value     Value that was passed to the origin contract.
     * @param timestamp Timestamp from the origin transaction.
     */
    function execute(address sender, uint256 value, uint256 timestamp) external onlyCallbackProxy {
        emit CallbackReceived(sender, value, timestamp);
    }
}
