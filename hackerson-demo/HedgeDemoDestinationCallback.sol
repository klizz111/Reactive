// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity >=0.8.0;

import '../lib/reactive-lib/src/abstract-base/AbstractCallback.sol';

/// @title HedgeDemoDestinationCallback
/// @notice Destination-chain callback contract that simulates opening a short by emitting an event.
contract HedgeDemoDestinationCallback is AbstractCallback {
    event ShortPositionOpened(
        address indexed reactiveSender,
        address indexed trader,
        bytes32 indexed assetId,
        uint256 orderId,
        uint256 entryPrice,
        uint256 notional,
        string venue
    );

    constructor(address _callbackSender) AbstractCallback(_callbackSender) payable {}

    /// @notice Called by Reactive Network callback proxy.
    /// @param sender RVM sender identity forwarded by Reactive callback mechanism
    /// @param trader Original trader address from source chain
    /// @param assetId Asset symbol/hash
    /// @param orderId Order id from source chain
    /// @param entryPrice Simulated short entry price on destination chain
    /// @param notional Simulated hedge notional
    function openShort(
        address sender,
        address trader,
        bytes32 assetId,
        uint256 orderId,
        uint256 entryPrice,
        uint256 notional
    ) external authorizedSenderOnly {
        emit ShortPositionOpened(
            sender,
            trader,
            assetId,
            orderId,
            entryPrice,
            notional,
            "SIMULATED_PERP"
        );
    }
}
