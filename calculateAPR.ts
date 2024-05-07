import { Fraction } from "@uniswap/sdk-core"
import {
  nearestUsableTick,
  Pool,
  TickMath,
  maxLiquidityForAmounts,
  FeeAmount,
} from "@uniswap/v3-sdk"
import JSBI from "jsbi"
import { Network } from "./networks"
import { getDerivedETHValue, getETHUSD, getVolume } from "./subgraph"
import { parseUnits, parseEther } from "viem"

const depositAmount = 1000 // USD

const estimateRange = (pool: Pool) => {
  const tick = pool ? pool.tickCurrent : 0
  const tickSpacing = pool ? pool?.tickSpacing : 10

  const multiplier =
    pool?.tickSpacing === 200 ? 20 : pool?.tickSpacing === 60 ? 60 : 200

  return [
    nearestUsableTick(tick - multiplier * tickSpacing, tickSpacing),
    nearestUsableTick(tick + multiplier * tickSpacing, tickSpacing),
  ]
}

const calculateAPR = async (
  pool: Pool,
  poolAddress: string,
  network: Network
) => {
  const ETHUSD = await getETHUSD(network)

  const token0ETHValue = network.WETH.equals(pool.token0)
    ? parseEther("1")
    : await getDerivedETHValue(pool.token0.address, network)
  const token1ETHValue = network.WETH.equals(pool.token1)
    ? parseEther("1")
    : await getDerivedETHValue(pool.token1.address, network)
  const amountInETH = parseEther(String(depositAmount / 2 / ETHUSD))

  const wei0 = network.WETH.equals(pool.token0)
    ? amountInETH
    : token0ETHValue > 0n
      ? parseUnits(
        (amountInETH / token0ETHValue).toString(),
        pool.token0.decimals
      )
      : 0n
  const wei1 = network.WETH.equals(pool.token1)
    ? amountInETH
    : token1ETHValue > 0n
      ? parseUnits(
        (amountInETH / token1ETHValue).toString(),
        pool.token1.decimals
      )
      : 0n

  const [lower, upper] = estimateRange(pool)

  const positionLiquidity = maxLiquidityForAmounts(
    pool.sqrtRatioX96,
    TickMath.getSqrtRatioAtTick(lower),
    TickMath.getSqrtRatioAtTick(upper),
    wei0.toString(),
    wei1.toString(),
    true
  )

  const volume = await getVolume(poolAddress.toLowerCase(), network)

  if (JSBI.EQ(pool.liquidity, "0")) return "0"

  const share = new Fraction(
    positionLiquidity.toString(),
    JSBI.add(
      positionLiquidity,
      JSBI.BigInt(pool.liquidity.toString())
    ).toString()
  )

  const fee = pool.fee ? pool.fee / 1000000 : FeeAmount.LOWEST / 1000000
  const result = volume * fee * parseFloat(share.toFixed(10))

  return ((result * 100 * 365) / depositAmount).toFixed(2)
}

export default calculateAPR
