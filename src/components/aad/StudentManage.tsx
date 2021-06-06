/* eslint-disable @typescript-eslint/no-unsafe-return */
import { useRef, useEffect, useState } from 'react'
import { useAppState, Student } from '@store/appState'
import { Button, Box, Text, useToast } from '@chakra-ui/react'
import { normalizeWeb3Object } from '@utils/index'
import Router from 'next/router'
import StudentTable from '@components/aad/StudentTable'
import { CSVReader } from 'react-papaparse'
import axios from 'axios'

const StudentManage = () => {
  const { state } = useAppState()
  const { userContract, accountAddress } = state
  const [studentList, setStudentList] = useState<Student[]>([])
  const toast = useToast()
  const buttonRef = useRef(null)
  const [isImportingStudent, setIsImportingStudent] = useState(false)
  const fields = ['id', 'name', 'email', 'date', 'phone', 'class', 'major', 'cpa', 'qualifiedForGraduation']

  useEffect(() => {
    const getStudentList = async () => {
      try {
        // const batch = new web3.BatchRequest()
        // batch.add(
        //   userContract.methods
        //     .createStudent('17020783', 'Hung', 'mhughdo@gmail.com', '0962605699', 'K62J', 'CNTT', '3.2', true)
        //     .send.request({ from: accountAddress }, (args) => console.log(args))
        // )
        // batch.add(
        //   userContract.methods
        //     .createStudent('17020781', 'Hai', 'hai@gmail.com', '0123456789', 'K62J', 'CNTT', '3.2', true)
        //     .send.request({ from: accountAddress }, (args) => console.log(args))
        // )
        // batch.execute()

        const studentList = (await userContract.methods.getAllStudent().call({ from: accountAddress })) || []
        const normalizedAccountList = studentList.slice(1, studentList.length).map(normalizeWeb3Object)
        setStudentList(normalizedAccountList)
      } catch (error) {
        console.log('Error getting account', error)
        toast({
          title: 'Error.',
          description: 'Error occured while fetching Student Accounts!',
          status: 'error',
          duration: 3000,
          position: 'top',
        })
      }
    }
    getStudentList()
  }, [])

  const handleOnError = (err, file, inputElem, reason) => {
    console.log(err)
    toast({
      title: 'Error.',
      description: 'Có lỗi xảy ra khi nhập danh sách!',
      status: 'error',
      duration: 3000,
      position: 'top',
    })
  }

  const validateField = (student: string[]) => {
    if (student?.length !== 9) {
      toast({
        title: 'Error.',
        description: `Có trường bắt buộc bị thiếu, các trường bắt buộc: ${fields.join('')}!`,
        status: 'error',
        duration: 3000,
        position: 'top',
      })
      return false
    }

    const newStudent = student.map((s) => {
      return s.trim()
    })
    const emptyField = newStudent?.find((val) => {
      return !val
    })

    if (emptyField) {
      toast({
        title: 'Empty value.',
        description: `Tất cả các trường trong 1 hàng phải được điền!`,
        status: 'error',
        duration: 3000,
        position: 'top',
      })
      return false
    }

    if (newStudent[0]?.length !== 8) {
      toast({
        title: 'Giá trị sai.',
        description: `MSSV không hợp lệ: ${newStudent[0]}}!`,
        status: 'error',
        duration: 3000,
        position: 'top',
      })
      return false
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newStudent[2])) {
      toast({
        title: 'Giá trị sai.',
        description: `Email không hợp lệ: ${newStudent[2]}`,
        status: 'error',
        duration: 3000,
        position: 'top',
      })
      return false
    }

    if (!/^\d{9,11}$/.test(newStudent[4])) {
      toast({
        title: 'Giá trị sai.',
        description: `Số điện thoại khợp lệ: ${newStudent[4]}!`,
        status: 'error',
        duration: 3000,
        position: 'top',
      })
      return false
    }

    if (!/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/.test(newStudent[3])) {
      toast({
        title: 'Giá trị sai.',
        description: `Ngày sinh không hợp lệ: ${newStudent[3]}`,
        status: 'error',
        duration: 3000,
        position: 'top',
      })
      return false
    }

    if (!/\d{1}\.\d{1,2}/.test(newStudent[7])) {
      toast({
        title: 'Giá trị sai.',
        description: `Điểm k hợp lệ: ${newStudent[7]}!`,
        status: 'error',
        duration: 3000,
        position: 'top',
      })
      return false
    }

    return true
  }

  const handleOnFileLoad = async (data) => {
    try {
      setIsImportingStudent(true)
      const students = data.slice(1, data.length - 1).map((d) => {
        return d.data as string[]
      })
      for (const student of students) {
        const isValid = validateField(student)
        if (!isValid) {
          setIsImportingStudent(false)
          return
        }
      }

      const nonExistiedStudents = []

      for (const student of students) {
        const studentID = `${student[0]}`
        const s = await userContract.methods.getStudentById(studentID).call({ from: accountAddress })
        if (!s?.name) {
          nonExistiedStudents.push(
            student?.map((item: string) => {
              return item.trim()
            })
          )
        }
      }

      if (!nonExistiedStudents?.length) {
        toast({
          title: 'Info.',
          description: 'Không có tài khoản mới nào cần được nhập!',
          status: 'info',
          duration: 3000,
          position: 'top',
        })
        return
      }

      await userContract.methods
        .importStudent(
          nonExistiedStudents.map((item) => {
            return [...item, true, 0]
          })
        )
        .send({ from: accountAddress })
      toast({
        title: 'Info',
        description: 'Gửi email kích hoạt cho sinh viên...',
        status: 'info',
        duration: 1500,
        position: 'top',
      })

      const studentObjArr = nonExistiedStudents.map((student) => {
        return fields.reduce((acc, fieldName, index) => {
          return { ...acc, [fieldName]: student[index].trim() }
        }, {}) as Student
      })

      const studentPromises = []
      for (const student of studentObjArr) {
        const studentID = `${student.id}`
        const nonce = await userContract.methods.getStudentNonce(studentID).call({ from: accountAddress })

        if (nonce) {
          studentPromises.push(axios.post('/api/send-email', { to: student.email, studentID: student.id, nonce }))
        }
      }

      await Promise.all(studentPromises)

      setStudentList([...studentList, ...studentObjArr])
      toast({
        title: 'Success.',
        description: 'Nhập danh sách sinh viên thành công!',
        status: 'success',
        duration: 3000,
        position: 'top',
      })
    } catch (error) {
      console.log(error)
      toast({
        title: 'Error.',
        description: 'Đã có lỗi xảy ra khi nhập thông tin sinh viên!',
        status: 'error',
        duration: 3000,
        position: 'top',
      })
    } finally {
      setIsImportingStudent(false)
    }
  }

  const handleOpenDialog = (e) => {
    // Note that the ref is set async, so it might be null at some point
    if (buttonRef.current) {
      buttonRef.current.open(e)
    }
  }

  return (
    <Box>
      <Text mb={4} fontSize='2xl' fontWeight='bold'>
        Danh sách sinh viên
      </Text>

      <Box d='flex' justifyContent='flex-end' mb={8}>
        <CSVReader ref={buttonRef} onFileLoad={handleOnFileLoad} onError={handleOnError} noDrag noClick addRemoveButton>
          {({ file }) => {
            return (
              <aside style={{ marginBottom: '6px' }}>
                <Button mr={4} onClick={handleOpenDialog} disabled={isImportingStudent}>
                  Nhập danh sách sinh viên
                </Button>
              </aside>
            )
          }}
        </CSVReader>
        <Button
          colorScheme='teal'
          size='md'
          onClick={() => {
            return Router.push('/student/new')
          }}>
          Tạo tài khoản mới
        </Button>
      </Box>
      <StudentTable studentList={studentList} />
    </Box>
  )
}

export default StudentManage
