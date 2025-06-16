import React, { createContext, useContext, useState, useCallback } from 'react'
import ToastNotify from './index'

type ToastType = 'success' | 'error'

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{
    message: string
    type: ToastType
    visible: boolean
    key: number
  }>({
    message: '',
    type: 'success',
    visible: false,
    key: 0,
  })

  const showToast = useCallback((message: string, type: ToastType) => {
    setToast((prev) => ({
      message,
      type,
      visible: true,
      key: prev.key + 1,
    }))
  }, [])

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, visible: false }))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast.visible && (
        <ToastNotify
          key={toast.key}
          message={toast.message}
          type={toast.type}
          onClose={hideToast}
        />
      )}
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
