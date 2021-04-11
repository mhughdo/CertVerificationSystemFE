/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-extraneous-dependencies */
import type { AppProps /* , AppContext */ } from 'next/app'
import 'tailwindcss/tailwind.css'
import { Chakra } from '@components/Chakra'
import { useState, useEffect } from 'react'
import Loading from '@components/Loading'
import Web3Type from 'web3/types/index'
import { getWeb3 } from '@utils/network'
import Entry from '@components/Entry'
import { AppProvider } from '@store/appState'

enum Error {
  NO_METAMASK = 'Metamask not found! Please install MetaMask to continue.',
  NOT_RINKEBY = 'Please connect to rinkeby network',
}

function MyApp({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState(true)
  const [web3, setWeb3] = useState<Web3Type>()
  const [account, setAccount] = useState('')
  const [accountLoading, setAccountLoading] = useState(false)
  const [err, setErr] = useState('')

  useEffect(() => {
    const getAccount = async (web3: Web3Type) => {
      setAccountLoading(true)
      const accounts = await web3.eth.getAccounts()

      if (accounts?.length) {
        setAccount(accounts[0])
      }
      setAccountLoading(false)
    }

    const checkNetwork = async (web3: Web3Type) => {
      try {
        const networkId = await web3?.eth.net.getId()

        // Rinkeby network
        const isOnRightNet = networkId === 4
        if (!isOnRightNet) {
          setErr(Error.NOT_RINKEBY)
        }
      } catch (error) {
        console.error(error)
      }
    }

    const web3Connect = async () => {
      const web3 = getWeb3()
      if (!web3) {
        setErr(Error.NO_METAMASK)
      }

      if (web3) {
        await checkNetwork(web3)
        await getAccount(web3)
        setWeb3(web3)
      }

      setLoading(false)
    }
    web3Connect()
  }, [])

  useEffect(() => {
    window?.ethereum?.on('chainChanged', (_chainId: number) => window.location.reload())
    window?.ethereum?.on('accountsChanged', (accounts: string[]) => {
      setAccount(accounts[0])
    })
  }, [])

  if (loading || accountLoading) {
    return (
      <Chakra cookies={pageProps.cookies}>
        <Loading />
      </Chakra>
    )
  }

  if (err || !account) {
    return (
      <Chakra cookies={pageProps.cookies}>
        <Entry err={err} />
      </Chakra>
    )
  }

  return (
    <AppProvider value={{ account, web3 }}>
      <Chakra cookies={pageProps.cookies}>
        <Component {...pageProps} />
      </Chakra>
    </AppProvider>
  )
}

export default MyApp
