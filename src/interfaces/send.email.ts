export interface SendEmail {
  sendEmail: Response
}


export interface Response {
  origin: string
  sent: boolean
  message: string
}
