import Web3 from 'web3'
import Web3Type from 'web3/types/index'

declare global {
  interface Window {
    ethereum: any
    web3: any
  }
}

let web3: Web3Type
export function getWeb3() {
  const { INFURA_PROJECT_ID } = process.env
  if (process.env.NODE_ENV === 'production' && !INFURA_PROJECT_ID) {
    console.log('Erro: INFURA_PROJECT_ID env not found')
    return null
  }

  const URL =
    process.env.NODE_ENV === 'production'
      ? `wss://mainnet.infura.io/ws/v3/${process.env.INFURA_PROJECT_ID}`
      : 'HTTP://127.0.0.1:8545'

  if (!web3) {
    web3 = new Web3(window?.ethereum || (window?.web3 && window.web3.currentProvider) || URL)
  }
  return web3
}
