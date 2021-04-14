import { useState } from 'react'
import Particles from 'react-particles-js'
import { Box, Text, Button, Alert, AlertIcon, AlertDescription } from '@chakra-ui/react'
import Image from 'next/image'
import MotionBox from '@components/MotionBox'
import { AnimatePresence } from 'framer-motion'
import { useAppState, User } from '@store/appState'

import Router from 'next/router'

const Entry = ({ err }: { err: string }) => {
  const { state } = useAppState()
  const { user, accountAddress } = state
  const [isAccountConnected, setIsAccountConnected] = useState(!!accountAddress)

  const handleClick = async () => {
    try {
      const res = await window.ethereum.request({ method: 'eth_requestAccounts' })

      if (res) {
        if (user) {
          Router.reload()
        } else {
          setIsAccountConnected(true)
        }
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
          <AnimatePresence>
            {(!isAccountConnected || (err && !user)) && (
              <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {err && (
                  <Alert status='error' fontSize='sm' mb={2}>
                    <AlertIcon />
                    <AlertDescription>{err}</AlertDescription>
                  </Alert>
                )}

                <Text>Log in using:</Text>
                <Button colorScheme='orange' mt={4} w='100%' onClick={handleClick} disabled={!!err}>
                  <Image src='/metamask-fox.png' width={16} height={16} />
                  <Text ml={4}>Metamask</Text>
                </Button>
              </MotionBox>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isAccountConnected && !user && !err && (
              <MotionBox initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ opacity: 0 }}>
                <Alert status='error' fontSize='sm' mb={2}>
                  <AlertIcon />
                  <AlertDescription>There's no account associated with this address</AlertDescription>
                </Alert>
                <Text>Are you a company?</Text>
                <Button colorScheme='teal' size='md' w='100%' mt={4} onClick={() => Router.push('/register')}>
                  Sign up
                </Button>
              </MotionBox>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isAccountConnected && err && (user as User & { isActive: boolean })?.isActive === false && (
              <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Alert status='error' fontSize='sm' mb={2}>
                  <AlertIcon />
                  <AlertDescription>{err}</AlertDescription>
                </Alert>
              </MotionBox>
            )}
          </AnimatePresence>
        </Box>
      </Box>

      <Box position='absolute'>
        <Particles height='100vh' width='100vw' />
      </Box>
    </Box>
  )
}

export default Entry
