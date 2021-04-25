import { useEffect, useState } from 'react'
import { useAppState, Certificate, Student } from '@store/appState'
import { useToast, Box, Text, Button } from '@chakra-ui/react'
import { normalizeWeb3Object } from '@utils/index'
import CertRenderer from '@components/CertRenderer'

const MyCertificate = () => {
  const { state } = useAppState()
  const { certContract, accountAddress, user } = state
  const toast = useToast()
  const [cert, setCert] = useState<Certificate>()

  const getMyCertificate = async () => {
    try {
      const cert = (await certContract.methods.seeMyCertificate().call({ from: accountAddress })) as Certificate[]
      if (!cert?.length) return
      const normalized = normalizeWeb3Object(cert[0]) as Certificate

      if (cert) setCert(normalized)
    } catch (error) {
      console.log(error)
      toast({
        title: 'Error.',
        description: 'Error occured while fetching certificate!',
        status: 'error',
        duration: 3000,
        position: 'top',
      })
    }
  }
  useEffect(() => {
    getMyCertificate()
  }, [])

  const changeCertVisibility = async () => {
    try {
      await certContract.methods.changeCertVisibility(0).send({ from: accountAddress })
      toast({
        title: 'Success',
        description: 'Cert visibility was successfully changed!',
        status: 'success',
        duration: 2000,
        position: 'top',
      })
      getMyCertificate()
    } catch (error) {
      console.log(error)
      if (error?.code === 4001) return
      toast({
        title: 'Error.',
        description: 'Error occured while hiding your certificate!',
        status: 'error',
        duration: 3000,
        position: 'top',
      })
    }
  }

  if (!cert || cert.signed === false) {
    return (
      <Box textAlign='center'>
        <Text fontSize='2xl'>Your certificate hasn't been signed or created yet</Text>
      </Box>
    )
  }

  return (
    <Box>
      {cert?.visible === true && (
        <Box d='flex' alignItems='center' mb={8} justifyContent='center'>
          <Text>Your certificate is visible to all companies.</Text>
          <Button ml={4} onClick={changeCertVisibility}>
            Hide
          </Button>
        </Box>
      )}
      {cert?.visible === false && (
        <Box d='flex' alignItems='center' mb={8} justifyContent='center'>
          <Text>Your certificate is only visible to you.</Text>
          <Button ml={4} onClick={changeCertVisibility}>
            Make it public
          </Button>
        </Box>
      )}
      <Box>
        <CertRenderer
          major={(user as Student).major}
          name={user.name}
          grade={cert.grade}
          dob={(user as Student).date}
        />
      </Box>
    </Box>
  )
}

export default MyCertificate
