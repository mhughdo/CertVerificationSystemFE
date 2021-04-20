import { Box, Text, Container } from '@chakra-ui/react'
import Image from 'next/image'
import RegisterForm from '@components/company-register-form/Index'

const register = () => {
  return (
    <Box minW='100vw' minH='100vh' d='flex' justifyContent='center' bg='#0e1e25'>
      <Box mt={16}>
        <Box textAlign='center'>
          <Image src='/logo.png' width={50} height={60} />
          <Text color='white' fontSize='3xl'>
            Welcome to UET Certificate Verification System
          </Text>
        </Box>
        <Container
          color='white'
          d='flex'
          bg='white'
          m='0 auto'
          borderRadius='md'
          p={4}
          mt={8}
          maxW='container.xl'
          w='container.xl'
          boxShadow="'0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',">
          <Box>
            <Image src='/blockchain.png' width='550px' height='550px' />
          </Box>

          <Box width='70%'>
            <RegisterForm />
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default register
