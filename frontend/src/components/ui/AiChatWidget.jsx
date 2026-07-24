import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { sendChatMessage } from '../../services/aiChat.service'
import { useOpenProjectForm } from '../../context/ProjectFormContext'

const suggestedQuestions = [
  'What services does SY Digital offer?',
  'Tell me about your pricing',
  'Show me your portfolio',
  'How do I get started?',
  'Book a meeting',
]

export default function AiChatWidget() {
  const onOpenProjectForm = useOpenProjectForm()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! I'm SY Digital AI. How can I help you scale your business today?" },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSend = async (text) => {
    const msg = text || input.trim()
    if (!msg || loading) return

    setMessages((prev) => [...prev, { role: 'user', content: msg }])
    setInput('')
    setLoading(true)

    try {
      const chatHistory = [...messages, { role: 'user', content: msg }]
      const reply = await sendChatMessage(chatHistory)
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting. Please try again." }])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const renderMessage = (msg, i) => {
    if (msg.role === 'user') {
      return (
        <div
          key={i}
          className="self-end max-w-[85%] rounded-2xl rounded-br-sm bg-gradient-to-r from-accent-purple to-accent-orange px-4 py-3 text-sm leading-relaxed text-white"
        >
          {msg.content}
        </div>
      )
    }

    const hasActionableContent = msg.content.toLowerCase().includes('start your project') ||
      msg.content.toLowerCase().includes('book a meeting') ||
      msg.content.toLowerCase().includes('view portfolio') ||
      msg.content.toLowerCase().includes('view pricing')

    return (
      <div key={i} className="self-start max-w-[85%]">
        <div className="rounded-2xl rounded-bl-sm bg-[#1E293B] px-4 py-3 text-sm leading-relaxed text-text-secondary">
          {msg.content}
        </div>
        {(hasActionableContent || msg.content.includes('pricing') || msg.content.includes('portfolio') || msg.content.includes('project') || msg.content.includes('meeting') || msg.content.includes('book')) && (
          <div className="mt-2 flex flex-wrap gap-2">
            {msg.content.toLowerCase().includes('project') && (
              <button
                type="button"
                onClick={onOpenProjectForm}
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-accent-purple to-accent-orange px-4 py-1.5 text-xs font-semibold text-white shadow-[0_4px_12px_rgba(139,92,246,0.3)] transition-all hover:scale-105"
              >
                Start Your Project
              </button>
            )}
            {msg.content.toLowerCase().includes('meeting') && (
              <Link
                to="/schedule-meeting"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/[0.06] px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-xl transition-all hover:bg-white/[0.1] hover:scale-105"
              >
                Book a Meeting
              </Link>
            )}
            {msg.content.toLowerCase().includes('portfolio') && (
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/[0.06] px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-xl transition-all hover:bg-white/[0.1] hover:scale-105"
              >
                View Portfolio
              </Link>
            )}
            {msg.content.toLowerCase().includes('pricing') && (
              <Link
                to="/pricing"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/[0.06] px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-xl transition-all hover:bg-white/[0.1] hover:scale-105"
              >
                View Pricing
              </Link>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-8 right-8 z-[1000] flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-accent-purple to-accent-orange p-[3px] text-white shadow-[0_10px_30px_rgba(139,92,246,0.4),0_0_20px_rgba(249,115,22,0.3)] sm:h-16 sm:w-16"
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.95 }}
        animate={isOpen ? {} : { boxShadow: [
          '0_10px_30px_rgba(139,92,246,0.4),0_0_20px_rgba(249,115,22,0.3)',
          '0_10px_40px_rgba(139,92,246,0.6),0_0_30px_rgba(249,115,22,0.5)',
          '0_10px_30px_rgba(139,92,246,0.4),0_0_20px_rgba(249,115,22,0.3)',
        ] }}
        transition={isOpen ? {} : { duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="flex h-full w-full items-center justify-center rounded-full bg-[#080A14]">
          {isOpen ? <X strokeWidth={2} className="h-5 w-5 sm:h-6 sm:w-6" /> : <MessageCircle strokeWidth={2} className="h-5 w-5 sm:h-6 sm:w-6" />}
        </span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-28 right-4 z-[1000] flex w-[380px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-[22px] border border-accent-purple/30 bg-[#080A14] shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_32px_rgba(139,92,246,0.3),0_0_24px_rgba(249,115,22,0.15)] backdrop-blur-[20px] sm:right-8"
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] bg-[radial-gradient(circle_at_0%_0%,rgba(139,92,246,0.18),transparent_35%),rgba(8,10,20,0.9)] px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-accent-purple to-accent-orange">
                  <Bot strokeWidth={2} className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold">SY Digital AI</p>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                    <span className="text-[11px] text-text-muted">Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:text-white"
                aria-label="Close chat"
              >
                <X strokeWidth={1.75} className="h-4 w-4" />
              </button>
            </div>

            <div className="flex h-[360px] flex-col gap-3.5 overflow-y-auto p-4">
              {messages.map((msg, i) => renderMessage(msg, i))}

              {loading && (
                <div className="self-start max-w-[85%] rounded-2xl rounded-bl-sm bg-[#1E293B] px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin text-accent-purple" />
                </div>
              )}

              <div ref={messagesEndRef} />

              {messages.length === 1 && !loading && (
                <div className="mt-2 flex flex-col gap-2">
                  <p className="text-[11px] text-text-muted">Suggested Questions</p>
                  {suggestedQuestions.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => handleSend(q)}
                      className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.045] px-3.5 py-2.5 text-left text-[13px] text-text-secondary transition-all duration-200 hover:border-accent-purple/40 hover:bg-accent-purple/10 hover:text-white"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2.5 border-t border-white/[0.08] bg-[#070914] px-4 py-3.5">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                disabled={loading}
                className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-text-muted disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-accent-purple to-accent-orange text-white transition-all duration-200 hover:shadow-[0_4px_14px_rgba(139,92,246,0.35)] disabled:opacity-50"
              >
                <Send strokeWidth={1.75} className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
