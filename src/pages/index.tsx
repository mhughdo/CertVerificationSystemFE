/* eslint-disable import/no-extraneous-dependencies */
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAppState } from '@store/appState'

const Index = () => {
  const [rector, setRector] = useState()
  const { state } = useAppState()
  const { web3, userContract } = state

  useEffect(() => {
    const getRector = async () => {
      try {
        const accounts = await web3.eth.getAccounts()
        const rector = await userContract.methods.getCurrentRector().call({ from: accounts[0] })
        setRector(rector)
      } catch (error) {
        console.log('Error getting account', error)
      }
    }

    if (userContract) {
      getRector()
    }
  }, [])

  return (
    <div>
      <Link href='/t'>
        <a>Go to test page</a>
      </Link>

      <div>{JSON.stringify(rector)}</div>
    </div>
  )
}

export default Index
