import { createTransport } from 'nodemailer'
import { logger } from '../logger/logger'

export function initEmailSettings(currSettings: unknown) {
  if (currSettings === undefined) return true
  else return currSettings
}

const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: import.meta.env.MAIN_VITE_EMAIL_USER,
    pass: import.meta.env.MAIN_VITE_EMAIL_PASSWORD
  }
})

export interface MailOptions {
  from?: string
  to?: string
  subject: string
  text: string
}

export function sendEmail(mailOptions: MailOptions) {
  mailOptions.from = import.meta.env.MAIN_VITE_EMAIL_USER
  mailOptions.to = import.meta.env.MAIN_VITE_EMAIL_TARGET

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) logger.log('error', error)
    else logger.log('info', 'Email sent: ' + info.response)
  })
}
