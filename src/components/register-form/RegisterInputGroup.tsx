import { Button, FormControl, FormLabel, Input, useToast, Stack, Box, Text, Alert, AlertIcon } from '@chakra-ui/react'
import MarkdownEditor from '@components/MarkdownEditor'
import { useAppState } from '@store/appState'
import { useState, useRef } from 'react'
import MotionBox from '@components/MotionBox'
import { AnimatePresence } from 'framer-motion'

export const RegisterInputGroup = () => {
  const signUpRef = useRef(null)
  const [markdownValue, setMarkDownValue] = useState('### This is job description')
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
      const description = form.description.value
      const res = await userContract.methods
        .createCompany(companyName, description, markdownValue)
        .send({ from: accountAddress })

      if (res) {
        setSignUpSuccess(true)
      }
    } catch (error) {
      console.log(error)
      toast({
        title: 'Error.',
        description: 'Error occured while creating account!',
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
              <FormLabel>Company name</FormLabel>
              <Input id='company_name' name='company_name' type='text' required />
            </FormControl>
            <FormControl id='description'>
              <FormLabel>Description</FormLabel>
              <Input id='description' name='description' type='text' required />
            </FormControl>
            <Box>
              <Text mb={2}>Job description</Text>
              <MarkdownEditor setValue={setMarkDownValue} />
            </Box>
            <Button type='submit' colorScheme='blue' size='lg' fontSize='md' disabled={loading}>
              Sign up
            </Button>
          </Stack>
        </form>
      )}
      <AnimatePresence>
        {signUpSuccess && (
          <MotionBox initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Alert status='success'>
              <AlertIcon />
              Successfully registered an account, please wait until Office of Academic Affairs approves your account!
            </Alert>
          </MotionBox>
        )}
      </AnimatePresence>
    </>
  )
}
