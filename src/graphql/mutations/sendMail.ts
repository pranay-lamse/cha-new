export const SEND_MAIL = `
mutation SendMail($subject: String, $body: String) {
  sendEmail(
    input: {subject: $subject, body: $body}
  ) {
    origin
    sent
    message
  }
}`;