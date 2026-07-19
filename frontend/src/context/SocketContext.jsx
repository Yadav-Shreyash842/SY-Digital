import React, { createContext, useRef } from 'react'

const SocketContext = createContext(null)

export function SocketProvider({ children }) {
  // Socket connection will be created when integrating; keep a ref for future use
  const socketRef = useRef(null)

  const connect = () => {
    // placeholder: will initialize socket on integration
  }

  const disconnect = () => {
    // placeholder
  }

  return (
    <SocketContext.Provider value={{ socketRef, connect, disconnect }}>
      {children}
    </SocketContext.Provider>
  )
}

export default SocketContext
