import { DatePicker } from 'react-rainbow-components'
import { chakra } from '@chakra-ui/react'
import { DatePickerProps } from 'react-rainbow-components/components/DatePicker/index'

const ChakraDatePicker = chakra(DatePicker)

const DatePickerComponent = (props: DatePickerProps) => (
  <ChakraDatePicker
    sx={{
      input: {
        borderRadius: 'md',
        border: '1px solid',
        borderColor: 'gray.200',
      },
    }}
    {...props}
  />
)

export default DatePickerComponent
