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
  ButtonGroup,
  useToast,
} from '@chakra-ui/react'
import { useAppState, Company } from '@store/appState'
import { FC } from 'react'
import Link from 'next/link'

const CompanyTable: FC<{ companyList: Company[]; setCompanyList: (...args: any[]) => void }> = ({
  companyList,
  setCompanyList,
}) => {
  const toast = useToast()
  const { state } = useAppState()
  const { userContract, accountAddress } = state

  const activateCompanyAccount = (id: number) => {
    return async () => {
      try {
        await userContract.methods.approveCompany(id).send({ from: accountAddress })

        const newAccountList = [...companyList]
        const activatedAcc = newAccountList[id]
        activatedAcc.isActive = true
        newAccountList[id] = activatedAcc

        setCompanyList(newAccountList)
        toast({
          title: 'Thành công',
          description: 'Tài khoản được kích hoạt thành công!',
          status: 'success',
          duration: 2000,
          position: 'top',
        })
      } catch (error) {
        console.log('Error getting account', error)
        if (error?.code === 4001) {
          toast({
            title: 'Thông tin',
            description: 'Đã huỷ việc kích hoạt tài khoản!',
            status: 'info',
            duration: 2000,
            position: 'top',
          })
          return
        }
        toast({
          title: 'Lỗi.',
          description: 'Đã có lỗi xảy ra khi kích hoạt tài khoản!',
          status: 'error',
          duration: 3000,
          position: 'top',
        })
      }
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
                          Tên
                        </th>
                        <th
                          scope='col'
                          className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                          Mô tả
                        </th>
                        <th scope='col' className='relative px-6 py-3'>
                          <span className='sr-only'>Kích hoạt</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className='bg-white divide-y divide-gray-200' data-todo-x-max='1'>
                      {companyList.length ? (
                        companyList.map((account, index) => {
                          return (
                            <tr key={index}>
                              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600'>
                                <Link href={`/company/${index}/view`}>
                                  <a>{account.name}</a>
                                </Link>
                              </td>
                              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                {account.description}
                              </td>
                              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                {account.isActive ? (
                                  <Tag colorScheme='green'>Đã kích hoạt</Tag>
                                ) : (
                                  <Tag colorScheme='red'>Chưa kích hoạt</Tag>
                                )}
                              </td>
                              <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                                <Popover isLazy>
                                  {({ isOpen, onClose }) => {
                                    return (
                                      <>
                                        <PopoverTrigger>
                                          <Button disabled={account.isActive}>Kích hoạt</Button>
                                        </PopoverTrigger>
                                        <Portal>
                                          <PopoverContent>
                                            <PopoverArrow />
                                            <PopoverCloseButton />
                                            <PopoverHeader>Xác nhận!</PopoverHeader>
                                            <PopoverBody>Bạn có muốn kích hoạt tài khoản này?</PopoverBody>
                                            <PopoverFooter d='flex' justifyContent='flex-end'>
                                              <ButtonGroup size='sm'>
                                                <Button
                                                  colorScheme='red'
                                                  onClick={() => {
                                                    activateCompanyAccount(index)()
                                                    onClose()
                                                  }}>
                                                  Kích hoạt
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

export default CompanyTable
