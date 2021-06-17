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
  Checkbox,
  Text,
} from '@chakra-ui/react'
import { Certificate, useAppState, Role } from '@store/appState'
import { FC, useState } from 'react'
import Link from 'next/link'

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
  const { user, certContract, accountAddress } = state
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [checkboxes, setCheckboxes] = useState<boolean[]>([])
  const hasOneCheckboxChecked = !!checkboxes.find((c) => {
    return !!c
  })

  const signCertificate = (id: number) => {
    return async () => {
      try {
        setLoading(true)
        await certContract.methods.signCertificate(id).send({ from: accountAddress })

        // toast({
        //   title: 'Info',
        //   description: 'Generating certificate image...',
        //   status: 'info',
        //   duration: 1000,
        //   position: 'top',
        // })
        // await axios.post('/api/generate-cert', {
        //   major: certList[id].studentMajor,
        //   grade: certList[id].grade,
        //   name: certList[id].studentName,
        //   studentID: certList[id].studentID,
        //   dob: certList[id].studentDOB,
        // })

        const newCertList = [...certList]
        const signedItem = newCertList[id]
        signedItem.signed = true
        newCertList[id] = signedItem

        setCertList(newCertList)
        toast({
          title: 'Success',
          description: 'Bằng tốt nghiệp được tạo thành công!',
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
  }

  const signCertificates = async () => {
    try {
      setLoading(true)
      const ids = checkboxes.filter(Boolean).map((c, index) => {
        return index
      })

      if (!ids.length) {
        setLoading(false)
        return
      }

      await certContract.methods.signMultipleCert(ids).send({ from: accountAddress })

      const newCertList = [...certList]
      for (const id of ids) {
        const signedItem = newCertList[id]
        signedItem.signed = true
        newCertList[id] = signedItem
      }
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
          description: 'Canceled certificates creation!',
          status: 'info',
          duration: 2000,
          position: 'top',
        })
        return
      }
      toast({
        title: 'Error.',
        description: 'Error occured while signing certificates!',
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
      {user.role === Role.RECTOR && (
        <Box d='flex' alignItems='center'>
          <Button
            colorScheme='teal'
            size='md'
            my={4}
            mr={4}
            onClick={signCertificates}
            disabled={!hasOneCheckboxChecked}>
            Ký bằng tốt nghiệp
          </Button>
          {checkboxes.find((c) => {
            return !!c
          }) && <Text>Đã chọn {checkboxes.filter(Boolean).length} hàng</Text>}
        </Box>
      )}

      <div>
        <div className='max-w-7xl mx-auto'>
          <div className='flex flex-col'>
            <div className='-my-2 overflow-x-auto'>
              <div className='py-2 align-middle inline-block min-w-full'>
                <div className='shadow overflow-hidden border-b border-gray-200 sm:rounded-lg'>
                  <table className='min-w-full divide-y divide-gray-200'>
                    <thead className='bg-gray-50'>
                      <tr>
                        {user.role === Role.RECTOR && (
                          <th
                            scope='col'
                            className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                            <Checkbox
                              colorScheme='green'
                              isChecked={hasOneCheckboxChecked}
                              onChange={(e) => {
                                const { checked } = e.target
                                setCheckboxes(
                                  certList.map((cert, index) => {
                                    return certList[index].signed === false && !!checked
                                  })
                                )
                              }}
                            />
                          </th>
                        )}

                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          MSSV
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Tên
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Lớp
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Chuyên ngành
                        </th>

                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Loại
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Trạng thái
                        </th>

                        {user.role === Role.RECTOR && (
                          <th scope='col' className='relative px-6 py-3'>
                            <span className='sr-only'>Ký</span>
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200' data-todo-x-max='1'>
                      {certList?.length ? (
                        certList.map((cert, index) => {
                          return (
                            <tr key={index}>
                              {user.role === Role.RECTOR && (
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                  <Checkbox
                                    colorScheme='green'
                                    isChecked={checkboxes[index]}
                                    isDisabled={certList[index].signed === true}
                                    onChange={(e) => {
                                      const newCheckboxes = [...checkboxes]
                                      newCheckboxes[index] = e.target.checked
                                      setCheckboxes(newCheckboxes)
                                    }}
                                  />
                                </td>
                              )}

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
                                  <Tag colorScheme='green'>Đã ký</Tag>
                                ) : (
                                  <Tag colorScheme='red'>Chưa được ký</Tag>
                                )}
                              </td>
                              {user.role === Role.RECTOR && (
                                <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                                  <Popover isLazy>
                                    {({ isOpen, onClose }) => {
                                      return (
                                        <>
                                          <PopoverTrigger>
                                            <Button disabled={cert.signed || loading}>
                                              {loading ? 'Đang ký' : 'Ký'}
                                            </Button>
                                          </PopoverTrigger>
                                          <Portal>
                                            <PopoverContent>
                                              <PopoverArrow />
                                              <PopoverCloseButton />
                                              <PopoverHeader>Xác nhận!</PopoverHeader>
                                              <PopoverBody>Bạn có chắc muốn ký bằng tốt nghiệp này?</PopoverBody>
                                              <PopoverFooter d='flex' justifyContent='flex-end'>
                                                <ButtonGroup size='sm'>
                                                  <Button
                                                    colorScheme='red'
                                                    onClick={() => {
                                                      signCertificate(index)()
                                                      onClose()
                                                    }}>
                                                    Ký
                                                  </Button>
                                                </ButtonGroup>
                                              </PopoverFooter>
                                            </PopoverContent>
                                          </Portal>
                                        </>
                                      )
                                    }}
                                  </Popover>
                                </td>
                              )}
                            </tr>
                          )
                        })
                      ) : (
                        <tr>
                          <td className='p-4'>Không có dữ liệu</td>
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
