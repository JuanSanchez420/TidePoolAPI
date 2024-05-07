import { TickMath, tickToPrice } from "@uniswap/v3-sdk"
import request, { gql } from "graphql-request"
import JSBI from "jsbi"
import { Network } from "./networks"
import sleep from "./sleep"
import { parseEther } from "viem"

export interface Ticks {
  ticks: Tick[]
}

export interface Tick {
  tickIdx: string
  liquidityNet: string
}

export interface VolumeUSD {
  volumeUSD: string
}

interface TickData {
  pool: {
    tick: bigint | JSBI
  }
}

export const getETHUSD = async (network: Network): Promise<number> => {
  const q = gql`
    {
      pool(id: "${network.ETHUSD.toLowerCase()}") {
        tick
      }
    }
    `
  const r: TickData = await request(network.subgraph, q)

  const tick = Number(r.pool.tick)
  const str = tickToPrice(network.WETH, network.USDC, tick).toFixed(0)

  return Number(str)
}

interface TokenData {
  token: {
    derivedETH: string
  }
}

export const getDerivedETHValue = async (
  token: string,
  network: Network
): Promise<bigint> => {
  const q = gql`
      {
        token(id: "${token.toLowerCase()}") {
          derivedETH
        }
      }
    `
  const r: TokenData = await request(network.subgraph, q)
  const parts = r.token.derivedETH.split(".")
  const whole = parts[0]
  const decimals =
    parts[1] && parts[1].length < 18
      ? parts[1]
      : parts[1]
      ? parts[1].substring(0, 17)
      : "0"
  return parseEther(`${whole}.${decimals}`)
}

interface PoolDayData {
  poolDayDatas: {
    volumeUSD: string
  }[]
}

const getVolume24 = async (
  pool: string,
  network: Network
): Promise<VolumeUSD> => {
  // get the previous full day of volume data
  const q = gql`
      {
        poolDayDatas(
          first: 2
          orderBy: date
          orderDirection: desc
          where: { pool: "${pool.toLowerCase()}" }
        ) {
          volumeUSD
        }
      }
    `
  const r: PoolDayData = await request(network.subgraph, q)

  return r.poolDayDatas[1]
}

export const getVolume = async (pool: string, network: Network) => {
  const r = await getVolume24(pool, network)
  return parseInt(r.volumeUSD)
}

interface TicksData {
  ticks: {
    tickIdx: string
    liquidityNet: string
  }[]
}

const getTicksByPage = async (
  pool: string,
  page: number,
  lower: number,
  upper: number,
  network: Network
): Promise<Tick[]> => {
  const getTicks = gql`
    {
      ticks(first: 1000, skip: ${
        page * 1000
      }, where: { pool: "${pool.toLowerCase()}", tickIdx_gte: "${lower}", tickIdx_lte: "${upper}"}, orderBy: tickIdx) {
        tickIdx
        liquidityNet
      }
    }
    `
  const r: TicksData = await request(network.subgraph, getTicks)

  return r.ticks
}

const getTicks = async (
  pool: string,
  lower: number,
  upper: number,
  network: Network
) => {
  let ticks: Tick[] = []
  let page = 0

  while (true) {
    const r = await getTicksByPage(pool, page, lower, upper, network)
    ticks = ticks.concat(r)

    if (r.length === 1000) {
      page++
    } else {
      break
    }
    await sleep(500)
  }
  return ticks
}

const sumNetLiquidity = (ticks: Tick[]) => {
  let total = 0n
  ticks.forEach((t) => {
    total = total + BigInt(t.liquidityNet)
  })
  return total
}

export const getLiquidity = async (
  pool: string,
  network: Network,
  lower?: number,
  upper?: number
) => {
  const ticks = await getTicks(
    pool,
    lower ?? TickMath.MIN_TICK,
    upper ?? TickMath.MAX_TICK,
    network
  )
  const sum = sumNetLiquidity(ticks)
  return sum
}
