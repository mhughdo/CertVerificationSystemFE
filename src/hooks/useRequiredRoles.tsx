import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAppState } from '@store/appState'
import { useToast } from '@chakra-ui/react'

function useRequiredRoles(roles: string[], redirectUrl = '/') {
  const router = useRouter()
  const { state } = useAppState()
  const { user } = state
  const toast = useToast()

  useEffect(() => {
    if (!roles.includes(user.role)) {
      toast({
        title: 'Error.',
        description: "You don't have permission to access this page!",
        status: 'error',
        duration: 3000,
        position: 'top',
      })
      router.push(redirectUrl)
    }
  }, [user, router, redirectUrl, roles, toast])
}

export default useRequiredRoles
