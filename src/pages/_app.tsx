/* eslint-disable no-nested-ternary */
/* eslint-disable import/no-extraneous-dependencies */
import type { AppProps /* , AppContext */ } from 'next/app'
// import 'tailwindcss/tailwind.css'
import '../styles/global.css'
import { Chakra } from '@components/Chakra'
import { useState, useEffect } from 'react'
import Loading from '@components/Loading'
import Web3Type from 'web3/types/index'
import { getWeb3 } from '@utils/network'
import Entry from '@components/Entry'
import { AppProvider, Role, useAppState, User } from '@store/appState'
import UserContract from '@contracts/User.json'
import CertContract from '@contracts/Certificate.json'
import { AbiItem } from 'web3-utils/types/index'
import { useToast } from '@chakra-ui/react'

enum Error {
  NO_METAMASK = 'Không tìm thấy MetaMask! Vui lòng cài MetaMask để tiếp tục.',
  NOT_RINKEBY = 'Vui lòng kết nối tới mạng rinkeby',
  NOT_ACTIVATED = 'Tài khoản của bạn chưa được kích hoạt. Liên hệ Phòng đào tạo để biết thêm chi tiết',
  OLD_RECTOR = 'Tài khoản hiệu trưởng của bạn đã bị huỷ kích hoạt.',
}

function SubApp({ Component, pageProps, router }: AppProps) {
  const [initLoading, setInitLoading] = useState(true)
  const [accountLoading, setAccountLoading] = useState(false)
  const [constractLoading, setContractLoading] = useState(false)
  const [userLoading, setUserLoading] = useState(false)
  const [err, setErr] = useState('')
  const toast = useToast()
  const { state, dispatch } = useAppState()
  const { web3, accountAddress, userContract, user, certContract } = state
  const loading = initLoading || accountLoading || constractLoading || userLoading
  const nonRequiredAuthRoutes = ['/register', '/student/activate']
  const { pathname } = router
  const isNonRequiredAuthRoute = nonRequiredAuthRoutes.includes(pathname)

  const isMetaMaskInstalled = () => {
    const { ethereum } = window
    return Boolean(ethereum && ethereum.isMetaMask)
  }

  useEffect(() => {
    const getAccount = async (web3: Web3Type) => {
      if (err === Error.NOT_RINKEBY) return
      setAccountLoading(true)
      const accounts = await web3.eth.getAccounts()
      console.log(accounts)

      if (accounts?.length) {
        dispatch({
          type: 'ADDRESS_CHANGE',
          accountAddress: process.env.NEXT_PUBLIC_APP_ENV === 'test' ? process.env.NEXT_PUBLIC_ADDRESS : accounts[0],
        })
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
      if (!web3 || !isMetaMaskInstalled) {
        setErr(Error.NO_METAMASK)
      }

      if (web3) {
        if (process.env.NODE_ENV === 'production') {
          await checkNetwork(web3)
        }
        await getAccount(web3)
        dispatch({ type: 'WEB3_CHANGE', web3 })
      }

      setInitLoading(false)
    }
    web3Connect()
  }, [])

  useEffect(() => {
    const retrieveContract = async () => {
      if (!accountAddress || !web3 || (userContract && certContract)) {
        return
      }
      setContractLoading(true)
      try {
        const netId = await web3.eth.net.getId()
        const networkAddress = UserContract.networks[netId]?.address && CertContract.networks[netId]?.address
        if (!networkAddress) {
          window.alert('Network address not found, please connect to rinkeby network or network ID: 1337')
          toast({
            title: 'Error.',
            description: 'Network address not found, please connect to rinkeby network or network ID: 1337!',
            status: 'error',
            duration: 3000,
            position: 'top',
          })
          return
        }
        const userContract = new web3.eth.Contract(UserContract.abi as AbiItem[], UserContract.networks[netId].address)
        const certContract = new web3.eth.Contract(CertContract.abi as AbiItem[], CertContract.networks[netId].address)

        dispatch({ type: 'CERT_CONTRACT_CHANGE', certContract })
        dispatch({ type: 'USER_CONTRACT_CHANGE', userContract })
        setContractLoading(false)
      } catch (error) {
        console.error(error)
        toast({
          title: 'Error.',
          description: 'Error occured while creating contract!',
          status: 'error',
          duration: 3000,
          position: 'top',
        })
      }
    }
    retrieveContract()
  }, [accountAddress, web3])

  useEffect(() => {
    const getCurrentUser = async () => {
      if (!userContract || err === Error.NOT_RINKEBY) return
      setUserLoading(true)
      const users = await userContract.methods.getCurrentUser().call({ from: accountAddress })
      const [, validUser] =
        (Object.entries(users).find(([, u]: [k: string, u: User]) => {
          return !!u.name
        }) as [string, undefined | any]) || []
      if (!validUser) {
        dispatch({ type: 'USER_CHANGE', user: null })
        setUserLoading(false)
        return
      }
      const role = await userContract.methods.getCurrentUserRole().call({ from: accountAddress })
      const normalizedUser = Object.entries(validUser).reduce((acc, [key, val]) => {
        if (Number.isNaN(+key)) {
          return { [key]: val, ...acc }
        }

        return acc
      }, {}) as User

      if (role.name === Role.RECTOR) {
        const currentRector = await userContract.methods.getCurrentRector().call({ from: accountAddress })
        if (normalizedUser.name !== currentRector.name) {
          dispatch({ type: 'USER_CHANGE', user: { ...normalizedUser, role: role.name, isActive: false } })
          setUserLoading(false)
          setErr(Error.OLD_RECTOR)
          return
        }
      }

      if (role.name !== Role.RECTOR && (normalizedUser as any)?.isActive === false) {
        setErr(Error.NOT_ACTIVATED)
      }

      dispatch({ type: 'USER_CHANGE', user: { ...normalizedUser, role: role.name } })
      setUserLoading(false)
    }

    getCurrentUser()
  }, [userContract, accountAddress])

  useEffect(() => {
    window?.ethereum?.on('chainChanged', (_chainId: number) => {
      return window.location.reload()
    })
    window?.ethereum?.on('accountsChanged', (accounts: string[]) => {
      setErr('')
      router.push('/')
      dispatch({ type: 'USER_CHANGE', user: null })
      dispatch({ type: 'ADDRESS_CHANGE', accountAddress: accounts[0] })
    })
  }, [])

  if (loading) {
    return (
      <Chakra cookies={pageProps.cookies}>
        <Loading />
      </Chakra>
    )
  }

  if (err || !accountAddress || (!isNonRequiredAuthRoute && !user)) {
    return (
      <Chakra cookies={pageProps.cookies}>
        <Entry err={err} />
      </Chakra>
    )
  }

  return (
    <Chakra cookies={pageProps.cookies}>
      <Component {...pageProps} />
    </Chakra>
  )
}

function MyApp({ Component, pageProps, ...restProps }: AppProps) {
  return (
    <AppProvider>
      <Chakra cookies={pageProps.cookies}>
        <SubApp Component={Component} pageProps={pageProps} {...restProps} />
      </Chakra>
    </AppProvider>
  )
}

export default MyApp
