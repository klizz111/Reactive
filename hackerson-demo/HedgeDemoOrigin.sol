// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity >=0.8.0;

/// @title HedgeDemoOrigin
/// @notice Source-chain contract that simulates a price drop event.
contract HedgeDemoOrigin {
    event PriceDropSimulated(
        address indexed trader,
        bytes32 indexed assetId,
        uint256 oldPrice,
        uint256 newPrice,
        uint256 hedgeNotional,
        uint256 indexed orderId
    );

    uint256 public nextOrderId = 1;

    /// @notice Simulate a price drop on chain A.
    /// @param assetId Asset symbol/hash, e.g. keccak256("ETH")
    /// @param oldPrice Previous price in 1e18 precision
    /// @param newPrice New price in 1e18 precision
    /// @param hedgeNotional Notional amount to hedge on chain B
    function triggerPriceDrop(
        bytes32 assetId,
        uint256 oldPrice,
        uint256 newPrice,
        uint256 hedgeNotional
    ) external {
        require(newPrice < oldPrice, "newPrice must be lower");
        require(hedgeNotional > 0, "hedgeNotional=0");

        uint256 orderId = nextOrderId++;

        emit PriceDropSimulated(
            msg.sender,
            assetId,
            oldPrice,
            newPrice,
            hedgeNotional,
            orderId
        );
    }
}
