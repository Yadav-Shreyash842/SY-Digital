import messageService from './message.service'

export const sendContactMessage = async (formData) => {
  const payload = {
    name: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
    email: formData.email,
    subject: formData.subject || `Contact request: ${formData.service || 'General Inquiry'}`,
    message: formData.message,
    service: formData.service !== 'other' ? formData.service : undefined,
  }

  return messageService.send(payload)
}
