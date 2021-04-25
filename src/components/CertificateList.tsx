/* eslint-disable react/no-children-prop */
import { useEffect, useState } from 'react'
import { Text, useToast, Box, Grid, LinkBox, LinkOverlay, Input, InputGroup, InputLeftElement } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { Certificate, useAppState } from '@store/appState'
import { normalizeWeb3Object } from '@utils/index'
import Link from 'next/link'

const CertificateList = () => {
  const toast = useToast()
  const { state } = useAppState()
  const { accountAddress, certContract } = state
  const [filtered, setFiltered] = useState<
    (Certificate & {
      studentID: string
      studentName: string
      studentClass: string
      studentMajor: string
      studentDOB: string
    })[]
  >()
  const [searchInput, setSearchInput] = useState('')
  const [certificateList, setCertificateList] = useState<
    (Certificate & {
      studentID: string
      studentName: string
      studentClass: string
      studentMajor: string
      studentDOB: string
    })[]
  >()

  useEffect(() => {
    const getCertList = async () => {
      try {
        const certList = await certContract.methods.seeVisibleCerts().call({ from: accountAddress })

        const normalizedCertList = []
        let i = 0
        for (const c of certList) {
          if (c.visible === true) {
            const normalizedItem = normalizeWeb3Object(c)
            const student = await certContract.methods.getStudentByCert(i).call({ from: accountAddress })
            normalizedCertList.push({
              ...normalizedItem,
              studentID: student.id,
              studentName: student.name,
              studentClass: student.class,
              studentMajor: student.major,
              studentDOB: student.date,
            })
          }
          i += 1
        }

        console.log(normalizedCertList)
        setCertificateList(normalizedCertList)
      } catch (error) {
        console.log(error)
        toast({
          title: 'Error.',
          description: 'Error while fetching user, make sure new rector address is valid!',
          status: 'error',
          duration: 3000,
          position: 'top',
        })
      }
    }

    getCertList()
  }, [])

  useEffect(() => {
    if (!searchInput) {
      setFiltered(certificateList)
    } else {
      setFiltered(
        certificateList.filter((c) => {
          return (
            c.studentID.toLowerCase().includes(searchInput.toLowerCase()) ||
            c.studentName.toLowerCase().includes(searchInput.toLowerCase())
          )
        })
      )
    }
  }, [searchInput, certificateList])

  return (
    <Box>
      <Box d='flex' justifyContent='center' mb={8}>
        <InputGroup maxW='50%'>
          <InputLeftElement pointerEvents='none' children={<SearchIcon color='gray.300' />} />
          <Input
            value={searchInput}
            placeholder='Search certificate'
            onChange={(e) => {
              return setSearchInput(e.target.value)
            }}
          />
        </InputGroup>
      </Box>
      <Grid templateColumns='repeat(3, 1fr)' gap={6}>
        {filtered?.map((cert, index) => {
          return (
            <LinkBox
              as='article'
              w='100%'
              bg='gray.100'
              padding={8}
              pb={2}
              borderRadius='lg'
              key={index}
              sx={{
                ':hover  #arrow': {
                  opacity: '1 !important',
                },
              }}>
              <Text fontSize='xl' fontWeight='bold' mb={2} _hover={{ color: '#4433ff' }}>
                <Link href={`/certificate/${index}/view`} passHref>
                  <LinkOverlay>
                    {cert.studentID} - {cert.studentName}
                  </LinkOverlay>
                </Link>
              </Text>

              <Text>Grade: {cert.grade}</Text>
              <Box d='flex' alignItems='baseline'>
                <Text fontSize='sm' mt={4} fontWeight='500' mr={2}>
                  See more
                </Text>
                <svg
                  id='arrow'
                  width='36'
                  height='10'
                  viewBox='0 0 36 12'
                  fill='none'
                  style={{ opacity: 0, transition: 'opacity 125ms ease 0s' }}>
                  <path
                    d='M0.75 6H11.25 M6 0.75L11.25 6L6 11.25'
                    stroke='#4433ff'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </Box>
            </LinkBox>
          )
        })}
      </Grid>
    </Box>
  )
}

export default CertificateList
