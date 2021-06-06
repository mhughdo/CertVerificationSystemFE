/* eslint-disable react/no-children-prop */
/* eslint-disable react/destructuring-assignment */
import { useAppState, Student, Rector, Company, AADUser, Role } from '@store/appState'
import CompanyProfile from '@components/CompanyProfile'
import Link from 'next/link'
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
        Cập nhật
      </a>
    </Link>
  )
}
const StudentProfile = ({ student }: { student: Student }) => {
  const { id, name, email, date, phone, major, cpa, qualifiedForGraduation } = student

  const studentClass = student.class

  return (
    <Layout>
      <div className='bg-white'>
        <div className='max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
          <div className='max-w-4xl mx-auto'>
            <div>
              <div className='flex justify-between items-center'>
                <div>
                  <h3 className='text-lg leading-6 font-medium text-gray-900'>Sinh viên</h3>
                  <p className='mt-1 max-w-2xl text-sm text-gray-500'>Thông tin cá nhân</p>
                </div>
                <UpdateLink />
              </div>
              <div className='mt-5 border-t border-gray-200'>
                <dl className='sm:divide-y sm:divide-gray-200'>
                  <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                    <dt className='text-sm font-medium text-gray-500'>MSSV</dt>
                    <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{id}</dd>
                  </div>
                  <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                    <dt className='text-sm font-medium text-gray-500'>Tên</dt>
                    <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{name}</dd>
                  </div>
                  <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                    <dt className='text-sm font-medium text-gray-500'>Địa chỉ email</dt>
                    <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{email}</dd>
                  </div>
                  <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                    <dt className='text-sm font-medium text-gray-500'>Ngày sinh</dt>
                    <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{date}</dd>
                  </div>
                  <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                    <dt className='text-sm font-medium text-gray-500'>Số điện thoại</dt>
                    <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{phone}</dd>
                  </div>
                  <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                    <dt className='text-sm font-medium text-gray-500'>Lớp</dt>
                    <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{studentClass}</dd>
                  </div>
                  <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                    <dt className='text-sm font-medium text-gray-500'>Chuyên ngành</dt>
                    <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{major}</dd>
                  </div>
                  <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                    <dt className='text-sm font-medium text-gray-500'>Điểm</dt>
                    <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{cpa}</dd>
                  </div>
                  <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                    <dt className='text-sm font-medium text-gray-500'>Đủ điều kiện tốt nghiệp</dt>
                    <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{`${
                      qualifiedForGraduation ? 'Đã đủ' : 'Chưa đủ'
                    }`}</dd>
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

const RectorProfile = ({ rector }: { rector: Rector }) => {
  const { name, date, phone, term } = rector

  return (
    <Layout>
      <div className='bg-white'>
        <div className='max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
          <div className='max-w-4xl mx-auto'>
            <div>
              <div className='flex justify-between items-center'>
                <div>
                  <h3 className='text-lg leading-6 font-medium text-gray-900'>Hiệu trưởng</h3>
                  <p className='mt-1 max-w-2xl text-sm text-gray-500'>Thông tin cá nhân</p>
                </div>
                <UpdateLink />
              </div>
              <div className='mt-5 border-t border-gray-200'>
                <dl className='sm:divide-y sm:divide-gray-200'>
                  <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                    <dt className='text-sm font-medium text-gray-500'>Tên</dt>
                    <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{name}</dd>
                  </div>
                  <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                    <dt className='text-sm font-medium text-gray-500'>Ngày sinh</dt>
                    <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{date}</dd>
                  </div>
                  <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                    <dt className='text-sm font-medium text-gray-500'>Số điện thoại</dt>
                    <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{phone}</dd>
                  </div>
                  <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                    <dt className='text-sm font-medium text-gray-500'>Nhiệm kỳ</dt>
                    <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{term}</dd>
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

const AADUserProfile = ({ account }: { account: AADUser }) => {
  const { name, date, phone } = account

  return (
    <Layout>
      <div className='bg-white'>
        <div className='max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8'>
          <div className='max-w-4xl mx-auto'>
            <div>
              <div className='flex justify-between items-center'>
                <div>
                  <h3 className='text-lg leading-6 font-medium text-gray-900'>Phòng đào tạo</h3>
                  <p className='mt-1 max-w-2xl text-sm text-gray-500'>Thông tin cá nhân</p>
                </div>
                <UpdateLink />
              </div>
              <div className='mt-5 border-t border-gray-200'>
                <dl className='sm:divide-y sm:divide-gray-200'>
                  <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                    <dt className='text-sm font-medium text-gray-500'>Tên</dt>
                    <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{name}</dd>
                  </div>
                  <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                    <dt className='text-sm font-medium text-gray-500'>Ngày sinh</dt>
                    <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{date}</dd>
                  </div>
                  <div className='py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4'>
                    <dt className='text-sm font-medium text-gray-500'>Số điện thoại</dt>
                    <dd className='mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2'>{phone}</dd>
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
