import { Box } from '@chakra-ui/react'
import Image from 'next/image'

const Loading = () => (
  <Box
    position='fixed'
    minH='100vh'
    top='0'
    left='0'
    right='0'
    bottom='0'
    zIndex={9999}
    d='flex'
    justifyContent='center'
    alignItems='center'
    bg='#0e1e25'>
    <Box ml='auto' mr='auto'>
      <Box
        animation='rotate 2s ease infinite'
        sx={{
          '@keyframes rotate': {
            '0%': {
              transform: 'rotate(0)',
            },
            '100%': {
              transform: 'rotate(359deg)',
            },
          },
        }}>
        <Image src='/logo.png' width={50} height={60} />
      </Box>
    </Box>
  </Box>
)

export default Loading
