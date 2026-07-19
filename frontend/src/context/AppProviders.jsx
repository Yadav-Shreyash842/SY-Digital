import React from 'react'
import { AuthProvider } from './AuthContext'
import { ThemeProvider } from './ThemeContext'
import { SocketProvider } from './SocketContext'
import ToastProvider from '../components/common/ToastProvider'

export default function AppProviders({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SocketProvider>
          <ToastProvider>{children}</ToastProvider>
        </SocketProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}
