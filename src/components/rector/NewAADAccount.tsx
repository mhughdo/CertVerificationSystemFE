/* eslint-disable camelcase */
import {
  Button,
  Box,
  useToast,
  Stack,
  FormControl,
  Container,
  FormLabel,
  Input,
  FormErrorMessage,
  InputGroup,
  Text,
} from '@chakra-ui/react'
import Layout from '@components/Layout'
import { useState } from 'react'
import { formatDate } from '@utils/index'
import { useAppState } from '@store/appState'
import DatePicker from '@components/DatePicker'
import Router from 'next/router'
import { useForm, SubmitHandler } from 'react-hook-form'

type FormData = {
  address: string
  name: string
  phone_number: string
}

const NewAADAccount = () => {
  const [date, setDate] = useState(new Date())
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
      const { address } = formData
      const { name } = formData
      const phoneNumber = formData.phone_number
      const formattedDate = formatDate(date)

      await userContract.methods
        .createAADepartmentUser(address, name, formattedDate, phoneNumber)
        .send({ from: accountAddress })
      toast({
        title: 'Success',
        description: 'Tài khoản được tạo thành công!',
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
    <Layout pageTitle='Tạo tài khoản phòng đào tạo mới'>
      <Container pb='12' px={{ sm: '6', lg: '8' }} color='black' maxW='container.md'>
        <Box mx={{ sm: 'auto' }} mt='8' w={{ sm: 'full' }}>
          <Box bg='white' py='8' px={{ base: '4', md: '10' }} shadow='base' rounded={{ sm: 'lg' }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing='6'>
                <FormControl id='address' isRequired>
                  <FormLabel>Địa chỉ ví</FormLabel>
                  <Input
                    placeholder='0xC7d4727a4E5782F41c9de00fE2ff3B12023588B7'
                    id='address'
                    name='address'
                    {...register('address')}
                    type='text'
                    required
                  />
                </FormControl>
                <FormControl id='name' isRequired>
                  <FormLabel>Tên</FormLabel>
                  <Input id='name' name='name' {...register('name')} type='text' required />
                </FormControl>
                <Box>
                  <Text mb={4}>Ngày sinh</Text>
                  <DatePicker
                    onChange={(value) => {
                      return setDate(value)
                    }}
                    value={date}
                  />
                </Box>
                <FormControl id='phone_numner' isRequired isInvalid={Boolean(errors?.phone_number?.message)}>
                  <FormLabel>Số điện thoại</FormLabel>
                  <InputGroup>
                    <Input
                      id='phone_numner'
                      name='phone_numner'
                      type='tel'
                      required
                      {...register('phone_number', {
                        pattern: {
                          value: /^\d{9,11}$/,
                          message: 'Phone number is invalid!',
                        },
                      })}
                    />
                  </InputGroup>
                  <FormErrorMessage>{errors.phone_number?.message}</FormErrorMessage>
                </FormControl>

                <Button type='submit' colorScheme='blue' size='lg' fontSize='md'>
                  Tạo
                </Button>
              </Stack>
            </form>
          </Box>
        </Box>
      </Container>
    </Layout>
  )
}

export default NewAADAccount
