import { createContext, useRef, useState, useCallback } from 'react'
import { io } from 'socket.io-client'
import { SOCKET_URL } from '../services/apiClient'

const SocketContext = createContext(null)

export function SocketProvider({ children }) {
  const socketRef = useRef(null)
  const [connected, setConnected] = useState(false)
  const [connecting, setConnecting] = useState(false)

  const connect = useCallback(() => {
    if (socketRef.current) return socketRef.current

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
      setConnected(true)
      setConnecting(false)
    })

    socket.on('disconnect', () => {
      setConnected(false)
    })

    socket.on('connect_error', (err) => {
      setConnected(false)
      console.warn('[Socket] Connection error:', err.message)
    })

    socketRef.current = socket
    setConnecting(true)
    return socket
  }, [])

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect()
      socketRef.current = null
      setConnected(false)
      setConnecting(false)
    }
  }, [])

  return (
    <SocketContext.Provider value={{ socketRef, connect, disconnect, connected, connecting }}>
      {children}
    </SocketContext.Provider>
  )
}

export default SocketContext
