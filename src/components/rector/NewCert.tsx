import Layout from '@components/Layout'
import { Box, Input, Text, Button, useToast } from '@chakra-ui/react'
import { useState } from 'react'
import { useAppState } from '@store/appState'
import Router from 'next/router'

const NewCert = () => {
  const [studentID, setStudentID] = useState('')
  const { state } = useAppState()
  const { accountAddress, userContract } = state
  const [loading, setLoading] = useState(false)
  const toast = useToast()

  const createCert = async () => {
    try {
      if (!studentID) {
        toast({
          title: 'Error.',
          description: 'Please input student ID!',
          status: 'error',
          duration: 3000,
          position: 'top',
        })

        return
      }

      setLoading(true)
      await userContract.methods.createCertificate(studentID).send({ from: accountAddress })

      toast({
        title: 'Success',
        description: 'Certificate was successfully created!',
        status: 'success',
        duration: 2000,
        position: 'top',
      })

      Router.push('/certificate/manage')
    } catch (error) {
      console.log(error)
      toast({
        title: 'Error.',
        description: 'Error while creating certificate!',
        status: 'error',
        duration: 3000,
        position: 'top',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <Box d='flex' justifyContent='center'>
        <Box flex='1 1' bg='white' py='8' px={4} shadow='base' rounded='lg' maxW='40%'>
          <Text mb={4}>Student ID</Text>
          <Input value={studentID} onChange={(e) => setStudentID(e.target.value)} />

          <Button colorScheme='teal' onClick={createCert} w='100%' mt={4} disabled={loading}>
            Create
          </Button>
        </Box>
      </Box>
    </Layout>
  )
}

export default NewCert
