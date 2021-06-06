import Layout from '@components/Layout'
import { useEffect, useState } from 'react'
import { useAppState, Company } from '@store/appState'
import { Button, Box, Text, useToast } from '@chakra-ui/react'
import { normalizeWeb3Object } from '@utils/index'
import CompanyTable from '@components/aad/CompanyTable'
import Router from 'next/router'

const CompanyManage = () => {
  const { state } = useAppState()
  const { web3, userContract, accountAddress } = state
  const [companyList, setCompanyList] = useState<Company[]>([])
  const toast = useToast()

  useEffect(() => {
    const getCompanyList = async () => {
      try {
        const companyList = (await userContract.methods.getAllCompany().call({ from: accountAddress })) || []

        const normalizedCompanyList = companyList.map(normalizeWeb3Object)
        setCompanyList(normalizedCompanyList)
      } catch (error) {
        console.log('Error getting account', error)
        toast({
          title: 'Error.',
          description: 'Error occured while fetching Student Accounts!',
          status: 'error',
          duration: 3000,
          position: 'top',
        })
      }
    }
    getCompanyList()
  }, [])

  return (
    <Layout>
      <Text mb={8} fontSize='2xl' fontWeight='bold'>
        Danh sách công ty
      </Text>

      <CompanyTable companyList={companyList} setCompanyList={setCompanyList} />
    </Layout>
  )
}

export default CompanyManage
