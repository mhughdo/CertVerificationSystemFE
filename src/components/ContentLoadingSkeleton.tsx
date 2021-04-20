import Layout from '@components/Layout'
import { Box, Stack, Skeleton } from '@chakra-ui/react'

const ContentLoadingSkeleton = () => {
  return (
    <Layout>
      <Box maxW='container.xl' bg='white' borderRadius='md' p={4} m='0 auto' mt={8}>
        <Stack>
          <Skeleton height='20px' />
          <Skeleton height='20px' />
          <Skeleton height='20px' />
        </Stack>
      </Box>
    </Layout>
  )
}

export default ContentLoadingSkeleton
