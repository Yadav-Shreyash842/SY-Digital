import { createContext, useRef, useCallback } from 'react'
import { io } from 'socket.io-client'
import { SOCKET_URL } from '../services/apiClient'

const SocketContext = createContext(null)

export function SocketProvider({ children }) {
  const socketRef = useRef(null)

  const connect = useCallback(() => {
    if (socketRef.current?.connected) return socketRef.current

    const token = localStorage.getItem('sy_digital_token')
    if (!token) return null

    const socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    })

    socket.on('connect', () => {
      console.log('[Socket] Connected:', socket.id)
    })

    socket.on('disconnect', (reason) => {
      console.log('[Socket] Disconnected:', reason)
    })

    socket.on('connect_error', (err) => {
      console.warn('[Socket] Connection error:', err.message)
    })

    socketRef.current = socket
    return socket
  }, [])

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
    }
  }, [])

  return (
    <SocketContext.Provider value={{ socketRef, connect, disconnect }}>
      {children}
    </SocketContext.Provider>
  )
}

export default SocketContext
