import Layout from '@components/Layout'
import { useEffect, useState } from 'react'
import { useAppState, Certificate, Student } from '@store/appState'
import { useToast, Button, Text, Box } from '@chakra-ui/react'
import { normalizeWeb3Object } from '@utils/index'
import Router from 'next/router'
import CertTable from '@components/rector/CertTable'

const CertManage = () => {
  const { state } = useAppState()
  const { web3, certContract, accountAddress } = state
  const [certList, setCertList] = useState<
    (Certificate & {
      studentID: string
      studentName: string
      studentClass: string
      studentMajor: string
      studentDOB: string
    })[]
  >()
  const toast = useToast()

  useEffect(() => {
    const getCertList = async () => {
      try {
        // const res = await certContract.methods.createCertificate('17020783').send({ from: accountAddress })
        // console.log(res)
        const certList = await certContract.methods.seeAllCerts().call({ from: accountAddress })
        const normalizedCertList = []
        let i = 0
        for (const c of certList) {
          const normalizedItem = normalizeWeb3Object(c)
          const student = (await certContract.methods.getStudentByCert(i).call({ from: accountAddress })) as Student
          i += 1
          normalizedCertList.push({
            ...normalizedItem,
            studentID: student.id,
            studentName: student.name,
            studentClass: student.class,
            studentMajor: student.major,
            studentDOB: student.date,
          })
        }

        setCertList(normalizedCertList)
        console.log(certList)
      } catch (error) {
        console.log('Error getting account', error)
        toast({
          title: 'Error.',
          description: 'Error occured while fetching certificate list!',
          status: 'error',
          duration: 3000,
          position: 'top',
        })
      }
    }

    getCertList()
  }, [])

  return (
    <Layout>
      <Text mb={4} fontSize='2xl' fontWeight='bold'>
        Certificate Management
      </Text>

      <Box d='flex' justifyContent='flex-end' mb={8}>
        <Button
          colorScheme='teal'
          size='md'
          onClick={() => {
            return Router.push('/certificate/new')
          }}>
          Create new certificate
        </Button>
      </Box>
      <CertTable certList={certList} setCertList={setCertList} />
    </Layout>
  )
}

export default CertManage
