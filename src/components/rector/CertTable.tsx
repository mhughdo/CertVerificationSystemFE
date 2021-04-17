import {
  Box,
  Tag,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  Button,
  Portal,
  useToast,
  ButtonGroup,
} from '@chakra-ui/react'
import { Certificate, useAppState, Role } from '@store/appState'
import { FC, useState } from 'react'
import Link from 'next/link'
import axios from 'axios'

const CertTable: FC<{
  certList: (Certificate & {
    studentID: string
    studentName: string
    studentClass: string
    studentMajor: string
    studentDOB: string
  })[]
  setCertList: (...args: any[]) => void
}> = ({ certList, setCertList }) => {
  const { state } = useAppState()
  const { user, userContract, accountAddress } = state
  const toast = useToast()
  const [loading, setLoading] = useState(false)

  const signCertificate = (id: number) => async () => {
    try {
      setLoading(true)
      await userContract.methods.signCertificate(id).send({ from: accountAddress })

      await axios.post('/api/generate-cert', {
        major: certList[id].studentMajor,
        grade: certList[id].grade,
        name: certList[id].studentName,
        studentID: certList[id].studentID,
        dob: certList[id].studentDOB,
      })

      const newCertList = [...certList]
      const signedItem = newCertList[id]
      signedItem.signed = true
      newCertList[id] = signedItem

      setCertList(newCertList)
      toast({
        title: 'Success',
        description: 'Cert was successfully signed!',
        status: 'success',
        duration: 2000,
        position: 'top',
      })
    } catch (error) {
      console.log(error)
      if (error?.code === 4001) {
        toast({
          title: 'Info',
          description: 'Canceled certificate creation!',
          status: 'info',
          duration: 2000,
          position: 'top',
        })
        return
      }
      toast({
        title: 'Error.',
        description: 'Error occured while signing certificate!',
        status: 'error',
        duration: 3000,
        position: 'top',
      })
    } finally {
      setLoading(false)
    }
  }

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
                          Grade
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Signed
                        </th>

                        {user.role === Role.RECTOR && (
                          <th scope='col' className='relative px-6 py-3'>
                            <span className='sr-only'>Sign</span>
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200' data-todo-x-max='1'>
                      {certList?.length ? (
                        certList.map((cert, index) => (
                          <tr key={index}>
                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600'>
                              <Link href={`/student/${cert.studentID}/view`}>
                                <a>{cert.studentID}</a>
                              </Link>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{cert.studentName}</td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{cert.studentClass}</td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{cert.studentMajor}</td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{cert.grade}</td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                              {cert.signed ? (
                                <Tag colorScheme='green'>Signed</Tag>
                              ) : (
                                <Tag colorScheme='red'>Not Signed</Tag>
                              )}
                            </td>
                            {user.role === Role.RECTOR && (
                              <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                                <Popover isLazy>
                                  {({ isOpen, onClose }) => (
                                    <>
                                      <PopoverTrigger>
                                        <Button disabled={cert.signed || loading}>
                                          {loading ? 'Signing' : 'Sign'}
                                        </Button>
                                      </PopoverTrigger>
                                      <Portal>
                                        <PopoverContent>
                                          <PopoverArrow />
                                          <PopoverCloseButton />
                                          <PopoverHeader>Confirmation!</PopoverHeader>
                                          <PopoverBody>Are you sure you want to sign this certificate?</PopoverBody>
                                          <PopoverFooter d='flex' justifyContent='flex-end'>
                                            <ButtonGroup size='sm'>
                                              <Button
                                                colorScheme='red'
                                                onClick={() => {
                                                  signCertificate(index)()
                                                  onClose()
                                                }}>
                                                Activate
                                              </Button>
                                            </ButtonGroup>
                                          </PopoverFooter>
                                        </PopoverContent>
                                      </Portal>
                                    </>
                                  )}
                                </Popover>
                              </td>
                            )}
                          </tr>
                        ))
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

export default CertTable
