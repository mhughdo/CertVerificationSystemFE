import Layout from '@components/Layout'
import { Role, useAppState, Rector } from '@store/appState'
import { useEffect, useState } from 'react'
import useRequiredRoles from '@hooks/useRequiredRoles'
import { Box, Stack, FormControl, FormLabel, Input, Button, useToast, Text, FormErrorMessage } from '@chakra-ui/react'
import { ArrowForwardIcon } from '@chakra-ui/icons'
import { useForm, SubmitHandler } from 'react-hook-form'
import DatePicker from '@components/DatePicker'
import { formatDate } from '@utils/index'
import ContentLoadingSkeleton from '@components/ContentLoadingSkeleton'

type FormData = {
  address: string
  name: string
  phone: string
  term: string
}

const RectorTransfer = () => {
  const { state } = useAppState()
  const { user, accountAddress, userContract } = state
  const { name, date: rectorDate, phone, term } = user as Rector
  const toast = useToast()
  const [date, setDate] = useState(new Date())
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()
  const [loading, setLoading] = useState(false)

  const [requiredRolesLoading] = useRequiredRoles([Role.RECTOR])

  useEffect(() => {}, [])

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      setLoading(true)
      const { address, name, phone, term } = formData
      const formattedDate = formatDate(date)

      try {
        const role = await userContract.methods.getCurrentUserRoleByAddr(address).call({ from: accountAddress })
        if (role?.name) {
          toast({
            title: 'Error.',
            description: "Cannot transfer, there's already an account associated with this address!",
            status: 'error',
            duration: 3000,
            position: 'top',
          })

          return
        }
      } catch (error) {
        setLoading(false)
        console.log(error)
        toast({
          title: 'Error.',
          description: 'Error while fetching user, make sure new rector address is valid!',
          status: 'error',
          duration: 3000,
          position: 'top',
        })

        return
      }

      await userContract.methods
        .createNewRector(address, name, formattedDate, phone, term)
        .send({ from: accountAddress })

      toast({
        title: 'Success',
        description: 'Rector was successfully transfered!',
        status: 'success',
        duration: 2000,
        position: 'top',
      })
      window.location.href = '/'
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
      if (error?.code === 4001) return
      toast({
        title: 'Error.',
        description: 'Error occured while transfering rector!',
        status: 'error',
        duration: 3000,
        position: 'top',
      })
    }
  }

  if (requiredRolesLoading) {
    return <ContentLoadingSkeleton />
  }

  return (
    <Layout>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box d='flex' alignItems='center'>
          <Box flex='1 1' bg='white' py='8' px={4} shadow='base' rounded='lg'>
            <Stack spacing='6'>
              <FormControl id='current-rector-address'>
                <FormLabel>Address</FormLabel>
                <Input
                  value={accountAddress}
                  id='current-rector-address'
                  name='current-rector-address'
                  type='text'
                  isReadOnly
                />
              </FormControl>
              <FormControl id='current-rector-name'>
                <FormLabel>Tên hiệu trưởng</FormLabel>
                <Input value={name} id='current-rector-name' name='current-rector-name' type='text' isReadOnly />
              </FormControl>
              <FormControl id='current-rector-date'>
                <FormLabel>Ngày sinh</FormLabel>
                <Input value={rectorDate} id='current-rector-date' name='current-rector-date' type='text' isReadOnly />
              </FormControl>
              <FormControl id='current-rector-phone'>
                <FormLabel>Số điện thoại</FormLabel>
                <Input value={phone} id='current-rector-phone' name='current-rector-phone' type='text' isReadOnly />
              </FormControl>
              <FormControl id='current-rector-term'>
                <FormLabel>Nhiệm kỳ</FormLabel>
                <Input value={term} id='current-rector-term' name='current-rector-term' type='text' isReadOnly />
              </FormControl>
            </Stack>
          </Box>
          <ArrowForwardIcon mx={4} boxSize='1.5em' />
          <Box flex='1 1' bg='white' py='8' px={4} shadow='base' rounded='lg'>
            <Stack spacing='6'>
              <FormControl id='address' isRequired>
                <FormLabel>Địa chỉ ví</FormLabel>
                <Input {...register('address')} id='address' name='address' type='text' required />
              </FormControl>
              <FormControl id='name' isRequired>
                <FormLabel>Tên hiệu trưởng mới</FormLabel>
                <Input {...register('name')} id='name' name='name' type='text' required />
              </FormControl>
              <Box>
                <Text mb={4}>Ngày sinh</Text>
                <DatePicker
                  onChange={(value) => {
                    return setDate(value)
                  }}
                  value={date}
                />
              </Box>
              <FormControl id='phone' isRequired isInvalid={Boolean(errors?.phone?.message)}>
                <FormLabel>Số điện thoại</FormLabel>
                <Input
                  id='phone'
                  name='phone'
                  type='text'
                  {...register('phone', {
                    pattern: {
                      value: /^\d{9,11}$/,
                      message: 'Số điện thoại không hợp lệ!',
                    },
                  })}
                  required
                />
                <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
              </FormControl>
              <FormControl id='term' isRequired>
                <FormLabel>Nhiệm kỳ</FormLabel>
                <Input {...register('term')} id='term' name='term' type='text' required />
              </FormControl>
            </Stack>
          </Box>
        </Box>
        <Box d='flex' justifyContent='center'>
          <Button colorScheme='teal' mt={8} type='submit' disabled={loading}>
            Chuyển giao
          </Button>
        </Box>
      </form>
    </Layout>
  )
}

export default RectorTransfer
