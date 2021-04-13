/* eslint-disable import/no-extraneous-dependencies */
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAppState } from '@store/appState'
import Layout from '@components/Layout'

const Index = () => {
  const { state } = useAppState()
  const { web3, userContract } = state

  // useEffect(() => {
  //   const getRector = async () => {
  //     try {
  //       const accounts = await web3.eth.getAccounts()
  //       const rector = await userContract.methods.getCurrentRector().call({ from: accounts[0] })
  //       setRector(rector)
  //     } catch (error) {
  //       console.log('Error getting account', error)
  //     }
  //   }

  //   if (userContract) {
  //     getRector()
  //   }
  // }, [])

  return (
    <Layout>
      <Link href='/t'>
        <a>Go to test page</a>
      </Link>
    </Layout>
  )
}

export default Index
