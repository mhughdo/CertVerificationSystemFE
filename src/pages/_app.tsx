import type { AppProps /* , AppContext */ } from 'next/app'
import '../styles/globals.css'
import { Chakra } from '@components/Chakra'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Chakra cookies={pageProps.cookies}>
      <Component {...pageProps} />
    </Chakra>
  )
}

export default MyApp
