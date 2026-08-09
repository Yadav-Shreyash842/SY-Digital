import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useLocation, useNavigate } from 'react-router-dom'
import useSocket from '../../../hooks/useSocket'

export default function LiveToasts() {
  const { connect } = useSocket()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const socket = connect()
    if (!socket) return

    const onNewMessage = (data) => {
      const m = data?.message
      if (!m) return
      toast(
        `New contact message from ${m.name}${m.email ? ` (${m.email})` : ''}:\n"${m.subject}"`,
        {
          duration: 6000,
          icon: '✉️',
          onClick: () => navigate('/admin/messages'),
        }
      )
    }

    const onNewProjectRequest = (data) => {
      const r = data?.request
      if (!r) return
      toast(
        `New project request from ${r.clientName} (${r.clientEmail}): "${r.title}"`,
        {
          duration: 6000,
          icon: '📋',
          onClick: () => navigate('/admin/project-requests'),
        }
      )
    }

    const onNewMeeting = (data) => {
      const m = data?.meeting || data?.meetingData?.meeting
      if (!m) return
      toast(
        `New meeting booked by ${m.name}`,
        {
          duration: 6000,
          icon: '📅',
          onClick: () => navigate('/admin/meetings'),
        }
      )
    }

    const onNewReview = () => {
      toast('A new review was submitted.', {
        duration: 6000,
        icon: '⭐',
        onClick: () => navigate('/admin/reviews'),
      })
    }

    socket.on('newMessage', onNewMessage)
    socket.on('newProjectRequest', onNewProjectRequest)
    socket.on('newMeeting', onNewMeeting)
    socket.on('reviewSubmitted', onNewReview)

    return () => {
      socket.off('newMessage', onNewMessage)
      socket.off('newProjectRequest', onNewProjectRequest)
      socket.off('newMeeting', onNewMeeting)
      socket.off('reviewSubmitted', onNewReview)
    }
  }, [connect, navigate, location.pathname])

  return null
}