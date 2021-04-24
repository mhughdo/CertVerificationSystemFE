import { FC } from 'react'
import Editor from 'rich-markdown-editor'
import { Box, useToast } from '@chakra-ui/react'
import axios from 'axios'

type ReadOnly = { initValue: string; readOnly: true; setValue?: (value: string) => void }

type Editable = { initValue?: string; readOnly?: false; setValue: (value: string) => void }

const MarkdownEditor: FC<ReadOnly | Editable> = ({ initValue, setValue, readOnly = false }) => {
  const toast = useToast()

  const uploadFile = async (signedRequest: string, file: File) => {
    try {
      await axios.put(signedRequest, file, {
        headers: {
          'Content-Type': file.type,
        },
      })
    } catch (error) {
      console.log(error)
      toast({
        title: 'Error.',
        description: 'Error occured while uploading image!',
        status: 'error',
        duration: 3000,
        position: 'top',
      })
    }
  }

  const signRequest = async (file: File): Promise<string> => {
    try {
      const { data } = await axios.get(
        process.env.NODE_ENV === 'development' ? 'http://localhost:3001/api/sign-s3' : '/api/sign-s3',
        {
          params: {
            'file-name': file.name,
            'file-type': file.type,
          },
        }
      )
      const { signedRequest, url }: { signedRequest: string; url: string } = data
      await uploadFile(signedRequest, file)
      return url
    } catch (error) {
      console.log(error)
      toast({
        title: 'Error.',
        description: 'Error occured while uploading image!',
        status: 'error',
        duration: 3000,
        position: 'top',
      })
    }
  }

  return (
    <Box
      sx={{
        '.ProseMirror': {
          border: '1px solid',
          borderColor: 'gray.200',
          borderRadius: 'md',
          py: 2,
          pl: 7,
        },
      }}>
      <Editor
        readOnly={readOnly}
        {...(!!initValue && { defaultValue: initValue })}
        uploadImage={async (file: File) => {
          return signRequest(file)
        }}
        onChange={(oc) => {
          return setValue(oc())
        }}
      />
    </Box>
  )
}

export default MarkdownEditor
