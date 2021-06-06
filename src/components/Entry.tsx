import { useState } from 'react'
import Particles from 'react-particles-js'
import { Box, Text, Button, Alert, AlertIcon, AlertDescription } from '@chakra-ui/react'
import Image from 'next/image'
import MotionBox from '@components/MotionBox'
import { AnimatePresence } from 'framer-motion'
import { useAppState, User, Role, Rector } from '@store/appState'

import Router from 'next/router'

const Entry = ({ err }: { err: string }) => {
  const { state } = useAppState()
  const { user, accountAddress } = state
  console.log('Entry', user)
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
    <Box minW='100vw' minH='100vh' d='flex' justifyContent='center' bg='gray.300'>
      <Box mt={16} zIndex={9999}>
        <Box textAlign='center'>
          <Image src='/logo.png' width={50} height={60} />
          <Text color='black' fontSize='3xl'>
            Chào mừng tới Hệ thống quản lý bằng tốt nghiệp
          </Text>
        </Box>
        <Box maxW='400px' bg='white' borderRadius='md' p={4} m='0 auto' mt={8}>
          {user && user?.role === Role.RECTOR && (user as Rector)?.isActive === false ? (
            <Alert status='error' fontSize='sm' mb={2}>
              <AlertIcon />
              <AlertDescription>{err}</AlertDescription>
            </Alert>
          ) : (
            <>
              <AnimatePresence>
                {(!isAccountConnected || (err && !user)) && (
                  <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {err && (
                      <Alert status='error' fontSize='sm' mb={2}>
                        <AlertIcon />
                        <AlertDescription>{err}</AlertDescription>
                      </Alert>
                    )}

                    <Text>Đăng nhập bằng:</Text>
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
                      <AlertDescription>Không có tài khoản nào được liên kết với địa chỉ này</AlertDescription>
                    </Alert>
                    <Text>Bạn là công ty?</Text>
                    <Button
                      colorScheme='teal'
                      size='md'
                      w='100%'
                      mt={4}
                      onClick={() => {
                        return Router.push('/register')
                      }}>
                      Tạo tài khoản
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
            </>
          )}
        </Box>
      </Box>

      <Box position='absolute'>
        <Particles height='100vh' width='100vw' />
      </Box>
    </Box>
  )
}

export default Entry
