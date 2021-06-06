import type { NextApiRequest, NextApiResponse } from 'next'
import Cors from 'cors'
import mailgun from 'mailgun-js'
import { promises as fs } from 'fs'
import path from 'path'

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

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await runMiddleware(req, res, cors)
  const { MAIL_GUN_API_KEY, MAIL_GUN_DOMAIN } = process.env
  const { to, studentID, nonce } = req.body
  const activationURL =
    process.env.NODE_ENV === 'production'
      ? `https://uet-cert-verification.netlify.app/student/activate?studentID=${studentID}&nonce=${nonce}`
      : `http://localhost:3000/student/activate?studentID=${studentID}&nonce=${nonce}`
  const emailTemplate = (
    await fs.readFile(path.join(process.cwd(), '/src/assets/email-template.txt'), 'utf-8')
  ).replace('{activation_url}', activationURL)

  const data = {
    from: 'Phòng đào tạo Đại học Công nghệ <academic-affairs@uet-cert-verification.hughdo.dev>',
    to,
    subject: 'Kích hoạt tài khoản!',
    html: emailTemplate,
  }

  console.log('Sending mail to', to)

  const mg = mailgun({
    apiKey: MAIL_GUN_API_KEY,
    domain: MAIL_GUN_DOMAIN,
  })

  mg.messages().send(data, (error, body) => {
    if (error) {
      res.status(400).json({ error: error.message })
      return
    }

    res.status(201).json({ message: 'Mail sent' })
  })
}

export const config = {
  api: {
    externalResolver: true,
  },
}

export default handler
