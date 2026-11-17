// Camada de persistência local. Todas as chaves ficam centralizadas aqui.

export const STORAGE_KEYS = {
  app: 'vdp-app-state-v1',
  content: 'vdp-content-v1',
} as const

export const AUDIO_DB = { name: 'vdp-audio', store: 'recordings', version: 1 } as const

export const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      return window.localStorage.getItem(key)
    } catch {
      return null
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      window.localStorage.setItem(key, value)
    } catch {
      /* armazenamento indisponível (modo privado / cota) */
    }
  },
  removeItem: (key: string): void => {
    try {
      window.localStorage.removeItem(key)
    } catch {
      /* noop */
    }
  },
}

export const uid = (prefix = 'id'): string =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
