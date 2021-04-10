/* eslint-disable import/no-extraneous-dependencies */
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Contract } from 'web3-eth-contract/types/index'
import UserAbi from '@utils/User.json'
import { AbiItem } from 'web3-utils/types/index'
import { getWeb3 } from '@utils/network'

const App = () => {
  const [user, setUser] = useState<Contract>()
  const [rector, setRector] = useState()
  const [web3, setWeb3] = useState<any>()

  useEffect(() => {
    const retrieveContract = async () => {
      const web3 = getWeb3()

      if (!web3) {
        return
      }
      setWeb3(web3)
      try {
        const netId = await web3.eth.net.getId()
        const user = new web3.eth.Contract(UserAbi.abi as AbiItem[], UserAbi.networks[netId].address)
        setUser(user)
      } catch (error) {
        console.error(error)
      }
    }
    retrieveContract()
  }, [web3])

  const getRector = async () => {
    try {
      const accounts = await web3.eth.getAccounts()
      console.log(accounts)
      const rector = await user.methods.getCurrentRector().call({ from: accounts[0] })
      console.log(rector)
      setRector(rector)
    } catch (error) {
      console.log('Error getting account', error)
    }
  }

  useEffect(() => {
    if (user) {
      getRector()
    }
  }, [user])

  return (
    <div>
      <Link href='/t'>
        <a>Go to test page</a>
      </Link>

      <div>{JSON.stringify(rector)}</div>
    </div>
  )
}

export default App
