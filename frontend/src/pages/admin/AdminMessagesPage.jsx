import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  MessageSquare,
  Search,
  Send,
  Loader2,
  MailOpen,
  Archive,
  Trash2,
  ArrowLeft,
  CheckCheck,
} from 'lucide-react'
import toast from 'react-hot-toast'
import Avatar from '../../components/ui/Avatar'
import Badge from '../../components/ui/Badge'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import useSocket from '../../hooks/useSocket'
import messageService from '../../services/message.service'
import serviceService from '../../services/service.service'

const statusVariant = {
  unread: 'warning',
  read: 'success',
  replied: 'info',
  archived: 'default',
}

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

function formatDate(dateStr) {
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
      senderName: 'Admin',
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

export default function AdminMessagesPage() {
  const { connect } = useSocket()
  const chatEndRef = useRef(null)

  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [services, setServices] = useState([])
  const [serviceFilter, setServiceFilter] = useState('')

  const [selectedId, setSelectedId] = useState(null)
  const [selectedDetail, setSelectedDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const [replyText, setReplyText] = useState('')
  const [sending, setSending] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [mobileShowChat, setMobileShowChat] = useState(false)

  const fetchMessages = useCallback(async () => {
    setLoading(true)
    try {
      const params = { limit: 50 }
      if (search) params.search = search
      if (statusFilter) params.status = statusFilter
      if (serviceFilter) params.service = serviceFilter
      const res = await messageService.list(params)
      setMessages(sortByCreatedAt(res?.data?.messages || []))
    } catch {
      toast.error('Failed to load messages')
    } finally {
      setLoading(false)
    }
  }, [search, statusFilter, serviceFilter])

  const fetchDetail = useCallback(async (id) => {
    setDetailLoading(true)
    try {
      const res = await messageService.get(id)
      setSelectedDetail(res?.data || null)
      if (res?.data?.status === 'unread') {
        await messageService.updateStatus(id, 'read')
      }
    } catch {
      toast.error('Failed to load message')
    } finally {
      setDetailLoading(false)
    }
  }, [])

  useEffect(() => { fetchMessages() }, [fetchMessages])

  useEffect(() => {
    serviceService.list({ limit: 100 }).then((res) => {
      setServices(res?.data?.services || [])
    }).catch(() => {})
  }, [])

  useEffect(() => {
    const socket = connect()
    if (!socket) return
    const onNewMessage = (data) => {
      if (data?.message) {
        setMessages(prev => mergeMessages(prev, [data.message]))
      } else {
        fetchMessages()
      }
    }
    const onClientReplied = (data) => {
      if (data?.message) {
        setMessages(prev => mergeMessages(prev, [data.message]))
        if (selectedId === data.message._id) {
          setSelectedDetail(data.message)
        }
      } else {
        fetchMessages()
        if (selectedId) fetchDetail(selectedId)
      }
    }
    const onMessageReplied = (data) => {
      if (data?.message) {
        setMessages(prev => mergeMessages(prev, [data.message]))
        if (selectedId === data.message._id) {
          setSelectedDetail(data.message)
        }
      } else {
        fetchMessages()
        if (selectedId) fetchDetail(selectedId)
      }
    }
    socket.on('newMessage', onNewMessage)
    socket.on('clientReplied', onClientReplied)
    socket.on('messageReplied', onMessageReplied)
    return () => {
      socket.off('newMessage', onNewMessage)
      socket.off('clientReplied', onClientReplied)
      socket.off('messageReplied', onMessageReplied)
    }
  }, [connect, fetchMessages, selectedId, fetchDetail])

  useEffect(() => {
    if (selectedId) {
      fetchDetail(selectedId)
      setMobileShowChat(true)
    }
  }, [selectedId, fetchDetail])

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selectedDetail, messages])

  const handleSelect = (msg) => {
    setSelectedId(msg._id)
  }

  const handleBack = () => {
    setMobileShowChat(false)
    setSelectedId(null)
    setSelectedDetail(null)
  }

  const handleSendReply = async () => {
    if (!selectedDetail || !replyText.trim()) return
    setSending(true)
    const sentText = replyText.trim()
    setReplyText('')
    try {
      const res = await messageService.reply(selectedDetail._id, sentText)
      toast.success('Reply sent')
      if (res?.data) {
        setSelectedDetail(res.data)
        setMessages(prev => mergeMessages(prev, [res.data]))
      }
      setSending(false)
      fetchDetail(selectedDetail._id)
      fetchMessages()
    } catch {
      toast.error('Failed to send reply')
      setSending(false)
    }
  }

  const handleMarkRead = async () => {
    if (!selectedDetail) return
    try {
      await messageService.updateStatus(selectedDetail._id, 'read')
      toast.success('Marked as read')
      await fetchDetail(selectedDetail._id)
      await fetchMessages()
    } catch {
      toast.error('Failed to update')
    }
  }

  const handleArchive = async () => {
    if (!selectedDetail) return
    try {
      await messageService.updateStatus(selectedDetail._id, 'archived')
      toast.success('Archived')
      setSelectedId(null)
      setSelectedDetail(null)
      setMobileShowChat(false)
      await fetchMessages()
    } catch {
      toast.error('Failed to archive')
    }
  }

  const handleDelete = async () => {
    if (!selectedDetail) return
    try {
      await messageService.remove(selectedDetail._id)
      toast.success('Deleted')
      setSelectedId(null)
      setSelectedDetail(null)
      setMobileShowChat(false)
      setShowDelete(false)
      await fetchMessages()
    } catch {
      toast.error('Failed to delete')
    }
  }

  const filtered = messages

  const unreadCount = messages.filter((m) => m.status === 'unread').length

  const messageFeed = useMemo(() => buildMessageFeed(selectedDetail), [selectedDetail])

  const renderChatBubble = (item) => {
    const isClient = item.sender === 'client'
    const justify = isClient ? 'justify-start' : 'justify-end'
    const bubbleColor = isClient
      ? 'border-white/10 bg-white/5'
      : 'border-primary/20 bg-primary/15'
    const bubbleRounded = item.isFirst && item.isLast
      ? 'rounded-btn'
      : item.isFirst
        ? 'rounded-t-btn rounded-b-[4px]'
        : item.isLast
          ? 'rounded-b-btn rounded-t-[4px]'
          : 'rounded-[4px]'
    const cornerSide = isClient ? 'rounded-tl-md' : 'rounded-tr-md'
    const firstCorner = item.isFirst ? cornerSide : ''
    const roundedClass = bubbleRounded + (firstCorner ? ` ${firstCorner}` : '')

    return (
      <div key={item.id} className={`flex ${justify}`}>
        <div className="max-w-[75%]">
          {item.isFirst && (
            <div className={`flex items-center gap-1.5 mb-1 ${isClient ? 'justify-start' : 'justify-end'}`}>
              {isClient && <Avatar name={item.senderName} size="sm" />}
              <span className={`text-xs font-medium ${isClient ? 'text-text-secondary' : 'text-primary'}`}>
                {item.senderName}
              </span>
              {!isClient && <CheckCheck className="h-3 w-3 text-primary" />}
            </div>
          )}
          <div className={`${roundedClass} border ${bubbleColor} px-4 py-2.5`}>
            <p className="text-sm leading-6 text-text-primary whitespace-pre-wrap">{item.text}</p>
          </div>
          {item.isLast && (
            <div className={`flex mt-0.5 ${isClient ? 'justify-start' : 'justify-end'}`}>
              <span className="text-[10px] text-text-muted">{formatDate(item.time)}</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-primary">Communications</p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">Messages</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-text-secondary">
              Chat portal for client conversations. Select a conversation to view and reply.
            </p>
          </div>
          {unreadCount > 0 && (
            <span className="inline-flex items-center gap-2 rounded-full border border-warning/20 bg-warning/10 px-4 py-2 text-sm font-semibold text-warning">
              <span className="h-2 w-2 rounded-full bg-warning animate-pulse" />
              {unreadCount} unread
            </span>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="overflow-hidden rounded-card border border-border bg-card-bg shadow-md"
      >
        <div className="flex h-[calc(100vh-220px)] min-h-[500px]">
          {/* Left Panel - Conversation List */}
          <div className={`w-full flex-shrink-0 border-r border-border md:w-[380px] ${mobileShowChat ? 'hidden md:flex' : 'flex'} flex-col`}>
            <div className="border-b border-border p-4">
              <div className="relative mb-3">
                <Search strokeWidth={1.75} className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
                <input
                  type="search"
                  placeholder="Search conversations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-12 w-full rounded-input border border-border bg-card-bg pl-11 pr-4 text-sm text-white placeholder:text-text-muted outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-9 flex-1 appearance-none rounded-btn border border-border bg-card-bg px-3 text-xs text-text-secondary outline-none transition focus:border-primary"
                >
                  <option value="">All Status</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                  <option value="archived">Archived</option>
                </select>
                <select
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value)}
                  className="h-9 flex-1 appearance-none rounded-btn border border-border bg-card-bg px-3 text-xs text-text-secondary outline-none transition focus:border-primary"
                >
                  <option value="">All Services</option>
                  {services.map((s) => (
                    <option key={s._id} value={s._id}>{s.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <MessageSquare strokeWidth={1.5} className="h-10 w-10 text-text-muted" />
                  <p className="mt-3 text-sm text-text-secondary">No conversations found</p>
                </div>
              ) : (
                filtered.map((msg) => (
                  <button
                    key={msg._id}
                    type="button"
                    onClick={() => handleSelect(msg)}
                    className={`flex w-full items-start gap-3 border-b border-border px-4 py-4 text-left transition hover:bg-white/5 ${
                      selectedId === msg._id ? 'bg-primary/10 border-l-2 border-l-primary' : ''
                    }`}
                  >
                    <Avatar name={msg.name} size="md" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`truncate text-sm ${msg.status === 'unread' ? 'font-bold text-white' : 'font-medium text-text-secondary'}`}>
                          {msg.name}
                        </p>
                        <span className="shrink-0 text-xs text-text-muted">{timeAgo(msg.createdAt)}</span>
                      </div>
                      <p className={`mt-0.5 truncate text-xs ${msg.status === 'unread' ? 'font-medium text-text-secondary' : 'text-text-muted'}`}>
                        {msg.subject}
                      </p>
                      <p className="mt-1 truncate text-xs text-text-muted">
                        {msg.message?.substring(0, 60)}...
                      </p>
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
          <div className={`flex flex-1 flex-col ${!mobileShowChat && !selectedId ? 'hidden md:flex' : mobileShowChat ? 'flex' : 'hidden md:flex'}`}>
            {selectedDetail ? (
              <>
                {/* Chat Header */}
                <div className="flex items-center gap-3 border-b border-border px-5 py-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="rounded-btn p-2 transition hover:bg-white/10 md:hidden"
                  >
                    <ArrowLeft className="h-5 w-5 text-text-muted" />
                  </button>
                  <Avatar name={selectedDetail.name} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-white">{selectedDetail.name}</p>
                    <p className="truncate text-xs text-text-secondary">{selectedDetail.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={statusVariant[selectedDetail.status] || 'default'}>
                      {selectedDetail.status?.charAt(0).toUpperCase() + selectedDetail.status?.slice(1)}
                    </Badge>
                    <button
                      onClick={handleMarkRead}
                      className="rounded-btn p-2 text-text-muted transition hover:bg-white/10 hover:text-white"
                      title="Mark as read"
                    >
                      <MailOpen className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleArchive}
                      className="rounded-btn p-2 text-text-muted transition hover:bg-white/10 hover:text-white"
                      title="Archive"
                    >
                      <Archive className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setShowDelete(true)}
                      className="rounded-btn p-2 text-text-muted transition hover:bg-danger/10 hover:text-danger"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Chat Thread */}
                <div className="flex-1 overflow-y-auto px-5 py-6">
                  {detailLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="max-w-full">
                      {/* Subject info */}
                      <div className="mx-auto max-w-md text-center mb-5">
                        <p className="text-sm font-semibold text-white">{selectedDetail.subject}</p>
                        <p className="mt-1 text-xs text-text-muted">
                          {formatDate(selectedDetail.createdAt)}
                          {selectedDetail.service?.title && <> · {selectedDetail.service.title}</>}
                        </p>
                      </div>

                      {/* Chronological message feed */}
                      <div className="space-y-0.5">
                        {messageFeed.map((item) =>
                          renderChatBubble(item)
                        )}
                      </div>

                      <div ref={chatEndRef} />
                    </div>
                  )}
                </div>

                {/* Input Bar */}
                <div className="border-t border-border px-5 py-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Type your reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendReply()}
                      className="flex-1 rounded-btn border border-border bg-card-bg px-5 py-3 text-sm text-white placeholder:text-text-muted outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
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
                <div className="flex h-16 w-16 items-center justify-center rounded-card bg-card-bg border border-border">
                  <MessageSquare strokeWidth={1.5} className="h-8 w-8 text-text-muted" />
                </div>
                <p className="mt-4 text-base font-medium text-text-secondary">Select a conversation</p>
                <p className="mt-1 text-sm text-text-muted">Choose from the left panel to start chatting</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Delete Message"
        message={`Are you sure you want to delete the message from "${selectedDetail?.name}"? This action cannot be undone.`}
        variant="danger"
      />
    </div>
  )
}