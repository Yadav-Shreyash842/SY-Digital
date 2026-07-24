import { apiClient } from './apiClient'

export async function sendChatMessage(messages) {
  try {
    const lastMessage = messages[messages.length - 1].content
    const history = messages.slice(0, -1)

    const { data } = await apiClient.post('/api/ai/chat', {
      message: lastMessage,
      history,
    })

    return data.data.reply
  } catch (err) {
    if (err.response?.data?.message) return err.response.data.message
    return "Sorry, something went wrong. Please try again or contact us directly."
  }
}
