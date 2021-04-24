/* eslint-disable react/no-children-prop */
import { useEffect, useState } from 'react'
import { Text, useToast, Box, Grid, LinkBox, LinkOverlay, Input, InputGroup, InputLeftElement } from '@chakra-ui/react'
import { SearchIcon } from '@chakra-ui/icons'
import { Company, useAppState } from '@store/appState'
import { normalizeWeb3Object } from '@utils/index'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

const CompanyList = () => {
  const toast = useToast()
  const { state } = useAppState()
  const { userContract, accountAddress } = state
  const [companyList, setCompanyList] = useState<Company[]>()
  const [filtered, setFiltered] = useState<Company[]>()
  const [searchInput, setSearchInput] = useState('')

  useEffect(() => {
    const getCompany = async () => {
      try {
        const companyList = await userContract.methods.getAllCompany().call({ from: accountAddress })

        const normalizedCompanyList = companyList.map(normalizeWeb3Object)

        setCompanyList(normalizedCompanyList)
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

    getCompany()
  }, [])

  useEffect(() => {
    if (!searchInput) {
      setFiltered(companyList)
    } else {
      setFiltered(
        companyList.filter((c) => {
          return c.name.toLowerCase().includes(searchInput.toLowerCase())
        })
      )
    }
  }, [searchInput, companyList])

  return (
    <Box>
      <Box d='flex' justifyContent='center' mb={8}>
        <InputGroup maxW='50%'>
          <InputLeftElement pointerEvents='none' children={<SearchIcon color='gray.300' />} />
          <Input
            value={searchInput}
            placeholder='Search company'
            onChange={(e) => {
              return setSearchInput(e.target.value)
            }}
          />
        </InputGroup>
      </Box>
      <Grid templateColumns='repeat(3, 1fr)' gap={6}>
        {filtered?.map((company, index) => {
          return (
            <LinkBox key={index} as='article' w='100%' bg='gray.50' padding={8} borderRadius='lg'>
              <Text fontSize='xl' fontWeight='bold' mb={2}>
                <Link href={`/company/${index}/view`} passHref>
                  <LinkOverlay>{company.name}</LinkOverlay>
                </Link>
              </Text>
              <ReactMarkdown children={company.description} />
            </LinkBox>
          )
        })}
      </Grid>
    </Box>
  )
}

export default CompanyList
