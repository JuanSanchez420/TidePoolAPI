import { Token } from "@uniswap/sdk-core"

export interface Network {
  name: string
  rpc: string
  rpcPublic: string
  chainId: number
  image: string
  blockExplorer: string
  factory: string
  subgraph: string
  nativeCurrency: {
    name: string
    decimals: number
    symbol: string
  }
  icon: string
  ETHUSD: string
  WETH: Token
  USDC: Token
}
export const Ethereum: Network = {
  name: "Ethereum",
  rpc: "https://rpc.ankr.com/eth/3ec8a99c8d8a9f1d4b41cbbd6849bd882e7af57f597634fd1f39c6cb5986656f",
  rpcPublic: "https://rpc.ankr.com/eth",
  chainId: 1,
  image: "/images/ethereum.png",
  blockExplorer: "https://etherscan.io/",
  factory: "0xaF2Cf343735D6dd59f659F9CBbFb80e3d13f318d",
  subgraph: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3",
  nativeCurrency: {
    name: "Ether",
    decimals: 18,
    symbol: "ETH",
  },
  icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
  ETHUSD: "0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640",
  WETH: new Token(
    1,
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    18,
    "WETH",
    "Wrapped Ether"
  ),
  USDC: new Token(
    1,
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    6,
    "USDC",
    "USD Coin"
  ),
}

export const Arbitrum: Network = {
  name: "Arbitrum",
  rpc: "https://rpc.ankr.com/arbitrum/3ec8a99c8d8a9f1d4b41cbbd6849bd882e7af57f597634fd1f39c6cb5986656f",
  rpcPublic: "https://arb1.arbitrum.io/rpc",
  chainId: 42161,
  image: "/images/arbitrum.svg",
  blockExplorer: "https://arbiscan.io/",
  factory: "0xaf4aBF251a10b02E0E1F8501b4D720B9228eD9Dc",
  // subgraph: "https://api.thegraph.com/subgraphs/name/ianlapham/arbitrum-dev",
  subgraph:
    "https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-arbitrum-one",
  nativeCurrency: {
    name: "Ether",
    decimals: 18,
    symbol: "ETH",
  },
  icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
  ETHUSD: "0xC31E54c7a869B9FcBEcc14363CF510d1c41fa443",
  WETH: new Token(
    42161,
    "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    18,
    "WETH",
    "Wrapped Ether"
  ),
  USDC: new Token(
    42161,
    "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
    6,
    "USDC",
    "USD Coin"
  ),
}

export const Optimism: Network = {
  name: "Optimism",
  rpc: "https://rpc.ankr.com/optimism/3ec8a99c8d8a9f1d4b41cbbd6849bd882e7af57f597634fd1f39c6cb5986656f",
  rpcPublic: "https://mainnet.optimism.io",
  chainId: 10,
  image: "/images/optimism.svg",
  blockExplorer: "https://optimistic.etherscan.io/",
  factory: "0xb7c879ac00c0D73D7Ee2cFA37aa05a286a3147DA",
  subgraph:
    "https://api.thegraph.com/subgraphs/name/ianlapham/optimism-post-regenesis",
  nativeCurrency: {
    name: "Ether",
    decimals: 18,
    symbol: "ETH",
  },
  icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
  ETHUSD: "0x85149247691df622eaF1a8Bd0CaFd40BC45154a9",
  WETH: new Token(
    10,
    "0x4200000000000000000000000000000000000006",
    18,
    "WETH",
    "Wrapped Ether"
  ),
  USDC: new Token(
    10,
    "0x7F5c764cBc14f9669B88837ca1490cCa17c31607",
    6,
    "USDC",
    "USD Coin"
  ),
}

export const Polygon: Network = {
  name: "Polygon",
  rpc: "https://rpc.ankr.com/polygon/3ec8a99c8d8a9f1d4b41cbbd6849bd882e7af57f597634fd1f39c6cb5986656f",
  rpcPublic: "https://polygon-rpc.com/",
  chainId: 137,
  image: "/images/polygon.svg",
  blockExplorer: "https://polygonscan.com/",
  factory: "0x238A06c8B480F00AD9cd0556c8cb19fb96C81483",
  subgraph:
    "https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon",
  nativeCurrency: {
    name: "MATIC",
    decimals: 18,
    symbol: "MATIC",
  },
  icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png",
  ETHUSD: "0x45dDa9cb7c25131DF268515131f647d726f50608",
  WETH: new Token(
    137,
    "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    18,
    "WETH",
    "Wrapped Ether"
  ),
  USDC: new Token(
    137,
    "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    6,
    "USDC",
    "USD Coin"
  ),
}

export const BSC: Network = {
  name: "Binance",
  rpc: "https://rpc.ankr.com/bsc/3ec8a99c8d8a9f1d4b41cbbd6849bd882e7af57f597634fd1f39c6cb5986656f",
  rpcPublic: "https://bsc-dataseed.binance.org/",
  chainId: 56,
  image: "/images/bsc.svg",
  blockExplorer: "https://bscscan.com/",
  factory: "0x451d89c2Ef29F5e4b373dA42738A89B9455ec4b4",
  subgraph: "https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-bsc",
  nativeCurrency: {
    name: "BNB",
    decimals: 18,
    symbol: "BNB",
  },
  icon: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png",
  ETHUSD: "0x6fe9E9de56356F7eDBfcBB29FAB7cd69471a4869",
  WETH: new Token(
    56,
    "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
    18,
    "WBNB",
    "Wrapped BNB"
  ),
  USDC: new Token(
    56,
    "0x55d398326f99059fF775485246999027B3197955",
    18,
    "USDT",
    "Tether"
  ),
}

export const networks = {
  [Ethereum.chainId]: Ethereum,
  [Arbitrum.chainId]: Arbitrum,
  [Optimism.chainId]: Optimism,
  [Polygon.chainId]: Polygon,
  [BSC.chainId]: BSC,
}

export const getNetworkByName = (name: string) => {
  return (
    Object.values(networks).find(
      (network) => network.name.toLowerCase() === name.toLowerCase()
    ) || networks[1]
  )
}
