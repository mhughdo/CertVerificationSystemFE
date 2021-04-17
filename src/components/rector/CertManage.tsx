import Layout from '@components/Layout'
import { useEffect } from 'react'
import { useAppState } from '@store/appState'
import { useToast } from '@chakra-ui/react'

const CertManage = () => {
  const { state } = useAppState()
  const { web3, certContract, accountAddress } = state
  const toast = useToast()

  useEffect(() => {
    const getCertList = async () => {
      try {
        // console.log(await certContract.methods.getCurrentRector().call({ from: accountAddress }))
        const certList = await certContract.methods.seeAllCerts().call({ from: accountAddress })

        console.log(certList)
      } catch (error) {
        console.log('Error getting account', error)
        toast({
          title: 'Error.',
          description: 'Error occured while fetching certificate list!',
          status: 'error',
          duration: 3000,
          position: 'top',
        })
      }
    }

    getCertList()
  }, [])

  return <Layout>aa</Layout>
}

export default CertManage
