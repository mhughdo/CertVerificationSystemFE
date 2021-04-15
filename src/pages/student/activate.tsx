import { useAppState } from '@store/appState'
import { Alert, AlertIcon, AlertTitle, AlertDescription, Box, Text, Stack, Skeleton, Button } from '@chakra-ui/react'
import Image from 'next/image'
import Router from 'next/router'
import { useEffect, useState } from 'react'

const ActivateStudent = () => {
  const { state } = useAppState()
  const { query } = Router
  const { studentID, nonce } = query
  const { user, userContract, accountAddress } = state
  const [hasError, setHasError] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const activateAccount = async () => {
      try {
        if (!user && studentID && nonce) {
          await userContract.methods.activeStudent(studentID, nonce).send({ from: accountAddress })
        }
      } catch (error) {
        console.log(error)
        if (error?.code === 4001) return
        setHasError(true)
      } finally {
        setLoading(false)
      }
    }

    activateAccount()
  }, [])

  if (loading) {
    return (
      <Box minW='100vw' minH='100vh' d='flex' justifyContent='center' bg='#0e1e25'>
        <Box mt={16} zIndex={9999}>
          <Box textAlign='center'>
            <Image src='/logo.png' width={50} height={60} />
            <Text color='white' fontSize='3xl'>
              Welcome to UET Certificate Verification System
            </Text>
          </Box>
          <Box maxW='container.xl' bg='white' borderRadius='md' p={4} m='0 auto' mt={8}>
            <Stack>
              <Skeleton height='20px' />
              <Skeleton height='20px' />
              <Skeleton height='20px' />
            </Stack>
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <Box minW='100vw' minH='100vh' d='flex' justifyContent='center' bg='#0e1e25'>
      <Box mt={16} zIndex={9999}>
        <Box textAlign='center'>
          <Image src='/logo.png' width={50} height={60} />
          <Text color='white' fontSize='3xl'>
            Welcome to UET Certificate Verification System
          </Text>
        </Box>
        <Box maxW='container.xl' bg='white' borderRadius='md' p={4} m='0 auto' mt={8}>
          {user && (
            <Alert status='error'>
              <AlertIcon />
              <AlertTitle mr={2}>Cannot activate account!</AlertTitle>
              <AlertDescription>There's already an account associated with this address.</AlertDescription>
            </Alert>
          )}

          {!user && (!studentID || !nonce) && (
            <Alert status='error'>
              <AlertIcon />
              <AlertTitle mr={2}>Invalid params!</AlertTitle>
              <AlertDescription>Query params are invalid or missing.</AlertDescription>
            </Alert>
          )}

          {!user && studentID && nonce && !hasError && (
            <>
              <Alert status='success'>
                <AlertIcon />
                Account was activated successfully!
              </Alert>
              <Box d='flex' justifyContent='center' mt={4}>
                <Button
                  colorScheme='teal'
                  size='md'
                  onClick={() => {
                    window.location.href = '/'
                  }}>
                  Go to home page
                </Button>
              </Box>
            </>
          )}

          {!user && studentID && nonce && hasError && (
            <Alert status='error'>
              <AlertIcon />
              <AlertTitle mr={2}>Activation failed!</AlertTitle>
              <AlertDescription>Error occured while activating your account, please try again.</AlertDescription>
            </Alert>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default ActivateStudent
