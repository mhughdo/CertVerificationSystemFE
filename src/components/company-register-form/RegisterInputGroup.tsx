import { Button, FormControl, FormLabel, Input, useToast, Stack, Box, Text, Alert, AlertIcon } from '@chakra-ui/react'
import MarkdownEditor from '@components/MarkdownEditor'
import { useAppState } from '@store/appState'
import { useState, useRef } from 'react'
import MotionBox from '@components/MotionBox'
import { AnimatePresence } from 'framer-motion'

export const RegisterInputGroup = () => {
  const signUpRef = useRef(null)
  const [markdownValue, setMarkDownValue] = useState('### This is company description')
  const [signUpSuccess, setSignUpSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const { state } = useAppState()
  const { userContract, accountAddress } = state
  const toast = useToast()

  const onSubmit = async (e) => {
    try {
      e.preventDefault()
      setLoading(true)
      // console.log(await userContract.methods.getAllCompany().call({ from: accountAddress }))
      const form = signUpRef.current
      const companyName = form.company_name.value
      const res = await userContract.methods.createCompany(companyName, markdownValue).send({ from: accountAddress })

      if (res) {
        setSignUpSuccess(true)
      }
    } catch (error) {
      console.log(error)
      toast({
        title: 'Error.',
        description: 'Đã có lỗi xảy ra khi tạo tài khoản!',
        status: 'error',
        duration: 3000,
        position: 'top',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {!signUpSuccess && (
        <form ref={signUpRef} onSubmit={onSubmit}>
          <Stack spacing='6'>
            <FormControl id='company-name'>
              <FormLabel>Tên công ty</FormLabel>
              <Input id='company_name' name='company_name' type='text' required />
            </FormControl>
            <Box>
              <Text mb={2}>Mô tả</Text>
              <MarkdownEditor setValue={setMarkDownValue} />
            </Box>
            {/* <Box>
              <Text mb={2}>Job description</Text>
              <MarkdownEditor setValue={setMarkDownValue} />
            </Box> */}
            <Button type='submit' colorScheme='blue' size='lg' fontSize='md' disabled={loading}>
              Đăng ký
            </Button>
          </Stack>
        </form>
      )}
      <AnimatePresence>
        {signUpSuccess && (
          <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Alert status='success'>
              <AlertIcon />
              Tài khoản đã được tạo thành công, bạn có thể đăng nhập ngay sau khi Phòng đào tạo kích hoạt tài khoản!
            </Alert>
          </MotionBox>
        )}
      </AnimatePresence>
    </>
  )
}
