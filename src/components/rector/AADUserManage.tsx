import { useEffect, useState } from 'react'
import { useAppState, AADUser } from '@store/appState'
import { Button, Box, Text, useToast } from '@chakra-ui/react'
import AADUserTable from '@components/rector/AADUserTable'
import { normalizeWeb3Object } from '@utils/index'
import Router from 'next/router'

const AADUserManage = () => {
  const { state } = useAppState()
  const { userContract, accountAddress } = state
  const [AADAccountList, setAADAccountList] = useState<AADUser[]>([])
  const toast = useToast()

  useEffect(() => {
    const getAADAccountList = async () => {
      try {
        // const batch = new web3.BatchRequest()
        // batch.add(
        //   userContract.methods
        //     .createAADepartmentUser('0x93FFC26d553DC09DEE61748f4073bfDf86e47Aa8', 'Hai', '1/1/2000', '0123456789')
        //     .send.request({ from: accountAddress }, (args) => console.log(args))
        // )
        // batch.add(
        //   userContract.methods
        //     .createAADepartmentUser('0x328FEbd3855dB4c9a0ff83bF1999997421a940F4', 'Hai 2', '1/1/2000', '0123456789')
        //     .send.request({ from: accountAddress }, (args) => console.log(args))
        // )
        // batch.execute()

        const accountList = (await userContract.methods.getAllAADepartmentUsers().call({ from: accountAddress })) || []
        const normalizedAccountList = accountList.map(normalizeWeb3Object)
        setAADAccountList(normalizedAccountList)
      } catch (error) {
        console.log('Error getting account', error)
        toast({
          title: 'Error.',
          description: 'Error occured while fetching Academic Affairs Accounts!',
          status: 'error',
          duration: 3000,
          position: 'top',
        })
      }
    }

    getAADAccountList()
  }, [])
  return (
    <Box px={4}>
      <Text mb={4} fontSize='2xl' fontWeight='bold'>
        Danh sách tài khoản
      </Text>

      <Box d='flex' justifyContent='flex-end' mb={8}>
        <Button
          colorScheme='teal'
          size='md'
          onClick={() => {
            return Router.push('/aadaccount/new')
          }}>
          Tạo tài khoản mới
        </Button>
      </Box>

      <AADUserTable setAADAccountList={setAADAccountList} AADAccountList={AADAccountList} />
    </Box>
  )
}

export default AADUserManage
