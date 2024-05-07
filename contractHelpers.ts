import { TidePool } from "./types"
import { POOL_ABI, TIDEPOOL_FACTORY_ABI, TIDEPOOL_ABI, ERC20_ABI } from "./abi"
import { Token } from "@uniswap/sdk-core"
import { Pool } from "@uniswap/v3-sdk"
import calculateAPR from "./calculateAPR"
import { Network } from "./networks"
import { PublicClient, getContract } from "viem"

export const getTidePools = async (
  network: Network,
  client: PublicClient
): Promise<string[]> => {
  const factory = getContract({
    address: network.factory as `0x${string}`,
    abi: [...TIDEPOOL_FACTORY_ABI] as const,
    publicClient: client,
  })
  const tidePools: string[] = []
  let error = false
  let index = 0n
  while (!error) {
    try {
      const tp = await factory.read.tidePools([index])
      index++
      tidePools.push(tp)
    } catch (e) {
      error = true
    }
  }
  return tidePools
}

export const getToken = async (
  network: Network,
  address: `0x${string}`,
  client: PublicClient
): Promise<Token> => {
  const contract = getContract({
    address: address,
    abi: [...ERC20_ABI] as const,
    publicClient: client,
  })

  return new Token(
    network.chainId,
    address,
    await contract.read.decimals(),
    await contract.read.symbol(),
    await contract.read.name()
  )
}

export const getPool = async (
  network: Network,
  address: `0x${string}`,
  client: PublicClient
): Promise<Pool> => {
  const contract = getContract({
    address: address,
    abi: [...POOL_ABI] as const,
    publicClient: client,
  })

  const slot0 = await contract.read.slot0()

  return new Pool(
    await getToken(network, await contract.read.token0(), client),
    await getToken(network, await contract.read.token1(), client),
    await contract.read.fee(),
    slot0[0].toString(),
    (await contract.read.liquidity()).toString(),
    slot0[1]
  )
}

export const getTidePool = async (
  network: Network,
  address: `0x${string}`,
  client: PublicClient
): Promise<TidePool | undefined> => {
  let tidePool, poolAddress, pool, APR

  try {
    tidePool = getContract({
      address: address,
      abi: [...TIDEPOOL_ABI] as const,
      publicClient: client,
    })
    poolAddress = (await tidePool.read.pool()) as `0x${string}`
    pool = await getPool(network, poolAddress, client)
    APR = await calculateAPR(pool, poolAddress, network)
  } catch (e) {
    console.log(e)
  }

  return poolAddress && pool
    ? {
        chainId: network.chainId,
        address: address,
        poolAddress,
        pool,
        APR,
      }
    : undefined
}
