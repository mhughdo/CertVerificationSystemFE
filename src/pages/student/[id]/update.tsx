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
  const { userContract, accountAddress } = state
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()
  const router = useRouter()
  const { query } = router
  const { id } = query
  const [student, setStudent] = useState<Student>()
  const [currentID, setCurrentID] = useState('')

  const [date, setDate] = useState(new Date())

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      setLoading(true)
      const { studentID, name, email, phone, studentClass, major, cpa, qualifiedForGraduation } = formData
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
        title: 'Success',
        description: 'Account was successfully updated!',
        status: 'success',
        duration: 2000,
        position: 'top',
      })
    } catch (error) {
      console.log(error)
      if (error?.code === 4001) return
      toast({
        title: 'Error.',
        description: 'Error occured while updating account!',
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
          setStudent(normaliedStudent)
          setCurrentID(normaliedStudent.id)
        }
      } catch (error) {
        console.log(error)
        toast({
          title: 'Error.',
          description: 'Error occured while fetching student account!',
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

  return (
    <Layout pageTitle='Update student profile'>
      <Container pb='12' px={{ sm: '6', lg: '8' }} color='black' maxW='container.md'>
        <Box mx={{ sm: 'auto' }} mt='8' w={{ sm: 'full' }}>
          <Box bg='white' py='8' px={{ base: '4', md: '10' }} shadow='base' rounded={{ sm: 'lg' }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing='6'>
                <FormControl id='studentID' isRequired>
                  <FormLabel>Student ID</FormLabel>
                  <Input
                    defaultValue={student?.id}
                    id='studentID'
                    name='studentID'
                    {...register('studentID')}
                    type='text'
                    required
                  />
                </FormControl>
                <FormControl id='name' isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input
                    defaultValue={student?.name}
                    id='name'
                    name='name'
                    {...register('name')}
                    type='text'
                    required
                  />
                </FormControl>
                <FormControl id='email' isRequired isInvalid={Boolean(errors?.email?.message)}>
                  <FormLabel>Email</FormLabel>
                  <InputGroup>
                    <Input
                      id='email'
                      name='email'
                      type='email'
                      defaultValue={student?.email}
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
                <Box>
                  <Text mb={4}>Date of birth</Text>
                  <DatePicker
                    onChange={(value) => {
                      return setDate(value)
                    }}
                    value={date}
                  />
                </Box>
                <FormControl id='phone' isRequired isInvalid={Boolean(errors?.phone?.message)}>
                  <FormLabel>Phone Number</FormLabel>
                  <InputGroup>
                    <Input
                      id='phone'
                      name='phone'
                      type='tel'
                      defaultValue={student?.phone}
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
                  <Input
                    defaultValue={student?.class}
                    id='studentClass'
                    name='studentClass'
                    {...register('studentClass')}
                    type='text'
                    required
                  />
                </FormControl>
                <FormControl id='major' isRequired>
                  <FormLabel>Major</FormLabel>
                  <Input
                    defaultValue={student?.major}
                    id='major'
                    name='major'
                    {...register('major')}
                    type='text'
                    required
                  />
                </FormControl>
                <FormControl id='cpa' isRequired>
                  <FormLabel>CPA</FormLabel>
                  <Input defaultValue={student?.cpa} id='cpa' name='cpa' {...register('cpa')} type='text' required />
                </FormControl>
                <FormControl id='qualifiedForGraduation' isRequired>
                  <FormLabel>Qualified For Graduation</FormLabel>
                  <Select
                    placeholder='Select option'
                    defaultValue={`${student?.qualifiedForGraduation}`}
                    {...register('qualifiedForGraduation')}>
                    <option value='true'>True</option>
                    <option value='false'>False</option>
                  </Select>
                </FormControl>

                <Button type='submit' colorScheme='teal' size='lg' fontSize='md' disabled={loading}>
                  Update
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
