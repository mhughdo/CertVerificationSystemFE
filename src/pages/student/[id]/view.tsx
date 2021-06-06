import { useRouter } from 'next/router'
import Layout from '@components/Layout'
import { useEffect, useState } from 'react'
import { useAppState, Student, Role } from '@store/appState'
import { useToast, Box, SkeletonCircle, SkeletonText, Text } from '@chakra-ui/react'
import { normalizeWeb3Object } from '@utils/index'
import Link from 'next/link'

const ViewStudent = () => {
  const router = useRouter()
  const { query } = router
  const { id } = query
  const toast = useToast()
  const { state } = useAppState()
  const { userContract, accountAddress, user } = state
  const [student, setStudent] = useState<Student>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getStudent = async () => {
      try {
        const student = await userContract.methods.getStudentById(id).call({ from: accountAddress })

        if (student?.id) {
          setStudent(normalizeWeb3Object(student) as Student)
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
      } finally {
        setLoading(false)
      }
    }

    getStudent()
  }, [])

  if (loading) {
    return (
      <Layout>
        <Box padding='6' boxShadow='lg' bg='white'>
          <SkeletonCircle size='10' />
          <SkeletonText mt='4' noOfLines={4} spacing='4' />
        </Box>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className='' style={{}}>
        {!student ? (
          <Text textAlign='center' fontSize='3xl'>
            Student not found!
          </Text>
        ) : (
          <div className='bg-white'>
            <div className='max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
              <div className='max-w-4xl mx-auto'>
                <div className='flex justify-between items-center'>
                  <div>
                    <h3 className='text-lg leading-6 font-medium text-gray-900'>Sinh viên</h3>
                    <p className='mt-1 max-w-2xl text-sm text-gray-500'>Thông tin cá nhân</p>
                  </div>
                  {[String(Role.RECTOR), String(Role.AADEPARTMENT)].includes(user.role) && (
                    <Link href={`/student/${student.id}/update`}>
                      <a className='inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                        <svg
                          className='-ml-1 mr-2 h-5 w-5 text-gray-500'
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 20 20'
                          fill='currentColor'
                          aria-hidden='true'>
                          <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z' />
                        </svg>
                        Cập nhật
                      </a>
                    </Link>
                  )}
                </div>
                <div className='mt-5 border-t border-gray-200'>
                  <dl className='sm:divide-y sm:divide-gray-200'>
                    <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                      <dt className='text-sm font-medium text-gray-500'>MSSV</dt>
                      <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{student.id}</dd>
                    </div>
                    <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                      <dt className='text-sm font-medium text-gray-500'>Tên</dt>
                      <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{student.name}</dd>
                    </div>
                    <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                      <dt className='text-sm font-medium text-gray-500'>Địa chỉ email</dt>
                      <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{student.email}</dd>
                    </div>
                    <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                      <dt className='text-sm font-medium text-gray-500'>Ngày sinh</dt>
                      <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{student.date}</dd>
                    </div>
                    <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                      <dt className='text-sm font-medium text-gray-500'>Số điện thoại</dt>
                      <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{student.phone}</dd>
                    </div>
                    <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                      <dt className='text-sm font-medium text-gray-500'>Lớp</dt>
                      <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{student.class}</dd>
                    </div>
                    <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                      <dt className='text-sm font-medium text-gray-500'>Chuyên ngành</dt>
                      <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{student.major}</dd>
                    </div>
                    <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                      <dt className='text-sm font-medium text-gray-500'>Điểm</dt>
                      <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{student.cpa}</dd>
                    </div>
                    <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                      <dt className='text-sm font-medium text-gray-500'>Đã đủ điều kiện tốt nghiệp</dt>
                      <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                        {`${student.qualifiedForGraduation ? 'Đã đủ' : 'Chưa đủ'}`}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default ViewStudent
