/* eslint-disable react/destructuring-assignment */
import { useAppState, Student, Rector, Company, AADUser, Role } from '@store/appState'

const StudentProfile = ({ student }: { student: Student }) => {
  const { id, name, email, date, phone, major, cpa, qualifiedForGraduation } = student

  const studentClass = student.class

  return (
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
                  <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{id}</dd>
                </div>
                <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                  <dt className='text-sm font-medium text-gray-500'>Name</dt>
                  <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{name}</dd>
                </div>
                <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                  <dt className='text-sm font-medium text-gray-500'>Email address</dt>
                  <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{email}</dd>
                </div>
                <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                  <dt className='text-sm font-medium text-gray-500'>Date of birth</dt>
                  <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{date}</dd>
                </div>
                <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                  <dt className='text-sm font-medium text-gray-500'>Phone</dt>
                  <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{phone}</dd>
                </div>
                <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                  <dt className='text-sm font-medium text-gray-500'>Class</dt>
                  <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{studentClass}</dd>
                </div>
                <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                  <dt className='text-sm font-medium text-gray-500'>Major</dt>
                  <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{major}</dd>
                </div>
                <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                  <dt className='text-sm font-medium text-gray-500'>CPA</dt>
                  <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{cpa}</dd>
                </div>
                <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                  <dt className='text-sm font-medium text-gray-500'>Qualified For Graduation</dt>
                  <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{`${qualifiedForGraduation}`}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const RectorProfile = ({ rector }: { rector: Rector }) => {
  const { name, date, phone, term } = rector

  return (
    <div className='bg-white'>
      <div className='max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-4xl mx-auto'>
          <div>
            <div>
              <h3 className='text-lg leading-6 font-medium text-gray-900'>Rector Information</h3>
              <p className='mt-1 max-w-2xl text-sm text-gray-500'>Personal details</p>
            </div>
            <div className='mt-5 border-t border-gray-200'>
              <dl className='sm:divide-y sm:divide-gray-200'>
                <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                  <dt className='text-sm font-medium text-gray-500'>Name</dt>
                  <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{name}</dd>
                </div>
                <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                  <dt className='text-sm font-medium text-gray-500'>Date of birth</dt>
                  <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{date}</dd>
                </div>
                <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                  <dt className='text-sm font-medium text-gray-500'>Phone</dt>
                  <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{phone}</dd>
                </div>
                <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                  <dt className='text-sm font-medium text-gray-500'>term</dt>
                  <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{term}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const CompanyProfile = ({ company }: { company: Company }) => {
  const { name, description, jobInfo } = company

  return (
    <div className='bg-white'>
      <div className='max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-4xl mx-auto'>
          <div>
            <div>
              <h3 className='text-lg leading-6 font-medium text-gray-900'>Company Information</h3>
              <p className='mt-1 max-w-2xl text-sm text-gray-500'>Personal details</p>
            </div>
            <div className='mt-5 border-t border-gray-200'>
              <dl className='sm:divide-y sm:divide-gray-200'>
                <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                  <dt className='text-sm font-medium text-gray-500'>Name</dt>
                  <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{name}</dd>
                </div>
                <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                  <dt className='text-sm font-medium text-gray-500'>Description</dt>
                  <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{description}</dd>
                </div>
                <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                  <dt className='text-sm font-medium text-gray-500'>Job description</dt>
                  <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{jobInfo}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const AADUserProfile = ({ account }: { account: AADUser }) => {
  const { name, date, phone } = account

  return (
    <div className='bg-white'>
      <div className='max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-4xl mx-auto'>
          <div>
            <div>
              <h3 className='text-lg leading-6 font-medium text-gray-900'>
                Office of Academic Department User Information
              </h3>
              <p className='mt-1 max-w-2xl text-sm text-gray-500'>Personal details</p>
            </div>
            <div className='mt-5 border-t border-gray-200'>
              <dl className='sm:divide-y sm:divide-gray-200'>
                <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                  <dt className='text-sm font-medium text-gray-500'>Name</dt>
                  <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{name}</dd>
                </div>
                <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                  <dt className='text-sm font-medium text-gray-500'>Date of birth</dt>
                  <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{date}</dd>
                </div>
                <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                  <dt className='text-sm font-medium text-gray-500'>Phone</dt>
                  <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{phone}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const Profile = () => {
  const { state } = useAppState()
  const { user } = state

  const roleToComp = {
    [Role.RECTOR]: <RectorProfile rector={user as Rector} />,
    [Role.AADEPARTMENT]: <AADUserProfile account={user as AADUser} />,
    [Role.STUDENT]: <StudentProfile student={user as Student} />,
    [Role.COMPANY]: <CompanyProfile company={user as Company} />,
  }

  return <div>{roleToComp[user.role] || null}</div>
}

export default Profile
