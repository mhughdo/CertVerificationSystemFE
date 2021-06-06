import Layout from '@components/Layout'
import {
  Box,
  Input,
  Text,
  Button,
  useToast,
  FormControl,
  FormErrorMessage,
  Container,
  FormLabel,
  Stack,
  InputGroup,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { useAppState, Student } from '@store/appState'
import Router from 'next/router'
import Select from 'react-select'
import { normalizeWeb3Object } from '@utils/index'

const NewCert = () => {
  const [studentID, setStudentID] = useState('')
  const { state } = useAppState()
  const { accountAddress, certContract, userContract } = state
  const [loading, setLoading] = useState(false)
  const [options, setOptions] = useState<{ label: string; value: string }[]>()
  const [selectLoading, setSelectLoading] = useState(false)
  const [students, setStudents] = useState<Student[]>()
  const [student, setStudent] = useState<Student>()
  const toast = useToast()

  const createCert = async () => {
    try {
      if (!studentID) {
        toast({
          title: 'Error.',
          description: 'Vui lòng chọn 1 sinh viên!',
          status: 'error',
          duration: 3000,
          position: 'top',
        })

        return
      }

      setLoading(true)
      await certContract.methods.createCertificate(studentID).send({ from: accountAddress })

      toast({
        title: 'Thành công',
        description: 'Bằng tốt nghiệp đã được tạo thành công!',
        status: 'success',
        duration: 2000,
        position: 'top',
      })

      Router.push('/certificate/manage')
    } catch (error) {
      console.log(error)
      toast({
        title: 'Lỗi.',
        description: 'Đã có lỗi khi tạo bằng tốt nghiệp!',
        status: 'error',
        duration: 3000,
        position: 'top',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchQualifiedSutdents = async () => {
      try {
        setSelectLoading(true)
        const students = await userContract.methods.getQualifiedStudents().call({ from: accountAddress })

        if (students?.length) {
          const normalizedStudents = students.map(normalizeWeb3Object) as Student[]
          const qualifiedStudents = [] as Student[]

          for (const s of normalizedStudents) {
            const certCount = await certContract.methods.getStudentCertCount(s.id).call({ from: accountAddress })
            if (Number(certCount) === 0) {
              qualifiedStudents.push(s)
            }
          }

          setStudents(qualifiedStudents)
          setOptions(
            qualifiedStudents.map((s) => {
              return { label: `${s.id} - ${s.name}`, value: s.id }
            })
          )
        }
      } catch (error) {
        console.log(error)
        toast({
          title: 'Error.',
          description: 'Đã có lỗi xả ra khi lấy danh sách sinh viên đủ điều kiện tốt nghiệp!',
          status: 'error',
          duration: 2000,
          position: 'top',
        })
      } finally {
        setSelectLoading(false)
      }
    }

    fetchQualifiedSutdents()
  }, [])

  return (
    <Layout>
      <Box d='flex' justifyContent='center'>
        <Box flex='1 1' bg='white' py='8' px={4} shadow='base' rounded='lg' maxW='40%'>
          <Text mb={4}>MSSV</Text>
          <Select
            loading={selectLoading}
            options={options}
            isSearchable
            isClearable
            loadingMessage={() => {
              return 'Fetching qualified students'
            }}
            onChange={(option, action) => {
              if (action.action === 'select-option') {
                setStudent(
                  students.find((s) => {
                    return s.id === option.value
                  })
                )
                setStudentID(option.value)
              }
              if (action.action === 'clear') {
                setStudentID('')
                setStudent(null)
              }
            }}
          />

          {student && (
            <Box mt={8}>
              <form>
                <Stack spacing='6'>
                  <FormControl id='name'>
                    <FormLabel>Tên</FormLabel>
                    <Input id='name' name='name' type='text' isReadOnly value={student.name} />
                  </FormControl>
                  <FormControl id='email'>
                    <FormLabel>Địa chỉ email</FormLabel>
                    <InputGroup>
                      <Input id='email' name='email' type='email' isReadOnly value={student.email} />
                    </InputGroup>
                  </FormControl>
                  <Box>
                    <Text mb={4}>Ngày sinh</Text>
                    <Text>{student.date}</Text>
                  </Box>
                  <FormControl id='phone'>
                    <FormLabel>Số điện thoại</FormLabel>
                    <InputGroup>
                      <Input id='phone' name='phone' type='tel' isReadOnly value={student.phone} />
                    </InputGroup>
                  </FormControl>
                  <FormControl id='studentClass'>
                    <FormLabel>Lớp</FormLabel>
                    <Input id='studentClass' name='studentClass' type='text' isReadOnly value={student.class} />
                  </FormControl>
                  <FormControl id='major'>
                    <FormLabel>Chuyên ngành</FormLabel>
                    <Input id='major' name='major' type='text' isReadOnly value={student.major} />
                  </FormControl>
                  <FormControl id='cpa'>
                    <FormLabel>Điểm</FormLabel>
                    <Input id='cpa' name='cpa' type='text' isReadOnly value={student.cpa} />
                  </FormControl>
                </Stack>
              </form>
            </Box>
          )}

          <Button colorScheme='teal' size='lg' onClick={createCert} w='100%' mt={4} disabled={loading || !studentID}>
            Tạo
          </Button>
        </Box>
      </Box>
    </Layout>
  )
}

export default NewCert
