/* eslint-disable camelcase */
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Stack,
  Box,
  Text,
  Container,
  FormErrorMessage,
  InputGroup,
} from '@chakra-ui/react'
import MarkdownEditor from '@components/MarkdownEditor'
import { useAppState, Role, Company, AADUser, Student, Rector } from '@store/appState'
import { useState, useEffect } from 'react'
import Layout from '@components/Layout'
import Router from 'next/router'
import { useForm, SubmitHandler } from 'react-hook-form'
import DatePicker from '@components/DatePicker'
import { formatDate } from '@utils/index'
import useRequiredRoles from '@hooks/useRequiredRoles'
import ContentLoadingSkeleton from '@components/ContentLoadingSkeleton'

const RectorProfileUpdate = () => {
  type FormData = {
    name: string
    phone: string
    term: string
  }

  const { state, dispatch } = useAppState()
  const { user, accountAddress, userContract } = state
  const { name, date: rectorDate, phone, term } = user as Rector
  const toast = useToast()
  const dateArr = rectorDate
    .split('/')
    .reverse()
    .map((item, index) => {
      if (index === 1) {
        return Number(item) - 1
      }

      return Number(item)
    }) as [number, number, number]
  const [date, setDate] = useState(new Date(...dateArr))
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()
  const [loading, setLoading] = useState(false)

  const [requiredRolesLoading] = useRequiredRoles([Role.RECTOR])

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      setLoading(true)
      const { name, phone, term } = formData
      const formattedDate = formatDate(date)

      await userContract.methods.updateCurrentRector(name, formattedDate, phone, term).send({ from: accountAddress })

      toast({
        title: 'Success',
        description: 'Rector was successfully transfered!',
        status: 'success',
        duration: 2000,
        position: 'top',
      })

      dispatch({ type: 'USER_CHANGE', user: { ...user, name, phone, term, date: formattedDate } })
      Router.push('/profile')
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
        <Box d='flex' alignItems='center' justifyContent='center'>
          <Box flex='1 1' bg='white' py='8' px={4} shadow='base' rounded='lg' maxW='40%'>
            <Stack spacing='6'>
              <FormControl id='name' isRequired>
                <FormLabel>Rector Name</FormLabel>
                <Input defaultValue={name} {...register('name')} id='name' name='name' type='text' required />
              </FormControl>
              <Box>
                <Text mb={4}>Date of birth</Text>
                <DatePicker
                  onChange={(value) => {
                    return setDate(value)
                  }}
                  value={date}
                />
              </Box>
              <FormControl id='phone' isRequired isInvalid={Boolean(errors?.phone?.message)}>
                <FormLabel>Phone number</FormLabel>
                <Input
                  id='phone'
                  name='phone'
                  type='text'
                  defaultValue={phone}
                  {...register('phone', {
                    pattern: {
                      value: /^\d{9,11}$/,
                      message: 'Phone number is invalid!',
                    },
                  })}
                  required
                />
                <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
              </FormControl>
              <FormControl id='term' isRequired>
                <FormLabel>Term</FormLabel>
                <Input defaultValue={term} {...register('term')} id='term' name='term' type='text' required />
              </FormControl>
            </Stack>
            <Button colorScheme='teal' mt={8} type='submit' disabled={loading} w='100%'>
              Update
            </Button>
          </Box>
        </Box>
      </form>
    </Layout>
  )
}

const StudentProfileUpdate = () => {
  type FormData = {
    email: string
    phone: string
  }

  const toast = useToast()
  const { state, dispatch } = useAppState()
  const { userContract, accountAddress, user } = state
  const { email, phone } = user as Student
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      setLoading(true)
      const { email, phone } = formData

      await userContract.methods.updateStudentInfo(email, phone).send({ from: accountAddress })

      toast({
        title: 'Success',
        description: 'Account was successfully updated!',
        status: 'success',
        duration: 2000,
        position: 'top',
      })
      dispatch({ type: 'USER_CHANGE', user: { ...user, email, phone } })
      Router.push('/profile')
    } catch (error) {
      console.log(error)
      if (error?.code === 4001) return
      toast({
        title: 'Error.',
        description: 'Error occured while updating account!',
        status: 'error',
        duration: 3000,
        position: 'top',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout pageTitle='Update your account'>
      <Container pb='12' px={{ sm: '6', lg: '8' }} color='black' maxW='container.md'>
        <Box mx={{ sm: 'auto' }} mt='8' w={{ sm: 'full' }}>
          <Box bg='white' py='8' px={{ base: '4', md: '10' }} shadow='base' rounded={{ sm: 'lg' }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing='6'>
                <FormControl id='email' isRequired isInvalid={Boolean(errors?.email?.message)}>
                  <FormLabel>Email</FormLabel>
                  <InputGroup>
                    <Input
                      id='email'
                      name='email'
                      type='email'
                      defaultValue={email}
                      required
                      {...register('email', {
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Email is not valid',
                        },
                      })}
                    />
                  </InputGroup>
                  <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                </FormControl>
                <FormControl id='phone' isRequired isInvalid={Boolean(errors?.phone?.message)}>
                  <FormLabel>Phone Number</FormLabel>
                  <InputGroup>
                    <Input
                      id='phone'
                      name='phone'
                      type='tel'
                      defaultValue={phone}
                      required
                      {...register('phone', {
                        pattern: {
                          value: /^\d{9,11}$/,
                          message: 'Phone number is invalid!',
                        },
                      })}
                    />
                  </InputGroup>
                  <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
                </FormControl>

                <Button type='submit' colorScheme='teal' size='lg' fontSize='md' disabled={loading}>
                  Update
                </Button>
              </Stack>
            </form>
          </Box>
        </Box>
      </Container>
    </Layout>
  )
}

const AADUserProfileUpdate = () => {
  type FormData = {
    name: string
    phone_number: string
  }

  const toast = useToast()
  const { state, dispatch } = useAppState()
  const { userContract, accountAddress, user } = state
  const { name, date: AADUserDate, phone } = user as AADUser

  const dateArr = AADUserDate.split('/')
    .reverse()
    .map((item, index) => {
      if (index === 1) {
        return Number(item) - 1
      }

      return Number(item)
    }) as [number, number, number]
  const [date, setDate] = useState(new Date(...dateArr))
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit: SubmitHandler<FormData> = async (formData) => {
    try {
      setLoading(true)
      const { name } = formData
      const phoneNumber = formData.phone_number
      const formattedDate = formatDate(date)

      await userContract.methods.updateAADepartmentUser(name, formattedDate, phoneNumber).send({ from: accountAddress })
      toast({
        title: 'Success',
        description: 'Account was successfully updated!',
        status: 'success',
        duration: 2000,
        position: 'top',
      })

      dispatch({ type: 'USER_CHANGE', user: { ...user, name, date: formattedDate, phone: phoneNumber } })
      Router.push('/profile')
    } catch (error) {
      console.log(error)
      if (error?.code === 4001) return
      toast({
        title: 'Error.',
        description: 'Error occured while updating account!',
        status: 'error',
        duration: 3000,
        position: 'top',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout pageTitle='Update Academic Affairs Department Account'>
      <Container pb='12' px={{ sm: '6', lg: '8' }} color='black' maxW='container.md'>
        <Box mx={{ sm: 'auto' }} mt='8' w={{ sm: 'full' }}>
          <Box bg='white' py='8' px={{ base: '4', md: '10' }} shadow='base' rounded={{ sm: 'lg' }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing='6'>
                <FormControl id='name' isRequired>
                  <FormLabel>Name</FormLabel>
                  <Input defaultValue={name} id='name' name='name' {...register('name')} type='text' required />
                </FormControl>
                <Box>
                  <Text mb={4}>Date of birth</Text>
                  <DatePicker
                    onChange={(value) => {
                      return setDate(value)
                    }}
                    value={date}
                  />
                </Box>
                <FormControl id='phone_numner' isRequired isInvalid={Boolean(errors?.phone_number?.message)}>
                  <FormLabel>Phone Number</FormLabel>
                  <InputGroup>
                    <Input
                      id='phone_numner'
                      name='phone_numner'
                      type='tel'
                      defaultValue={phone}
                      required
                      {...register('phone_number', {
                        pattern: {
                          value: /^\d{9,11}$/,
                          message: 'Phone number is invalid!',
                        },
                      })}
                    />
                  </InputGroup>
                  <FormErrorMessage>{errors.phone_number?.message}</FormErrorMessage>
                </FormControl>

                <Button type='submit' colorScheme='teal' size='lg' fontSize='md' disabled={loading}>
                  Create
                </Button>
              </Stack>
            </form>
          </Box>
        </Box>
      </Container>
    </Layout>
  )
}

const CompanyProfileUpdate = () => {
  const { state, dispatch } = useAppState()
  const { userContract, accountAddress, user } = state
  const initDes = (user as Company).description
  const initJobDes = (user as Company).jobInfo
  const [description, setDescription] = useState(initDes)
  const [jobDescription, setJobDescription] = useState(initJobDes)
  const [loading, setLoading] = useState(false)
  const toast = useToast()
  const [companyName, setCompanyName] = useState(user.name)

  const onSubmit = async () => {
    try {
      setLoading(true)
      // console.log(await userContract.methods.getAllCompany().call({ from: accountAddress }))
      await userContract.methods.updateCompany(companyName, description, jobDescription).send({ from: accountAddress })

      toast({
        title: 'Success',
        description: 'Account was successfully updated!',
        status: 'success',
        duration: 1000,
        position: 'top',
      })
      dispatch({
        type: 'USER_CHANGE',
        user: { ...user, name: companyName, description, jobInfo: jobDescription },
      })
      Router.push('/profile')
    } catch (error) {
      console.log(error)
      toast({
        title: 'Error.',
        description: 'Error occured while updating account!',
        status: 'error',
        duration: 3000,
        position: 'top',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout pageTitle='Update your profile'>
      <Container px={8} color='black' maxW='container.md'>
        <Box bg='white' py='8' px={{ base: '4', md: '10' }} shadow='base' rounded={{ sm: 'lg' }}>
          <form>
            <Stack spacing='6'>
              <FormControl id='company-name'>
                <FormLabel>Company name</FormLabel>
                <Input
                  value={companyName}
                  onChange={(e) => {
                    return setCompanyName(e.target.value)
                  }}
                  id='company_name'
                  name='company_name'
                  type='text'
                  required
                />
              </FormControl>
              <Box>
                <Text mb={2}>Description</Text>
                <MarkdownEditor initValue={initDes} setValue={setDescription} />
              </Box>
              <Box>
                <Text mb={2}>Job description</Text>
                <MarkdownEditor initValue={initJobDes} setValue={setJobDescription} />
              </Box>
              <Button onClick={onSubmit} colorScheme='teal' size='lg' fontSize='md' disabled={loading}>
                Update
              </Button>
            </Stack>
          </form>
        </Box>
      </Container>
    </Layout>
  )
}

export const ProfileUpdate = () => {
  const roleToComp = {
    [Role.AADEPARTMENT]: <AADUserProfileUpdate />,
    [Role.COMPANY]: <CompanyProfileUpdate />,
    [Role.STUDENT]: <StudentProfileUpdate />,
    [Role.RECTOR]: <RectorProfileUpdate />,
  }
  const { state } = useAppState()
  const { user } = state

  return <div>{roleToComp[user.role] || null}</div>
}

export default ProfileUpdate
