import { useAppState } from '@store/appState'
import { Alert, AlertIcon, AlertTitle, AlertDescription, Box, Text, Stack, Skeleton } from '@chakra-ui/react'
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

          setTimeout(() => {
            window.location.href = '/'
          }, 500)
        }
      } catch (error) {
        console.log(error)
        setHasError(true)
        if (error?.code === 4001) return
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
              Chào mừng tới Hệ thống quản lý bằng tốt nghiệp
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
            Chào mừng tới Hệ thống quản lý bằng tốt nghiệp
          </Text>
        </Box>
        <Box maxW='container.xl' bg='white' borderRadius='md' p={4} m='0 auto' mt={8}>
          {user && (
            <Alert status='error'>
              <AlertIcon />
              <AlertTitle mr={2}>Không thể kích hoạt được tài khoản!</AlertTitle>
              <AlertDescription>Đã có một tài khoản được liên kết với địa chỉ ví này.</AlertDescription>
            </Alert>
          )}

          {!user && (!studentID || !nonce) && (
            <Alert status='error'>
              <AlertIcon />
              <AlertTitle mr={2}>Lỗi!</AlertTitle>
              <AlertDescription>Query params are invalid or missing.</AlertDescription>
            </Alert>
          )}

          {!user && studentID && nonce && !hasError && (
            <>
              <Alert status='success'>
                <AlertIcon />
                Tài khoản được kích hoạt thành công!
              </Alert>
            </>
          )}

          {!user && studentID && nonce && hasError && (
            <Alert status='error'>
              <AlertIcon />
              <AlertTitle mr={2}>Kích hoạt tài khoản thất bại!</AlertTitle>
              <AlertDescription>Đã có lỗi khi kích hoạt tài khoản của bạn, vui lòng thử lại.</AlertDescription>
            </Alert>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default ActivateStudent
