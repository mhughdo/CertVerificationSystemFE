import Layout from '@components/Layout'
import { useAppState, Certificate, Student } from '@store/appState'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Box, Text, useToast } from '@chakra-ui/react'
import { normalizeWeb3Object } from '@utils/index'
import ContentLoadingSkeleton from '@components/ContentLoadingSkeleton'
import CertRenderer from '@components/CertRenderer'

const CertificateView = () => {
  const [cert, setCert] = useState<
    Certificate & {
      studentID: string
      studentName: string
      studentClass: string
      studentMajor: string
      studentDOB: string
    }
  >()
  const { state } = useAppState()
  const { certContract, accountAddress, userContract } = state
  const router = useRouter()
  const { query } = router
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const { id } = query

  useEffect(() => {
    const getCert = async () => {
      try {
        setLoading(true)
        const certs = await certContract.methods.seeStudentCerts(id).call({ from: accountAddress })

        if (certs?.length) {
          const normalizedCert = normalizeWeb3Object(certs[0]) as Certificate
          const student = await userContract.methods.getStudentById(id)
          const normalizedStudent = normalizeWeb3Object(student) as Student
          setCert({
            ...normalizedCert,
            studentID: normalizedStudent.id,
            studentName: normalizedStudent.name,
            studentClass: normalizedStudent.class,
            studentMajor: normalizedStudent.major,
            studentDOB: normalizedStudent.date,
          })
        }

        console.log(cert)
      } catch (error) {
        console.log(error)
        toast({
          title: 'Error.',
          description: 'Error occured while fetching certificate!',
          status: 'error',
          duration: 3000,
          position: 'top',
        })
      } finally {
        setLoading(false)
      }
    }

    getCert()
  }, [])

  if (loading) {
    return <ContentLoadingSkeleton />
  }

  if (!cert) {
    return (
      <Layout>
        <Box textAlign='center'>
          <Text fontSize='2xl'>Certificate not found or hidden by student </Text>
        </Box>
      </Layout>
    )
  }

  return (
    <Layout>
      <Box>
        <CertRenderer major={cert.studentMajor} name={cert.studentName} grade={cert.grade} dob={cert.studentDOB} />
      </Box>
    </Layout>
  )
}

export default CertificateView
