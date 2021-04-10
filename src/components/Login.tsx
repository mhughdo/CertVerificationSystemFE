import Particles from 'react-particles-js'
import { Box, Text, Button } from '@chakra-ui/react'
import Image from 'next/image'

import Router from 'next/router'

const Login = () => {
  const handleClick = async () => {
    try {
      const res = await window.ethereum.request({ method: 'eth_requestAccounts' })
      if (res) {
        Router.reload()
      }
    } catch (error) {
      console.log(error)
    }
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
        <Box maxW='400px' bg='white' borderRadius='md' p={4} m='0 auto' mt={8}>
          <Text>Log in using:</Text>
          <Button colorScheme='orange' mt={4} w='100%' onClick={handleClick}>
            <Image src='/metamask-fox.svg' width={16} height={16} />
            <Text ml={4}>Metamask</Text>
          </Button>
        </Box>
      </Box>

      <Box position='absolute'>
        <Particles height='100vh' width='100vw' />
      </Box>
    </Box>
  )
}

export default Login
