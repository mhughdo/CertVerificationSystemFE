import { useEffect, useState } from 'react'
import { useAppState, Student } from '@store/appState'
import { Button, Box, Text, useToast } from '@chakra-ui/react'
import { normalizeWeb3Object } from '@utils/index'
import Router from 'next/router'
import StudentTable from '@components/aad/StudentTable'

const StudentManage = () => {
  const { state } = useAppState()
  const { web3, userContract, accountAddress } = state
  const [studentList, setStudentList] = useState<Student[]>([])
  const toast = useToast()

  useEffect(() => {
    const getStudentList = async () => {
      try {
        // const batch = new web3.BatchRequest()
        // batch.add(
        //   userContract.methods
        //     .createStudent('17020783', 'Hung', 'mhughdo@gmail.com', '0962605699', 'K62J', 'CNTT', '3.2', true)
        //     .send.request({ from: accountAddress }, (args) => console.log(args))
        // )
        // batch.add(
        //   userContract.methods
        //     .createStudent('17020781', 'Hai', 'hai@gmail.com', '0123456789', 'K62J', 'CNTT', '3.2', true)
        //     .send.request({ from: accountAddress }, (args) => console.log(args))
        // )
        // batch.execute()

        const studentList = (await userContract.methods.getAllStudent().call({ from: accountAddress })) || []

        const normalizedAccountList = studentList.map(normalizeWeb3Object)
        setStudentList(normalizedAccountList)
      } catch (error) {
        console.log('Error getting account', error)
        toast({
          title: 'Error.',
          description: 'Error occured while fetching Student Accounts!',
          status: 'error',
          duration: 3000,
          position: 'top',
        })
      }
    }
    getStudentList()
  }, [])

  return (
    <Box>
      <Text mb={4} fontSize='2xl' fontWeight='bold'>
        Student Management
      </Text>

      <Box d='flex' justifyContent='flex-end' mb={8}>
        <Button colorScheme='teal' size='md' onClick={() => Router.push('/student/new')}>
          Create new account
        </Button>
      </Box>
      <StudentTable studentList={studentList} />
    </Box>
  )
}

export default StudentManage
