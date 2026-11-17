import { AUDIO_DB } from './storage'

// Armazenamento local de gravações (IndexedDB). Nada é enviado para servidores externos.

export interface StoredRecording {
  id: string
  exerciseId: string
  createdAt: string
  durationSec: number
  mimeType: string
  blob: Blob
}

const openDb = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB indisponível'))
      return
    }
    const req = indexedDB.open(AUDIO_DB.name, AUDIO_DB.version)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(AUDIO_DB.store)) {
        const store = db.createObjectStore(AUDIO_DB.store, { keyPath: 'id' })
        store.createIndex('exerciseId', 'exerciseId')
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })

const tx = async <T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> => {
  const db = await openDb()
  return new Promise<T>((resolve, reject) => {
    const t = db.transaction(AUDIO_DB.store, mode)
    const req = fn(t.objectStore(AUDIO_DB.store))
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
    t.oncomplete = () => db.close()
  })
}

export const audioStore = {
  save: (rec: StoredRecording) => tx('readwrite', (s) => s.put(rec)),
  remove: (id: string) => tx('readwrite', (s) => s.delete(id)),
  list: async (exerciseId?: string): Promise<StoredRecording[]> => {
    try {
      const all = await tx<StoredRecording[]>('readonly', (s) => s.getAll() as IDBRequest<StoredRecording[]>)
      return all.filter((r) => !exerciseId || r.exerciseId === exerciseId).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    } catch {
      return []
    }
  },
  clear: async () => {
    try {
      await tx('readwrite', (s) => s.clear())
    } catch {
      /* noop */
    }
  },
}
