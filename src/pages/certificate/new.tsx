import NewCert from '@components/rector/NewCert'
// import useRequiredRoles from '@hooks/useRequiredRoles'
// import { Role } from '@store/appState'
// import ContentLoadingSkeleton from '@components/ContentLoadingSkeleton'

const NewCertPage = () => {
  // const [loading] = useRequiredRoles([Role.RECTOR, Role.AADEPARTMENT])
  // if (loading) {
  //   return <ContentLoadingSkeleton />
  // }

  return (
    <div>
      <NewCert />
    </div>
  )
}

export default NewCertPage
