import { useRouter } from 'next/router'
import Layout from '@components/Layout'
import { useEffect, useState } from 'react'
import { useAppState, Student } from '@store/appState'
import { useToast, Box, SkeletonCircle, SkeletonText, Text } from '@chakra-ui/react'
import { normalizeWeb3Object } from '@utils/index'

const ViewStudent = () => {
  const router = useRouter()
  const { query } = router
  const { id } = query
  const toast = useToast()
  const { state } = useAppState()
  const { userContract, accountAddress } = state
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
                <div>
                  <div>
                    <h3 className='text-lg leading-6 font-medium text-gray-900'>Student Information</h3>
                    <p className='mt-1 max-w-2xl text-sm text-gray-500'>Personal details</p>
                  </div>
                  <div className='mt-5 border-t border-gray-200'>
                    <dl className='sm:divide-y sm:divide-gray-200'>
                      <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                        <dt className='text-sm font-medium text-gray-500'>Student ID</dt>
                        <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{student.id}</dd>
                      </div>
                      <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                        <dt className='text-sm font-medium text-gray-500'>Name</dt>
                        <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{student.name}</dd>
                      </div>
                      <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                        <dt className='text-sm font-medium text-gray-500'>Email address</dt>
                        <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{student.email}</dd>
                      </div>
                      <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                        <dt className='text-sm font-medium text-gray-500'>Date of birth</dt>
                        <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{student.date}</dd>
                      </div>
                      <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                        <dt className='text-sm font-medium text-gray-500'>Phone</dt>
                        <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{student.phone}</dd>
                      </div>
                      <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                        <dt className='text-sm font-medium text-gray-500'>Class</dt>
                        <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{student.class}</dd>
                      </div>
                      <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                        <dt className='text-sm font-medium text-gray-500'>Major</dt>
                        <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{student.major}</dd>
                      </div>
                      <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                        <dt className='text-sm font-medium text-gray-500'>CPA</dt>
                        <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{student.cpa}</dd>
                      </div>
                      <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                        <dt className='text-sm font-medium text-gray-500'>Qualified For Graduation</dt>
                        <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                          {`${student.qualifiedForGraduation}`}
                        </dd>
                      </div>
                    </dl>
                  </div>
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
