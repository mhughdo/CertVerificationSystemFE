/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-extraneous-dependencies */
import type { AppProps /* , AppContext */ } from 'next/app'
import '../styles/globals.css'
import { Chakra } from '@components/Chakra'
import { useState, useEffect } from 'react'
import Loading from '@components/Loading'
import Web3Type from 'web3/types/index'
import { getWeb3 } from '@utils/network'
import Login from '@components/Login'

function MyApp({ Component, pageProps }: AppProps) {
  const [isOnCorrectNet, setIsOnCorrectNet] = useState(false)
  const [loading, setLoading] = useState(true)
  const [web3, setWeb3] = useState<Web3Type>()
  const [account, setAccount] = useState('')
  const [accountLoading, setAccountLoading] = useState(true)

  useEffect(() => {
    const getAccount = async (web3: Web3Type) => {
      if (web3) {
        const accounts = await web3.eth.getAccounts()

        if (accounts?.length) {
          setAccount(accounts[0])
        }
      }
      setAccountLoading(false)
    }

    const checkNetwork = async (web3: Web3Type) => {
      try {
        const networkId = await web3?.eth.net.getId()
        const isOnRightNet = networkId === 4
        setIsOnCorrectNet(isOnRightNet)
      } catch (error) {
        console.error(error)
      }
    }

    const getContract = async () => {
      const web3 = getWeb3()
      await checkNetwork(web3)
      await getAccount(web3)
      if (web3) {
        setWeb3(web3)
      }

      setLoading(false)
    }
    getContract()
  }, [])

  return (
    <Chakra cookies={pageProps.cookies}>
      {loading || accountLoading ? <Loading /> : !account || !web3 ? <Login /> : <Component {...pageProps} />}
    </Chakra>
  )
}

export default MyApp
