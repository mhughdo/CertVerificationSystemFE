import { useAppState, Company, Role } from '@store/appState'
import Link from 'next/link'
import MarkdownEditor from '@components/MarkdownEditor'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useToast } from '@chakra-ui/react'
import { normalizeWeb3Object } from '@utils/index'
import ContentLoadingSkeleton from '@components/ContentLoadingSkeleton'
import Layout from '@components/Layout'

const UpdateLink = () => {
  return (
    <Link href='/profile/update'>
      <a className='inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
        <svg
          className='-ml-1 mr-2 h-5 w-5 text-gray-500'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 20 20'
          fill='currentColor'
          aria-hidden='true'>
          <path d='M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z' />
        </svg>
        Update
      </a>
    </Link>
  )
}

const CompanyProfile = ({ company }: { company?: Company }) => {
  const [companyDetails, setCompanyDetails] = useState(company)

  const { state } = useAppState()
  const { user, userContract, accountAddress } = state
  const router = useRouter()
  const { query } = router
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const { id } = query

  useEffect(() => {
    const getCompany = async () => {
      if (company) return
      setLoading(true)
      try {
        const company = await userContract.methods.getCompanybyId(id).call({ from: accountAddress })

        if (company?.name) {
          setCompanyDetails(normalizeWeb3Object(company) as Company)
        }
      } catch (error) {
        console.log(error)
        toast({
          title: 'Error.',
          description: 'Error occured while fetching company account!',
          status: 'error',
          duration: 3000,
          position: 'top',
        })
      } finally {
        setLoading(false)
      }
    }

    getCompany()
  }, [])

  if (loading) {
    return <ContentLoadingSkeleton />
  }

  return (
    <Layout>
      <div className='bg-white'>
        <div className='max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
          <div className='max-w-4xl mx-auto'>
            <div>
              <div className='flex justify-between items-center'>
                <div>
                  <h3 className='text-lg leading-6 font-medium text-gray-900'>Company Information</h3>
                  <p className='mt-1 max-w-2xl text-sm text-gray-500'>Personal details</p>
                </div>
                {user.role === Role.COMPANY && companyDetails?.name === user?.name && <UpdateLink />}
              </div>
              <div className='mt-5 border-t border-gray-200'>
                <dl className='sm:divide-y sm:divide-gray-200'>
                  <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                    <dt className='text-sm font-medium text-gray-500'>Name</dt>
                    <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{companyDetails?.name}</dd>
                  </div>
                  <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                    <dt className='text-sm font-medium text-gray-500'>Description</dt>
                    <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                      <MarkdownEditor initValue={companyDetails?.description} readOnly />
                    </dd>
                  </div>
                  <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                    <dt className='text-sm font-medium text-gray-500'>Job description</dt>
                    <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>
                      <MarkdownEditor initValue={companyDetails?.jobInfo} readOnly />
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default CompanyProfile
