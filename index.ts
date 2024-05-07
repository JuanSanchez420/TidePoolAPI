import { TheList } from "./types"
import { getTidePool, getTidePools } from "./contractHelpers"
import { readFile, writeFile } from "fs/promises"
import {
  Arbitrum,
  Ethereum,
  getNetworkByName,
  Network,
  Optimism,
  Polygon,
  BSC,
} from "./networks"
import express from "express"
import sleep from "./sleep"
import { Chain, createPublicClient, http } from "viem"
import { arbitrum, bsc, mainnet, optimism, polygon } from "viem/chains"

export const BUILD_DIRECTORY = "/var/www/TidePoolFrontend/build"

const getChain = (network: Network): Chain => {
  switch (network.name) {
    case "Ethereum":
      return mainnet
    case "Arbitrum":
      return arbitrum
    case "Optimism":
      return optimism
    case "Polygon":
      return polygon
    default:
      return bsc
  }
}

const compile = async (network: Network): Promise<TheList> => {
  console.log(`compiling list on ${network.chainId}`)
  let theList: TheList = {
    chainId: network.chainId,
    factory: network.factory,
    tidePools: [],
  }

  const client = createPublicClient({
    chain: getChain(network),
    transport: http(network.rpc),
    pollingInterval: 200_000,
  })

  const tidePools = await getTidePools(network, client)

  for (const i of tidePools) {
    const tp = await getTidePool(network, i as `0x${string}`, client)
    if (tp) theList.tidePools.push(tp)
  }

  console.log(`found ${tidePools.length} tidePools on ${network.chainId}`)

  return theList
}

const main = async () => {
  const exe = async (network: Network) => {
    const c = await compile(network)
    await writeFile(
      `${BUILD_DIRECTORY}/${network.chainId}.json`,
      JSON.stringify(c)
    )
  }

  ;[Ethereum, Arbitrum, Optimism, Polygon, BSC].forEach((i) => exe(i))
}

main().catch((e) => console.log(e))

setInterval(() => main().catch((e) => console.log(e)), 1000 * 60 * 60 * 24)

const app = express()
const port = 5555

app.get("/poolcreated", async (req: express.Request, res: express.Response) => {
  const network = getNetworkByName(req.query.network as string)
  const address = req.query.address as `0x${string}`
  await sleep(10000)
  console.log(`TidePoolCreated: ${network.name} ${address}`)
  try {
    const file = await readFile(`${BUILD_DIRECTORY}/${network.chainId}.json`)
    const json: TheList = JSON.parse(file.toString())
    const client = createPublicClient({
      chain: getChain(network),
      transport: http(network.rpc),
    })
    const tp = await getTidePool(network, address, client)
    if (tp) json.tidePools.push(tp)

    await writeFile(
      `${BUILD_DIRECTORY}/${network.chainId}.json`,
      JSON.stringify(json)
    )
  } catch (e) {
    console.log(e)
  }
  res.send(true)
})

app.listen(port, () => {
  console.log(`Express listening at http://localhost:${port}`)
})
