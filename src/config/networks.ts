export const ASSET_HUB = {
  chainId: '0x190f1b45', // 420420421 in hex
  chainName: 'Westend Asset Hub',
  nativeCurrency: {
    name: 'WND',
    symbol: 'WND',
    decimals: 18
  },
  rpcUrls: ['https://westend-asset-hub-eth-rpc.polkadot.io'],
  blockExplorerUrls: ['https://assethub-westend.subscan.io']
};

export const SUPPORTED_CHAINS = {
  [ASSET_HUB.chainId]: ASSET_HUB
};