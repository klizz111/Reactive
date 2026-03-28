# Hackerson Demo
1. A 链源合约手动触发“资产下跌”事件；
2. Reactive 合约监听该事件并发起跨链回调；
3. B 链回调合约不做真实交易，只 `emit` 一条“已开空单”的模拟事件。

## 合约说明

- `HedgeDemoOrigin.sol`（A链）
  - 提供 `triggerPriceDrop(...)` 函数模拟价格下跌。
  - 触发 `PriceDropSimulated` 事件。

- `HedgeDemoReactive.sol`（Reactive Network）
  - 订阅 A 链 `PriceDropSimulated` 事件。
  - 在 `react(...)` 中解析日志并发起 `Callback` 到 B 链。

- `HedgeDemoDestinationCallback.sol`（B链）
  - 仅验证回调来源合法性（`authorizedSenderOnly + rvmIdOnly`）。
  - 触发 `ShortPositionOpened` 事件模拟“开空单成功”。

## 事件流（模拟）

- A链：`PriceDropSimulated(trader, assetId, oldPrice, newPrice, hedgeNotional, orderId)`
- Reactive：`HedgeSignalReceived(...)`、`HedgeCallbackSent(...)`
- B链：`ShortPositionOpened(...)`

## 操作步骤

1. 部署 A 链源合约，记录地址 `ORIGIN_ADDR`。

```bash
forge create \
  hackerson-demo/HedgeDemoOrigin.sol:HedgeDemoOrigin \
  --rpc-url "$ORIGIN_RPC" \
  --private-key "$ORIGIN_PRIVATE_KEY" \
  --broadcast 
```

2. 部署 B 链回调合约，记录地址 `DEST_ADDR`。

```bash
forge create \
  hackerson-demo/HedgeDemoDestinationCallback.sol:HedgeDemoDestinationCallback \
  --rpc-url "$DESTINATION_RPC" \
  --private-key "$ORIGIN_PRIVATE_KEY" \
  --broadcast \
  --constructor-args "$DESTINATION_CALLBACK_PROXY_ADDR" 
```

3. 部署 Reactive 合约，记录 `REACTIVE_ADDR`。

```bash
forge create \
  hackerson-demo/HedgeDemoReactive.sol:HedgeDemoReactive \
  --rpc-url "$REACTIVE_RPC" \
  --private-key "$REACTIVE_PRIVATE_KEY" \
  --broadcast \
  --value 0.1ether \
  --constructor-args \
  "$SYSTEM_CONTRACT_ADDR" \
  "$ORIGIN_CHAIN_ID" \
  "$DESTINATION_CHAIN_ID" \
  "$ORIGIN_ADDR" \
  "$DEST_ADDR" 
```

4. 在 A 链调用 `triggerPriceDrop(...)` 模拟价格下跌。

```bash
ASSET_ID=$(cast keccak "ETH")
echo "$ASSET_ID"

cast send "$ORIGIN_ADDR" \
  "triggerPriceDrop(bytes32,uint256,uint256,uint256)" \
  "$ASSET_ID" \
  3000000000000000000000 \
  2700000000000000000000 \
  1000000000000000000 \
  --rpc-url "$ORIGIN_RPC" \
  --private-key "$ORIGIN_PRIVATE_KEY"
```

5. 在浏览器或者查询B链事件日志，验证是否收到了 `ShortPositionOpened(...)` 模拟事件。

```bash
LATEST=$(cast block-number --rpc-url "$DESTINATION_RPC")
FROM=$((LATEST-1000))
cast logs \
  --rpc-url "$DESTINATION_RPC" \
  --from-block "$FROM" \
  --to-block "$LATEST" \
  --address "$DEST_ADDR" \
  "ShortPositionOpened(address,address,bytes32,uint256,uint256,uint256,string)"
```

## 说明

- 这是一个“交易所行为模拟版”对冲策略 demo，不涉及真实 DEX/永续合约交互。