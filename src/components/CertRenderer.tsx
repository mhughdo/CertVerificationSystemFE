import Image from 'next/image'
import { Text, Box, SimpleGrid, Stack } from '@chakra-ui/react'
import { FC } from 'react'

const gradeEnToVi = {
  excellent: 'Xuất sắc',
  good: 'Giỏi',
  credit: 'Khá',
}

const monthEn = {
  0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'August',
  8: 'September',
  9: 'October',
  10: 'November',
  11: 'December',
}

const CertRenderer: FC<{ major?: string; name?: string; grade?: string; dob?: string }> = ({
  major = 'Information Technology',
  name = 'Do Manh Hung',
  grade = 'Excellent',
  dob = '12/11/1999',
}) => {
  const getDOB = () => {
    if (typeof dob !== 'string') return ''

    return `${dob.split('/')[0]} ${monthEn[Number(dob.split('/')[1]) - 1]} ${dob.split('/')[2]}`
  }

  return (
    <Box w='95%' minW='95%' minH='678px' d='flex' justifyContent='center' position='relative'>
      <Box position='absolute' inset='0'>
        <Image src='/trong-dong.png' width='1200px' height='678px' />
      </Box>
      <SimpleGrid columns={2} spacingX='20px' w='100%' zIndex={9999}>
        <Box>
          <Box textAlign='center' pt={10}>
            <Text fontWeight='bold' fontSize='2xl'>
              SOCIALIST REPUBLIC OF VIETNAM
            </Text>
            <Text fontSize='lg'>Independence - Freedom - Happiness</Text>
          </Box>

          <Box mt={16} textAlign='center'>
            <Text fontSize='xl' fontWeight='300'>
              VIETNAM NATIONAL UNIVERSITY, HANOI
            </Text>
            <Text fontWeight='500'>RECTOR</Text>
          </Box>
          <Box textAlign='center'>
            <Text fontWeight='700' fontSize='xl'>
              VNU University of Engineering and Technology
            </Text>
            <Text fontWeight='500' fontSize='md'>
              Awards
            </Text>
          </Box>
          <Box ml={8}>
            <Text fontSize='4xl' letterSpacing='3px' color='red.500' fontWeight='500'>
              THE DEGREE OF BACHELOR
            </Text>
            <Stack>
              <Text fontSize='lg'>
                In:{' '}
                <b>
                  <i>{major}</i>
                </b>
              </Text>
              <Box fontSize='lg' d='flex'>
                <Text>
                  Mode of study: <b>Full-time</b>
                </Text>
                <Text ml={16}>
                  Grade: <b>{grade}</b>
                </Text>
              </Box>
              <Box fontSize='lg' d='flex' alignItems='baseline'>
                <Text>To: </Text>
                <Text ml={4} fontSize='2xl' fontWeight='bold' fontStyle='italic'>
                  Mr {name}
                </Text>
              </Box>
              <Box fontSize='lg' d='flex' alignItems='baseline'>
                <Text>Date of birth: </Text>
                <Text ml={4} fontWeight='bold'>
                  {getDOB()}
                </Text>
              </Box>
              <Box fontSize='lg' d='flex' alignItems='baseline'>
                <Text>Place of birth: </Text>
                <Text ml={4} fontWeight='bold'>
                  Hanoi
                </Text>
              </Box>
            </Stack>
          </Box>
        </Box>
        <Box>
          <Box textAlign='center' pt={10}>
            <Text fontWeight='bold' fontSize='xl'>
              CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM
            </Text>
            <Text fontSize='md'>Độc lập - Tự do - Hạnh phúc</Text>
          </Box>

          <Box mt={16} textAlign='center'>
            <Text fontSize='xl' fontWeight='300'>
              ĐẠI HỌC QUỐC GIA HÀ NỘI
            </Text>
            <Text fontWeight='500'>HIỆU TRƯỞNG</Text>
          </Box>
          <Box textAlign='center'>
            <Text fontWeight='700' fontSize='xl'>
              Trường Đại học Công nghệ
            </Text>
            <Text fontWeight='500' fontSize='md'>
              Cấp
            </Text>
          </Box>
          <Box ml={24}>
            <Text fontSize='4xl' letterSpacing='6px' color='red.500' ml={4} fontWeight='500'>
              BẰNG CỬ NHÂN
            </Text>
            <Stack>
              <Text fontSize='lg'>
                Ngành:{' '}
                <b>
                  <i>{major}</i>
                </b>
              </Text>
              <Box fontSize='lg' d='flex'>
                <Text>
                  Hình thức: <b>Chính quy</b>
                </Text>
                <Text ml={16}>
                  Hạng: <b>{gradeEnToVi[`${grade.toLowerCase()}`] || 'Xuất sắc'}</b>
                </Text>
              </Box>
              <Box fontSize='lg' d='flex' alignItems='baseline'>
                <Text>Cho: </Text>
                <Text ml={4} fontSize='2xl' fontWeight='bold' fontStyle='italic'>
                  ông {name}
                </Text>
              </Box>
              <Box fontSize='lg' d='flex' alignItems='baseline'>
                <Text>Sinh ngày: </Text>
                <Text ml={4} fontWeight='bold'>
                  {dob}
                </Text>
              </Box>
              <Box fontSize='lg' d='flex' alignItems='baseline'>
                <Text>Tại: </Text>
                <Text ml={4} fontWeight='bold'>
                  Hà Nội
                </Text>
              </Box>
            </Stack>
          </Box>
        </Box>
      </SimpleGrid>
    </Box>
  )
}

export default CertRenderer
