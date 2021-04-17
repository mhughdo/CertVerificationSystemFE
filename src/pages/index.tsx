/* eslint-disable import/no-extraneous-dependencies */
import AADUserManage from '@components/rector/AADUserManage'
import StudentManage from '@components/aad/StudentManage'
import MyCertificate from '@components/student/MyCertificate'
import Layout from '@components/Layout'
import { Role, useAppState } from '@store/appState'

const roleToComp = {
  [Role.RECTOR]: <AADUserManage />,
  [Role.AADEPARTMENT]: <StudentManage />,
  [Role.STUDENT]: <MyCertificate />,
}

const Index = () => {
  const { state } = useAppState()
  const { user } = state

  return <Layout>{roleToComp[user.role]}</Layout>
}

export default Index
