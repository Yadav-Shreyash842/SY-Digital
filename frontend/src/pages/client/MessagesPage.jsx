import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  MessageSquare,
  Sparkles,
  Send,
  Search,
  Loader2,
  PenSquare,
  X,
  CheckCheck,
} from 'lucide-react'
import useAuth from '../../hooks/useAuth'
import useSocket from '../../hooks/useSocket'
import Avatar from '../../components/ui/Avatar'
import clientService from '../../services/client.service'
import { serviceService } from '../../services/service.service'
import toast from 'react-hot-toast'

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'now'
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  const days = Math.floor(hrs / 24)
  return `${days}d`
}

function formatFullDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function sortByCreatedAt(arr) {
  return [...arr].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
}

function mergeMessages(existing, incoming) {
  const map = new Map()
  existing.forEach(m => map.set(m._id, m))
  incoming.forEach(m => map.set(m._id, m))
  return sortByCreatedAt(Array.from(map.values()))
}

function buildMessageFeed(msg) {
  if (!msg) return []
  const feed = []

  feed.push({
    id: msg._id + '_orig',
    text: msg.message,
    time: msg.createdAt,
    sender: 'client',
    senderName: msg.name,
  })

  const replies = (msg.clientReplies || []).map((r, i) => ({
    id: msg._id + '_reply_' + i + (r._id || ''),
    text: r.text,
    time: r.createdAt || msg.createdAt,
    sender: 'client',
    senderName: msg.name,
  }))

  replies.forEach(r => feed.push(r))

  if (msg.adminReply) {
    feed.push({
      id: msg._id + '_admin',
      text: msg.adminReply,
      time: msg.repliedAt || msg.updatedAt || msg.createdAt,
      sender: 'admin',
      senderName: 'Team',
    })
  }

  feed.sort((a, b) => new Date(a.time) - new Date(b.time))

  return feed.map((item, i) => {
    const prev = feed[i - 1]
    const next = feed[i + 1]
    return {
      ...item,
      isFirst: !prev || prev.sender !== item.sender,
      isLast: !next || next.sender !== item.sender,
    }
  })
}

export default function MessagesPage() {
  const { user } = useAuth()
  const { connect } = useSocket()
  const chatEndRef = useRef(null)
  const fullName = user ? `${user.firstName} ${user.lastName}` : ''

  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [replyText, setReplyText] = useState('')
  const [sending, setSending] = useState(false)
  const [mobileShowChat, setMobileShowChat] = useState(false)

  const [showCompose, setShowCompose] = useState(false)
  const [composeSubject, setComposeSubject] = useState('')
  const [composeMessage, setComposeMessage] = useState('')
  const [composeService, setComposeService] = useState('')
  const [composeSending, setComposeSending] = useState(false)
  const [serviceOptions, setServiceOptions] = useState([])

  const fetchClientMessages = useCallback(async () => {
    const res = await clientService.messages()
    const data = res?.data || []
    setMessages(sortByCreatedAt(data))
  }, [])

  useEffect(() => {
    const fetchAll = async () => {
      try {
        await fetchClientMessages()
        const svcRes = await serviceService.list({ status: 'published' })
        const svcs = svcRes?.data?.services || svcRes?.data || []
        setServiceOptions(svcs.map((s) => ({ value: s._id, label: s.title })))
      } catch {
        toast.error('Failed to load messages')
      } finally {
        setLoading(false)
      }
    }

    if (user) fetchAll()
  }, [user, fetchClientMessages])

  useEffect(() => {
    const socket = connect()
    if (!socket) return
    const handleUpdate = (data) => {
      if (data?.message) {
        setMessages(prev => mergeMessages(prev, [data.message]))
      } else {
        fetchClientMessages()
      }
    }
    socket.on('messageReplied', handleUpdate)
    return () => { socket.off('messageReplied', handleUpdate) }
  }, [connect, fetchClientMessages])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, selectedId])

  const handleSendCompose = async () => {
    if (!composeSubject.trim() || !composeMessage.trim()) return
    setComposeSending(true)
    try {
      await clientService.sendMessage({
        subject: composeSubject.trim(),
        message: composeMessage.trim(),
        service: composeService || undefined,
      })
      toast.success('Message sent successfully')
      setShowCompose(false)
      setComposeSubject('')
      setComposeMessage('')
      setComposeService('')
      await fetchClientMessages()
    } catch {
      toast.error('Failed to send message')
    } finally {
      setComposeSending(false)
    }
  }

  const filtered = useMemo(
    () =>
      messages.filter(
        (m) =>
          m.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          m.name?.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [messages, searchTerm]
  )

  const selected = messages.find((m) => m._id === selectedId)
  const unreadCount = messages.filter((m) => m.status === 'unread').length

  const handleSendReply = async () => {
    if (!selected || !replyText.trim()) return
    setSending(true)
    const sentText = replyText.trim()
    setReplyText('')
    try {
      const res = await clientService.replyToMessage(selected._id, sentText)
      toast.success('Reply sent successfully')
      if (res?.data) {
        setMessages(prev => mergeMessages(prev, [res.data]))
      }
      await fetchClientMessages()
    } catch {
      toast.error('Failed to send reply')
    } finally {
      setSending(false)
    }
  }

  const handleSelect = (msg) => {
    setSelectedId(msg._id)
    setMobileShowChat(true)
  }

  const handleBack = () => {
    setMobileShowChat(false)
    setSelectedId(null)
  }

  const messageFeed = useMemo(() => buildMessageFeed(selected), [selected])

  const renderChatBubble = (item, company, budget) => {
    const isClient = item.sender === 'client'
    const justify = isClient ? 'justify-end' : 'justify-start'
    const bubbleColor = isClient
      ? 'border-primary/20 bg-primary/15'
      : 'border-accent-blue/20 bg-accent-blue/10'
    const bubbleRounded = item.isFirst && item.isLast
      ? 'rounded-input'
      : item.isFirst
        ? 'rounded-t-2xl rounded-b-[4px]'
        : item.isLast
          ? 'rounded-b-2xl rounded-t-[4px]'
          : 'rounded-[4px]'
    const cornerSide = isClient ? 'rounded-tr-md' : 'rounded-tl-md'

    const firstCorner = item.isFirst ? cornerSide : ''
    const roundedClass = bubbleRounded + (firstCorner ? ` ${firstCorner}` : '')

    return (
      <div key={item.id} className={`flex ${justify} ${item.isLast ? 'mb-0' : 'mb-0'}`}>
        <div className="max-w-[75%]">
          {item.isFirst && (
            <div className={`flex items-center gap-1.5 ${isClient ? 'justify-end' : 'justify-start'} mb-1`}>
              {!isClient && <Avatar name={item.senderName} size="sm" />}
              <span className={`text-xs font-medium ${isClient ? 'text-primary' : 'text-accent-blue'}`}>
                {isClient ? 'You' : item.senderName}
              </span>
              {isClient && <CheckCheck className="h-3 w-3 text-primary" />}
            </div>
          )}
          <div className={`${roundedClass} border ${bubbleColor} px-4 py-2.5`}>
            <p className="text-sm leading-6 text-slate-200 whitespace-pre-wrap">{item.text}</p>
          </div>
          {item.isLast && budget && isClient && item.id === selected._id + '_orig' && (
            <div className="mt-2 flex flex-wrap justify-end gap-2">
              {company && (
                <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-text-muted">{company}</span>
              )}
              {budget > 0 && (
                <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-text-muted">INR {budget.toLocaleString()}</span>
              )}
            </div>
          )}
          {item.isLast && (
            <div className={`flex ${isClient ? 'justify-end' : 'justify-start'} mt-0.5`}>
              <span className="text-[10px] text-text-muted">{formatFullDate(item.time)}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        className="glass-card rounded-4xl border border-white/10 p-8 shadow-[0_30px_80px_rgba(0,0,0,0.24)]"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-slate-300">
              <Sparkles className="h-4 w-4 text-primary" strokeWidth={1.75} />
              Messages
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Your conversations
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-8 text-text-muted">
              Stay connected with the team. Reply to messages, track updates, and keep every conversation in one place.
            </p>
          </div>
          {unreadCount > 0 && (
            <span className="inline-flex items-center gap-2 rounded-full border border-warning/20 bg-warning/10 px-4 py-2 text-sm font-semibold text-warning">
              <span className="h-2 w-2 rounded-full bg-warning animate-pulse" />
              {unreadCount} unread
            </span>
          )}
        </div>
      </motion.section>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="overflow-hidden rounded-[28px] border border-border bg-card-bg shadow-[0_30px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl"
      >
        <div className="flex h-[calc(100vh-280px)] min-h-[500px]">
          {/* Left Panel - Conversation List */}
          <div className={`w-full flex-shrink-0 border-r border-white/10 md:w-[360px] ${mobileShowChat ? 'hidden md:flex' : 'flex'} flex-col`}>
            <div className="border-b border-white/10 p-4">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 text-slate-300">
                  <MessageSquare strokeWidth={1.75} className="h-5 w-5 text-primary" />
                  <h2 className="text-sm font-semibold">Inbox</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCompose(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-white transition hover:brightness-110"
                >
                  <PenSquare strokeWidth={1.75} className="h-3.5 w-3.5" />
                  New
                </button>
              </div>
              <div className="relative">
                <Search strokeWidth={1.75} className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input
                  type="search"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-11 w-full rounded-input border border-border bg-card-bg pl-11 pr-4 text-sm text-white placeholder:text-text-muted outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <MessageSquare strokeWidth={1.5} className="h-10 w-10 text-slate-600" />
                  <p className="mt-3 text-sm text-text-muted">No messages found</p>
                </div>
              ) : (
                filtered.map((msg) => (
                  <button
                    key={msg._id}
                    type="button"
                    onClick={() => handleSelect(msg)}
                    className={`flex w-full items-start gap-3 border-b border-white/5 px-4 py-4 text-left transition hover:bg-white/5 ${
                      selectedId === msg._id ? 'bg-primary/10 border-l-2 border-l-primary' : ''
                    }`}
                  >
                    <Avatar name={fullName || user?.email} size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`truncate text-sm ${msg.status === 'unread' ? 'font-bold text-white' : 'font-medium text-slate-200'}`}>
                          {msg.subject || 'No subject'}
                        </p>
                        <span className="shrink-0 text-xs text-text-muted">{timeAgo(msg.createdAt)}</span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-text-muted">{msg.service?.title || 'General'}</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        {msg.adminReply ? (
                          <CheckCheck className="h-3 w-3 shrink-0 text-success" />
                        ) : null}
                        <p className="truncate text-xs text-text-muted">
                          {msg.adminReply || msg.message?.substring(0, 50) || 'No preview'}
                        </p>
                      </div>
                    </div>
                    {msg.status === 'unread' && (
                      <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right Panel - Chat View */}
          <div className={`flex flex-1 flex-col ${!mobileShowChat && !selected ? 'hidden md:flex' : mobileShowChat ? 'flex' : 'hidden md:flex'}`}>
            {selected ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="rounded-xl p-2 transition hover:bg-white/10 md:hidden"
                  >
                    <span className="text-text-muted">&#8592;</span>
                  </button>
                  <Avatar name={fullName || user?.email} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-white">{selected.subject}</p>
                    <p className="truncate text-xs text-text-muted">{selected.service?.title || 'General'}</p>
                  </div>
                  <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
                    selected.status === 'unread' ? 'border-warning/20 bg-warning/10 text-warning' :
                    selected.status === 'replied' ? 'border-success/20 bg-success/10 text-success' :
                    'border-white/10 bg-white/10 text-slate-300'
                  }`}>
                    {selected.status}
                  </span>
                </div>

                {/* Chat Thread */}
                <div className="flex-1 overflow-y-auto px-5 py-6">
                  <div className="max-w-full">
                    {/* Subject header */}
                    <div className="mx-auto max-w-md text-center mb-5">
                      <p className="text-sm font-semibold text-white">{selected.subject}</p>
                      <p className="mt-1 text-xs text-text-muted">
                        {formatFullDate(selected.createdAt)}
                        {selected.service?.title && <> · {selected.service.title}</>}
                      </p>
                    </div>

                    {/* Chronological message feed */}
                    <div className="space-y-0.5">
                      {messageFeed.map((item) =>
                        renderChatBubble(item, selected.company, selected.budget)
                      )}
                    </div>

                    <div ref={chatEndRef} />
                  </div>
                </div>

                {/* Input Bar */}
                <div className="border-t border-white/10 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Type your reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendReply()}
                      className="flex-1 rounded-full border border-border bg-card-bg px-5 py-3 text-sm text-white placeholder:text-text-muted outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                    <button
                      type="button"
                      onClick={handleSendReply}
                      disabled={sending || !replyText.trim()}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-white transition hover:brightness-110 disabled:opacity-50"
                    >
                      {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send strokeWidth={1.75} className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/5">
                  <MessageSquare strokeWidth={1.5} className="h-8 w-8 text-slate-600" />
                </div>
                <p className="mt-4 text-base font-medium text-text-muted">Select a conversation</p>
                <p className="mt-1 text-sm text-text-muted">Choose from the left panel to view details</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg rounded-[28px] border border-white/10 bg-slate-900 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <PenSquare strokeWidth={1.75} className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-white">New Message</h3>
              </div>
              <button type="button" onClick={() => setShowCompose(false)} className="rounded-lg p-2 transition hover:bg-white/10">
                <X strokeWidth={1.75} className="h-5 w-5 text-text-muted" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Subject</label>
                <input
                  type="text"
                  placeholder="What is this about?"
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  className="h-12 w-full rounded-input border border-border bg-card-bg px-4 text-sm text-white placeholder:text-text-muted outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Service (optional)</label>
                <select
                  value={composeService}
                  onChange={(e) => setComposeService(e.target.value)}
                  className="h-12 w-full appearance-none rounded-input border border-border bg-card-bg px-4 text-sm text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select a service</option>
                  {serviceOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-300">Message</label>
                <textarea
                  placeholder="Write your message..."
                  value={composeMessage}
                  onChange={(e) => setComposeMessage(e.target.value)}
                  rows={5}
                  className="w-full rounded-input border border-border bg-card-bg px-4 py-3 text-sm text-white placeholder:text-text-muted outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSendCompose}
                  disabled={composeSending || !composeSubject.trim() || !composeMessage.trim()}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
                >
                  {composeSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send strokeWidth={1.75} className="h-4 w-4" />}
                  Send Message
                </button>
                <button
                  type="button"
                  onClick={() => setShowCompose(false)}
                  className="rounded-full border border-border bg-card-bg px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
