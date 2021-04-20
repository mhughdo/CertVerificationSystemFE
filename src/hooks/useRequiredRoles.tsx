import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAppState } from '@store/appState'
import { useToast } from '@chakra-ui/react'

function useRequiredRoles(roles: string[], redirectUrl = '/') {
  const router = useRouter()
  const { state } = useAppState()
  const { user } = state
  const toast = useToast()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!roles || roles?.length === 0) return

    if (!roles.includes(user.role)) {
      toast({
        title: 'Error.',
        description: "You don't have permission to access this page!",
        status: 'error',
        duration: 3000,
        position: 'top',
      })
      router.push(redirectUrl)
    } else {
      setLoading(false)
    }
  }, [user, router, redirectUrl, roles, toast])

  return [loading]
}

export default useRequiredRoles
