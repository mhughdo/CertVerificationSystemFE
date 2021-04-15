import {
  Button,
  Box,
  useToast,
  Stack,
  FormControl,
  FormErrorMessage,
  Container,
  FormLabel,
  Input,
  InputGroup,
  Select,
} from '@chakra-ui/react'
import Layout from '@components/Layout'
import { useAppState } from '@store/appState'
import Router from 'next/router'
import { useForm, SubmitHandler } from 'react-hook-form'
import axios from 'axios'

type FormData = {
  studentID: string
  name: string
  email: string
  phone: string
  studentClass: string
  major: string
  cpa: string
  qualifiedForGraduation: boolean
}

const NewStudent = () => {
  const toast = useToast()
  const { state } = useAppState()
  const { userContract, accountAddress } = state
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      const { studentID, name, email, phone, studentClass, major, cpa, qualifiedForGraduation } = formData

      await userContract.methods
        .createStudent(studentID, name, email, phone, studentClass, major, cpa, qualifiedForGraduation)
        .send({ from: accountAddress })

      const nonce = await userContract.methods.getStudentNonce(studentID).call({ from: accountAddress })
      console.log(nonce)

      await axios.post('/api/send-email', { to: email, studentID, nonce })

      toast({
        title: 'Success',
        description: 'Account was successfully created!',
        status: 'success',
        duration: 2000,
        position: 'top',
      })
      Router.push('/')
    } catch (error) {
      console.log(error)
      if (error?.code === 4001) return
      toast({
        title: 'Error.',
        description: 'Error occured while creating account!',
        status: 'error',
        duration: 3000,
        position: 'top',
      })
    }
  }

  return (
    <Layout pageTitle='New Academic Affairs Accounts'>
      <Container pb='12' px={{ sm: '6', lg: '8' }} color='black' maxW='container.md'>
        <Box mx={{ sm: 'auto' }} mt='8' w={{ sm: 'full' }}>
          <Box bg='white' py='8' px={{ base: '4', md: '10' }} shadow='base' rounded={{ sm: 'lg' }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing='6'>
                <FormControl id='studentID' isRequired>
                  <FormLabel>Student ID</FormLabel>
                  <Input id='studentID' name='studentID' {...register('studentID')} type='text' required />
                </FormControl>
                <FormControl id='name' isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input id='name' name='name' {...register('name')} type='text' required />
                </FormControl>
                <FormControl id='email' isRequired isInvalid={Boolean(errors?.email?.message)}>
                  <FormLabel>Email</FormLabel>
                  <InputGroup>
                    <Input
                      id='email'
                      name='email'
                      type='email'
                      required
                      {...register('email', {
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Email is not valid',
                        },
                      })}
                    />
                  </InputGroup>
                  <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                </FormControl>
                <FormControl id='phone' isRequired isInvalid={Boolean(errors?.phone?.message)}>
                  <FormLabel>Phone Number</FormLabel>
                  <InputGroup>
                    <Input
                      id='phone'
                      name='phone'
                      type='tel'
                      required
                      {...register('phone', {
                        pattern: {
                          value: /^\d{9,11}$/,
                          message: 'Phone number is invalid!',
                        },
                      })}
                    />
                  </InputGroup>
                  <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
                </FormControl>
                <FormControl id='studentClass' isRequired>
                  <FormLabel>Class</FormLabel>
                  <Input id='studentClass' name='studentClass' {...register('studentClass')} type='text' required />
                </FormControl>
                <FormControl id='major' isRequired>
                  <FormLabel>Major</FormLabel>
                  <Input id='major' name='major' {...register('major')} type='text' required />
                </FormControl>
                <FormControl id='cpa' isRequired>
                  <FormLabel>CPA</FormLabel>
                  <Input id='cpa' name='cpa' {...register('cpa')} type='text' required />
                </FormControl>
                <FormControl id='qualifiedForGraduation' isRequired>
                  <FormLabel>Qualified For Graduation</FormLabel>
                  <Select placeholder='Select option' defaultValue='true' {...register('qualifiedForGraduation')}>
                    <option value='true'>True</option>
                    <option value='false'>False</option>
                  </Select>
                </FormControl>

                <Button type='submit' colorScheme='blue' size='lg' fontSize='md'>
                  Create
                </Button>
              </Stack>
            </form>
          </Box>
        </Box>
      </Container>
    </Layout>
  )
}

export default NewStudent
