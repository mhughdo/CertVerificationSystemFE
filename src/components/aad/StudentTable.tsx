import { Box, Tag } from '@chakra-ui/react'
import { Student } from '@store/appState'
import { FC } from 'react'
import Link from 'next/link'

const StudentTable: FC<{ studentList: Student[] }> = ({ studentList }) => {
  return (
    <Box>
      <div>
        <div className='max-w-7xl mx-auto'>
          <div className='flex flex-col'>
            <div className='-my-2 overflow-x-auto'>
              <div className='py-2 align-middle inline-block min-w-full'>
                <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
                  <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                      <tr>
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Student ID
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Name
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Class
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Major
                        </th>

                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200' data-todo-x-max='1'>
                      {studentList.length ? (
                        studentList.map((account, index) => {
                          return (
                            <tr key={index}>
                              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600'>
                                <Link href={`/student/${account.id}/view`}>
                                  <a>{account.id}</a>
                                </Link>
                              </td>
                              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{account.name}</td>
                              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{account.class}</td>
                              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{account.major}</td>
                              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                {account.isActive ? (
                                  <Tag colorScheme='green'>Active</Tag>
                                ) : (
                                  <Tag colorScheme='red'>Unactivated</Tag>
                                )}
                              </td>
                            </tr>
                          )
                        })
                      ) : (
                        <tr>
                          <td className='p-4'>No data</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Box>
  )
}

export default StudentTable
