import 'dotenv/config'
import { restoreWallet, getSigningCosmWasmClient } from '@sei-js/core'
import { calculateFee } from '@cosmjs/stargate'

const wallet = await restoreWallet(process.env.SEED_PHRASE, 0)
const client = await getSigningCosmWasmClient('https://sei-rpc.polkachu.com/', wallet)
const accounts = await wallet.getAccounts()

const data = btoa(`data:,${JSON.stringify({ p: 'sei-20', op: 'mint', tick: 'seis', amt: '1000' })}`)
const fee = calculateFee(1e5, '0.1usei')

function mint() {
  return client.sendTokens(
    accounts[0].address,
    accounts[0].address,
    [
      {
        amount: '1',
        denom: 'usei',
      },
    ],
    fee,
    data
  )
}

async function run() {
  while (true) {
    try {
      const res = await mint()
      console.log(`https://www.seiscan.app/pacific-1/txs/${res.transactionHash}`)
    } catch (e) {
      console.log(e)
    }
  }
}

run()
