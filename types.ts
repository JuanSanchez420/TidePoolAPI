import { Pool } from "@uniswap/v3-sdk"

export interface TidePool {
    chainId: number
    address: string
    pool: Pool
    poolAddress: string
    APR?: string
}

export interface TheList {
    chainId: number
    factory: string
    tidePools: TidePool[]
}