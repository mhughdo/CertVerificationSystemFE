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
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import Layout from '@components/Layout'
import { useAppState, Student } from '@store/appState'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useEffect, useState } from 'react'
import DatePicker from '@components/DatePicker'
import { formatDate, normalizeWeb3Object } from '@utils/index'
import { useRouter } from 'next/router'

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

const StudentProfileUpdateByAAD = () => {
  const toast = useToast()
  const { state } = useAppState()
  const { userContract, accountAddress, certContract } = state
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>()
  const router = useRouter()
  const { query } = router
  const { id } = query
  const [student, setStudent] = useState<Student>()
  const [currentID, setCurrentID] = useState('')

  const [date, setDate] = useState(new Date())
  const [editDisabled, setEditDisabled] = useState(false)

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      setLoading(true)
      const { studentID, name, email, phone, studentClass, major, cpa, qualifiedForGraduation } = formData
      console.log({ studentID, name, email, phone, studentClass, major, cpa, qualifiedForGraduation })
      // return
      const formattedDate = formatDate(date)

      await userContract.methods
        .updateStudentbyAAD(
          currentID,
          studentID,
          name,
          email,
          formattedDate,
          phone,
          studentClass,
          major,
          cpa,
          qualifiedForGraduation
        )
        .send({ from: accountAddress })

      toast({
        title: 'Thành công',
        description: 'Tài khoản được cập nhật thành công!',
        status: 'success',
        duration: 2000,
        position: 'top',
      })
    } catch (error) {
      console.log(error)
      if (error?.code === 4001) return
      toast({
        title: 'Lỗi.',
        description: 'Đã có lỗi khi cập nhật!',
        status: 'error',
        duration: 3000,
        position: 'top',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const getStudent = async () => {
      try {
        const student = await userContract.methods.getStudentById(id).call({ from: accountAddress })

        const normaliedStudent = normalizeWeb3Object(student) as Student
        if (student?.id) {
          const certCount = await certContract.methods.getStudentCertCount(student.id).call({ from: accountAddress })
          if (Number(certCount) > 0) {
            setEditDisabled(true)
          }
          setStudent(normaliedStudent)
          setCurrentID(normaliedStudent.id)
        }
      } catch (error) {
        console.log(error)
        toast({
          title: 'Lỗi.',
          description: 'Đã có lỗi khi lấy thông tin sinh viên!',
          status: 'error',
          duration: 3000,
          position: 'top',
        })
      }
    }

    getStudent()
  }, [])

  useEffect(() => {
    if (student?.date) {
      const dateArr = student?.date
        ?.split('/')
        .reverse()
        .map((item, index) => {
          if (index === 1) {
            return Number(item) - 1
          }

          return Number(item)
        }) as [number, number, number]

      setDate(new Date(...dateArr))
    }
  }, [student])

  useEffect(() => {
    if (student?.id) {
      // setValue([
      //   { studentID: student?.id },
      //   { name: student?.name },
      //   { email: student.email },
      //   { phone: student?.phone },
      //   { studentClass: student?.class },
      //   { major: student?.major },
      //   { cpa: student?.cpa },
      //   { qualifiedForGraduation: `${student?.qualifiedForGraduation}` },
      // ])

      setValue('studentID', student?.id)
      setValue('name', student?.name)
      setValue('email', student?.email)
      setValue('phone', student?.phone)
      setValue('studentClass', student?.class)
      setValue('major', student?.major)
      setValue('cpa', student?.cpa)
      setValue('qualifiedForGraduation', student?.qualifiedForGraduation)
    }
  }, [student])

  return (
    <Layout pageTitle='Cập nhật tài khoản sinh viên'>
      <Container pb='12' px={{ sm: '6', lg: '8' }} color='black' maxW='container.md'>
        <Alert status='warning'>
          <AlertIcon />
          Không thể sửa thông tin sinh viên. Sinh viên này đã được tạo bằng tốt nghiệp!
        </Alert>
        <Box mx={{ sm: 'auto' }} mt='8' w={{ sm: 'full' }}>
          <Box bg='white' py='8' px={{ base: '4', md: '10' }} shadow='base' rounded={{ sm: 'lg' }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing='6'>
                <FormControl id='studentID' isRequired>
                  <FormLabel>MSSV</FormLabel>
                  <Input
                    disabled={editDisabled}
                    defaultValue={student?.id}
                    id='studentID'
                    name='studentID'
                    {...register('studentID')}
                    type='text'
                    required
                  />
                </FormControl>
                <FormControl id='name' isRequired>
                  <FormLabel>Tên</FormLabel>
                  <Input
                    disabled={editDisabled}
                    defaultValue={student?.name}
                    id='name'
                    name='name'
                    {...register('name')}
                    type='text'
                    required
                  />
                </FormControl>
                <FormControl id='email' isRequired isInvalid={Boolean(errors?.email?.message)}>
                  <FormLabel>Địa chỉ email</FormLabel>
                  <InputGroup>
                    <Input
                      disabled={editDisabled}
                      id='email'
                      name='email'
                      type='email'
                      defaultValue={student?.email}
                      required
                      {...register('email', {
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Địa chỉ email không hợp lệ',
                        },
                      })}
                    />
                  </InputGroup>
                  <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                </FormControl>
                <Box>
                  <Text mb={4}>Ngày sinh</Text>
                  <DatePicker
                    disabled={editDisabled}
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
                      disabled={editDisabled}
                      id='phone'
                      name='phone'
                      type='tel'
                      defaultValue={student?.phone}
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
                  <Input
                    disabled={editDisabled}
                    defaultValue={student?.class}
                    id='studentClass'
                    name='studentClass'
                    {...register('studentClass')}
                    type='text'
                    required
                  />
                </FormControl>
                <FormControl id='major' isRequired>
                  <FormLabel>Chuyên ngành</FormLabel>
                  <Input
                    disabled={editDisabled}
                    defaultValue={student?.major}
                    id='major'
                    name='major'
                    {...register('major')}
                    type='text'
                    required
                  />
                </FormControl>
                <FormControl id='cpa' isRequired>
                  <FormLabel>Điểm</FormLabel>
                  <Input
                    disabled={editDisabled}
                    defaultValue={student?.cpa}
                    id='cpa'
                    name='cpa'
                    {...register('cpa')}
                    type='text'
                    required
                  />
                </FormControl>
                <FormControl id='qualifiedForGraduation' isRequired>
                  <FormLabel>Đủ điều kiện tốt nghiệp</FormLabel>
                  <Select
                    disabled={editDisabled}
                    placeholder='Select option'
                    defaultValue={`${student?.qualifiedForGraduation}`}
                    {...register('qualifiedForGraduation')}>
                    <option value='true'>Đã đủ</option>
                    <option value='false'>Chưa đủ</option>
                  </Select>
                </FormControl>

                <Button type='submit' colorScheme='teal' size='lg' fontSize='md' disabled={loading || editDisabled}>
                  Cập nhật
                </Button>
              </Stack>
            </form>
          </Box>
        </Box>
      </Container>
    </Layout>
  )
}

export default StudentProfileUpdateByAAD
