// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity >=0.8.0;

import '../lib/reactive-lib/src/interfaces/IReactive.sol';
import '../lib/reactive-lib/src/abstract-base/AbstractReactive.sol';
import '../lib/reactive-lib/src/interfaces/ISystemContract.sol';

/// @title HedgeDemoReactive
/// @notice Reactive contract that listens to source-chain simulated price-drop logs and triggers destination callback.
contract HedgeDemoReactive is IReactive, AbstractReactive {
    uint64 private constant CALLBACK_GAS_LIMIT = 1_000_000;

    uint256 public immutable sourceChainId;
    uint256 public immutable destinationChainId;
    address public immutable originContract;
    address public immutable destinationCallback;

    // keccak256("PriceDropSimulated(address,bytes32,uint256,uint256,uint256,uint256)")
    uint256 public constant PRICE_DROP_SIMULATED_TOPIC_0 =
        0xe32f5d82323e51fd55f2bc5f85447c04515d8b168a5952bfbd8b6cc2f4768d4c;

    event HedgeSignalReceived(
        address indexed trader,
        bytes32 indexed assetId,
        uint256 oldPrice,
        uint256 newPrice,
        uint256 hedgeNotional,
        uint256 indexed orderId
    );

    event HedgeCallbackSent(
        uint256 indexed destinationChain,
        address indexed callback,
        uint256 indexed orderId
    );

    constructor(
        address _service,
        uint256 _sourceChainId,
        uint256 _destinationChainId,
        address _originContract,
        address _destinationCallback
    ) payable {
        service = ISystemContract(payable(_service));

        sourceChainId = _sourceChainId;
        destinationChainId = _destinationChainId;
        originContract = _originContract;
        destinationCallback = _destinationCallback;

        if (!vm) {
            service.subscribe(
                sourceChainId,
                originContract,
                PRICE_DROP_SIMULATED_TOPIC_0,
                REACTIVE_IGNORE,
                REACTIVE_IGNORE,
                REACTIVE_IGNORE
            );
        }
    }

    function react(LogRecord calldata log) external vmOnly {
        (
            uint256 oldPrice,
            uint256 newPrice,
            uint256 hedgeNotional
        ) = abi.decode(log.data, (uint256, uint256, uint256));

        uint256 orderId = log.topic_3;

        address trader = address(uint160(log.topic_1));
        bytes32 assetId = bytes32(log.topic_2);

        emit HedgeSignalReceived(trader, assetId, oldPrice, newPrice, hedgeNotional, orderId);

        // In this demo, we use newPrice as simulated short entry price.
        bytes memory payload = abi.encodeWithSignature(
            "openShort(address,address,bytes32,uint256,uint256,uint256)",
            address(0),
            trader,
            assetId,
            orderId,
            newPrice,
            hedgeNotional
        );

        emit HedgeCallbackSent(destinationChainId, destinationCallback, orderId);
        emit Callback(destinationChainId, destinationCallback, CALLBACK_GAS_LIMIT, payload);
    }
}
