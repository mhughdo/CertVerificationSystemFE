import { Box, Heading, useColorModeValue as mode } from '@chakra-ui/react'
import { RegisterInputGroup } from './RegisterInputGroup'

const RegisterForm = () => (
  <Box pb='12' px={{ sm: '6', lg: '8' }} color='black'>
    <Box maxW={{ sm: 'md' }} mx={{ sm: 'auto' }} w={{ sm: 'full' }}>
      <Heading mt='6' textAlign='center' size='xl' fontWeight='extrabold'>
        Sign up
      </Heading>
    </Box>
    <Box mx={{ sm: 'auto' }} mt='8' w={{ sm: 'full' }}>
      <Box bg={mode('white', 'gray.700')} py='8' px={{ base: '4', md: '10' }} shadow='base' rounded={{ sm: 'lg' }}>
        <RegisterInputGroup />
      </Box>
    </Box>
  </Box>
)

export default RegisterForm
