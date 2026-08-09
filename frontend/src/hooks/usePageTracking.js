import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageView } from '../services/track.service'

const VISITOR_KEY = 'sy_visitor_id'

function getVisitorId() {
  let id = localStorage.getItem(VISITOR_KEY)
  if (!id) {
    id = `vis_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
    localStorage.setItem(VISITOR_KEY, id)
  }
  return id
}

export default function usePageTracking() {
  const location = useLocation()

  useEffect(() => {
    const path = location.pathname
    if (path.startsWith('/admin') || path.startsWith('/client') || path.startsWith('/login') || path.startsWith('/register')) {
      return
    }
    const visitorId = getVisitorId()
    trackPageView({
      path: path + location.search,
      sessionId: visitorId,
      referrer: document.referrer || '',
      pageTitle: document.title || '',
    })
  }, [location])
}
