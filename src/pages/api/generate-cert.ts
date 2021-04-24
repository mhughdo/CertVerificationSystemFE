/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable global-require */
import chromium from 'chrome-aws-lambda'
import aws from 'aws-sdk'
import Cors from 'cors'
import puppeteer from 'puppeteer-core'
import type { NextApiRequest, NextApiResponse } from 'next'

const cors = Cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
})

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

async function getBrowserInstance() {
  const executablePath = await chromium.executablePath

  // Mac OS
  const execPath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

  if (!executablePath) {
    // running locally
    return puppeteer.launch({
      args: chromium.args,
      headless: true,
      defaultViewport: {
        width: 1750,
        height: 989,
      },
      executablePath: execPath,
      ignoreHTTPSErrors: true,
    })
  }

  return chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: {
      width: 1750,
      height: 989,
    },
    executablePath,
    headless: chromium.headless,
    ignoreHTTPSErrors: true,
  })
}

const region = 'ap-southeast-1'
aws.config.region = region

const { S3_BUCKET, accessKeyId, AWSSecretKey } = process.env
const S3 = new aws.S3({
  accessKeyId,
  secretAccessKey: AWSSecretKey,
})

const waiit = (timeout): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, timeout)
  })
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res, cors)

  if (req.method === 'POST') {
    const { major, grade, name, studentID, dob } = req.body

    if (!major || !grade || !name || !studentID || !dob) {
      res.status(400).json({ error: 'Missing params!' })
      return
    }
    const params = `major=${major}&grade=${grade}&name=${name}&dob=${dob}`
    const URL =
      process.env.NODE_ENV === 'production'
        ? `https://uet-cert-verification.netlify.app/certificate/generate?${params}`
        : `http://host.docker.internal:3001/certificate/generate?${params}`

    let browser = null

    try {
      browser = await puppeteer.connect({ browserWSEndpoint: 'ws://localhost:8080' })
      const page = await browser.newPage()
      await page.setViewport({
        width: 1750,
        height: 989,
        deviceScaleFactor: 1,
      })
      await page.goto(URL, { waitUntil: 'networkidle2' })
      await waiit(1000)

      const imageBuffer = await page.screenshot()

      const fileName = `grad_cert_${studentID}.jpg`

      const params = {
        Bucket: S3_BUCKET,
        Key: fileName,
        Body: imageBuffer,
        ContentType: 'image/jpeg',
        ACL: 'public-read',
      }

      S3.upload(params, (error, data) => {
        if (error) {
          return res.status(400).json({
            status: 'error',
            error: error.message || 'Something went wrong',
          })
        }

        const params = {
          Bucket: S3_BUCKET,
          Key: fileName,
        }

        const signedRequest = S3.getSignedUrl('putObject', params)

        res.status(201).json({
          signedRequest,
          url: `https://${S3_BUCKET}.s3-${region}.amazonaws.com/${fileName}`,
        })
      })

      // upload this buffer on AWS S3
    } catch (error) {
      console.log(error)
      res.status(400).json({
        status: 'error',
        data: error.message || 'Something went wrong',
      })
      // return callback(error);
    } finally {
      if (browser !== null) {
        await browser.disconnect()
      }
    }
  }
}

export const config = {
  api: {
    externalResolver: true,
  },
}

export default handler
