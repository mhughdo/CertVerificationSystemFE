import aws from 'aws-sdk'
import type { NextApiRequest, NextApiResponse } from 'next'

import Cors from 'cors'

const region = 'ap-southeast-1'
aws.config.region = region

// Initializing the cors middleware
const cors = Cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: (...args: any[]) => any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }

      return resolve(result)
    })
  })
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res, cors)
  if (req.method === 'GET') {
    const { S3_BUCKET, accessKeyId, AWSSecretKey } = process.env
    console.log({ S3_BUCKET, accessKeyId, AWSSecretKey })
    const s3 = new aws.S3({
      accessKeyId,
      secretAccessKey: AWSSecretKey,
    })

    const fileName = `${req.query['file-name']}-${Date.now()}}`
    const fileType = req.query['file-type']
    const s3Params = {
      Bucket: S3_BUCKET,
      Key: fileName,
      ContentType: fileType,
      ACL: 'public-read',
    }
    s3.getSignedUrl('putObject', s3Params, (err, data) => {
      if (err) {
        console.log(err)
        res.status(400).json({ signedRequest: null, url: null })
      }
      const returnData = {
        signedRequest: data,
        url: `https://${S3_BUCKET}.s3-${region}.amazonaws.com/${fileName}`,
      }
      res.status(201).json(returnData)
    })
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
}

export default handler
