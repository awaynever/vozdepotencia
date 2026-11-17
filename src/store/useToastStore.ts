import { create } from 'zustand'

export interface Toast {
  id: number
  message: string
  tone?: 'default' | 'success' | 'error'
}

interface ToastState {
  toasts: Toast[]
  show: (message: string, tone?: Toast['tone']) => void
  dismiss: (id: number) => void
}

let counter = 0

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  show: (message, tone = 'default') => {
    counter += 1
    const id = counter
    set({ toasts: [...get().toasts, { id, message, tone }] })
    setTimeout(() => get().dismiss(id), 3200)
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}))

export const toast = (message: string, tone?: Toast['tone']) => useToastStore.getState().show(message, tone)
