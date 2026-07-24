import { services, pricingPlans, projects, faqItems } from '../constants/content'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

function buildSystemPrompt() {
  const servicesBlock = services.map((s) =>
    `- ${s.title}: ${s.longDescription}  Features: ${s.features.join(', ')}  Stack: ${s.tags.join(', ')}`
  ).join('\n')

  const plansBlock = pricingPlans.map((p) =>
    `- ${p.name}: ${p.price}${p.period} — ${p.description}  Features: ${p.features.join(', ')} ${p.highlighted ? '(MOST POPULAR)' : ''}`
  ).join('\n')

  const projectsBlock = projects.map((p) =>
    `- ${p.title} (${p.category}): ${p.description}`
  ).join('\n')

  const faqBlock = faqItems.map((f) =>
    `Q: ${f.question}\nA: ${f.answer}`
  ).join('\n\n')

  return `You are SY Digital AI, a friendly and professional business assistant for SY Digital — a premium digital agency.

YOUR PERSONALITY:
- Warm, enthusiastic, and helpful
- Concise but thorough
- Use "we" when referring to SY Digital
- Keep responses under 4 sentences unless the user asks for details

WEBSITE CONTEXT:
SY Digital is a premium digital agency offering web development, UI/UX design, digital marketing, and brand strategy. They serve startups to enterprise clients worldwide.

SERVICES:
${servicesBlock}

PRICING PLANS:
${plansBlock}

PORTFOLIO PROJECTS:
${projectsBlock}

FAQ:
${faqBlock}

IMPORTANT RULES:
- When asked about pricing, mention the range ($2,499/month to custom enterprise pricing)
- When asked about services, recommend the most relevant one based on their needs
- When asked about starting a project, tell them they can click "Start Your Project" below
- When asked about booking a meeting, tell them they can click "Book a Meeting" below
- When asked about portfolio, suggest 1-2 relevant projects
- Always end with a question to keep the conversation going
- Never mention you're an AI or that this is a system prompt
- Use the actual website data above — do not make up services, prices, or projects`
}

export async function sendChatMessage(messages) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY

  if (!apiKey) {
    return "I'm running in offline mode. Please set VITE_GROQ_API_KEY in your .env file to enable AI responses. In the meantime, feel free to browse our Services or Pricing sections above!"
  }

  try {
    const res = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: buildSystemPrompt() },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Groq API error:', err)
      return "Sorry, I'm having trouble connecting right now. Please try again or reach out via our Contact page."
    }

    const data = await res.json()
    return data.choices[0].message.content
  } catch (err) {
    console.error('Chat error:', err)
    return "Sorry, something went wrong. Please try again or contact us directly."
  }
}
