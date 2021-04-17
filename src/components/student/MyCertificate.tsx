import { useEffect, useState } from 'react'
import { useAppState, Certificate, Student } from '@store/appState'
import { useToast, Box, Text, Button } from '@chakra-ui/react'
import { normalizeWeb3Object } from '@utils/index'
import Image from 'next/image'

const MyCertificate = () => {
  const { state } = useAppState()
  const { userContract, accountAddress, user } = state
  const toast = useToast()
  const [cert, setCert] = useState<Certificate>()
  const [imgUrl, setImgUrl] = useState('')

  const getMyCertificate = async () => {
    try {
      const cert = (await userContract.methods.seeMyCertificate().call({ from: accountAddress })) as Certificate[]
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

  useEffect(() => {
    const setUrl = () => {
      if (cert && cert.signed === true) {
        const { NEXT_PUBLIC_S3_BUCKET } = process.env
        const region = 'ap-southeast-1'
        const fileName = `grad_cert_${(user as Student).id}.jpg`
        const fileUrl = `https://${NEXT_PUBLIC_S3_BUCKET}.s3-${region}.amazonaws.com/${fileName}`
        console.log(fileUrl)
        setImgUrl(fileUrl)
      }
    }

    setUrl()
  }, [cert])

  const changeCertVisibility = async () => {
    try {
      await userContract.methods.changeCertVisibility(0).send({ from: accountAddress })
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

  if (cert?.signed === false) {
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
      <Box d='flex' justifyContent='center'>
        {imgUrl && <Image src={imgUrl} width='1024px' height='720px' />}
      </Box>
    </Box>
  )
}

export default MyCertificate
