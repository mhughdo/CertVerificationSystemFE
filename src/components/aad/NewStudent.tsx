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
  Text,
} from '@chakra-ui/react'
import Layout from '@components/Layout'
import { useAppState } from '@store/appState'
import Router from 'next/router'
import { useForm, SubmitHandler } from 'react-hook-form'
import axios from 'axios'
import { useState } from 'react'
import DatePicker from '@components/DatePicker'
import { formatDate } from '@utils/index'

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
  const [date, setDate] = useState(new Date())
  const toast = useToast()
  const { state } = useAppState()
  const { userContract, accountAddress } = state
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      setLoading(true)
      const { studentID, name, email, phone, studentClass, major, cpa, qualifiedForGraduation } = formData
      const formattedDate = formatDate(date)

      await userContract.methods
        .createStudent(studentID, name, email, formattedDate, phone, studentClass, major, cpa, qualifiedForGraduation)
        .send({ from: accountAddress })

      const nonce = await userContract.methods.getStudentNonce(studentID).call({ from: accountAddress })

      toast({
        title: 'Info',
        description: 'Gửi email kích hoạt tới sinh viên...',
        status: 'info',
        duration: 1500,
        position: 'top',
      })
      await axios.post('/api/send-email', { to: email, studentID, nonce })

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
        description: 'Đã có lỗi xảy ra khi tạo tài khoản!',
        status: 'error',
        duration: 3000,
        position: 'top',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout pageTitle='Tạo tài khoản sinh viên mới'>
      <Container pb='12' px={{ sm: '6', lg: '8' }} color='black' maxW='container.md'>
        <Box mx={{ sm: 'auto' }} mt='8' w={{ sm: 'full' }}>
          <Box bg='white' py='8' px={{ base: '4', md: '10' }} shadow='base' rounded={{ sm: 'lg' }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing='6'>
                <FormControl id='studentID' isRequired>
                  <FormLabel>MSSV</FormLabel>
                  <Input id='studentID' name='studentID' {...register('studentID')} type='text' required />
                </FormControl>
                <FormControl id='name' isRequired>
                  <FormLabel>Tên</FormLabel>
                  <Input id='name' name='name' {...register('name')} type='text' required />
                </FormControl>
                <FormControl id='email' isRequired isInvalid={Boolean(errors?.email?.message)}>
                  <FormLabel>Địa chỉ email</FormLabel>
                  <InputGroup>
                    <Input
                      id='email'
                      name='email'
                      type='email'
                      required
                      {...register('email', {
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Địa chỉ email k hợp lệ',
                        },
                      })}
                    />
                  </InputGroup>
                  <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
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
                <FormControl id='phone' isRequired isInvalid={Boolean(errors?.phone?.message)}>
                  <FormLabel>Số điện thoại</FormLabel>
                  <InputGroup>
                    <Input
                      id='phone'
                      name='phone'
                      type='tel'
                      required
                      {...register('phone', {
                        pattern: {
                          value: /^\d{9,11}$/,
                          message: 'Số điện thoại không hợp lệ!',
                        },
                      })}
                    />
                  </InputGroup>
                  <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
                </FormControl>
                <FormControl id='studentClass' isRequired>
                  <FormLabel>Lớp</FormLabel>
                  <Input id='studentClass' name='studentClass' {...register('studentClass')} type='text' required />
                </FormControl>
                <FormControl id='major' isRequired>
                  <FormLabel>Chuyên ngành</FormLabel>
                  <Input id='major' name='major' {...register('major')} type='text' required />
                </FormControl>
                <FormControl id='cpa' isRequired>
                  <FormLabel>Điểm</FormLabel>
                  <Input id='cpa' name='cpa' {...register('cpa')} type='text' required />
                </FormControl>
                <FormControl id='qualifiedForGraduation' isRequired>
                  <FormLabel>Đủ điều kiện tốt nghiệp</FormLabel>
                  <Select placeholder='Select option' defaultValue='true' {...register('qualifiedForGraduation')}>
                    <option value='true'>Đã đủ</option>
                    <option value='false'>Chưa đủ</option>
                  </Select>
                </FormControl>

                <Button type='submit' colorScheme='teal' size='lg' fontSize='md' disabled={loading}>
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

export default NewStudent
