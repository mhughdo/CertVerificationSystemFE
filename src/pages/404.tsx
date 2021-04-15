import Image from 'next/image'

const NotFound = () => (
  <div style={{ width: '100vw', height: '100vh' }}>
    <Image src='/404.png' layout='fill' />
  </div>
)

export default NotFound
