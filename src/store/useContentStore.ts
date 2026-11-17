import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { AdminUser, Banner, DailyMission, LibraryItem, Notification, Plan, ResponseCard, Ritual, Simulation } from '@/types'
import { simulations } from '@/mocks/simulations'
import { responseCards } from '@/mocks/responseCards'
import { library } from '@/mocks/library'
import { rituals } from '@/mocks/rituals'
import { banners, notifications } from '@/mocks/admin'
import { plans } from '@/mocks/plans'
import { adminUsers } from '@/mocks/users'
import { dailyMissions } from '@/mocks/journeys'
import { safeStorage, STORAGE_KEYS } from '@/services/storage'

// Conteúdo editável pelo painel administrativo.
// Inicializado a partir dos mocks; alterações ficam no navegador.

export interface ContentCollections {
  simulations: Simulation[]
  responseCards: ResponseCard[]
  library: LibraryItem[]
  rituals: Ritual[]
  banners: Banner[]
  notifications: Notification[]
  plans: Plan[]
  adminUsers: AdminUser[]
  missions: DailyMission[]
  journeyTitles: Record<number, string>
  hiddenPosts: string[]
  platform: { slogan: string; supportEmail: string; maintenance: boolean }
}

export type CollectionKey = Exclude<keyof ContentCollections, 'journeyTitles' | 'hiddenPosts' | 'platform'>

const initialContent = (): ContentCollections => ({
  simulations: structuredClone(simulations),
  responseCards: structuredClone(responseCards),
  library: structuredClone(library),
  rituals: structuredClone(rituals),
  banners: structuredClone(banners),
  notifications: structuredClone(notifications),
  plans: structuredClone(plans),
  adminUsers: structuredClone(adminUsers),
  missions: structuredClone(dailyMissions),
  journeyTitles: {},
  hiddenPosts: [],
  platform: { slogan: 'Sua voz. Sua essência. Sua potência.', supportEmail: 'contato@vozdepotencia.com.br', maintenance: false },
})

interface ContentState extends ContentCollections {
  upsert: <K extends CollectionKey>(key: K, item: ContentCollections[K][number]) => void
  remove: (key: CollectionKey, id: string) => void
  setJourneyTitle: (day: number, title: string) => void
  togglePostHidden: (id: string) => void
  updatePlatform: (patch: Partial<ContentCollections['platform']>) => void
  resetContent: () => void
}

export const useContentStore = create<ContentState>()(
  persist(
    (set) => ({
      ...initialContent(),
      upsert: (key, item) =>
        set((state) => {
          const list = state[key] as Array<{ id: string }>
          const exists = list.some((x) => x.id === (item as { id: string }).id)
          const next = exists
            ? list.map((x) => (x.id === (item as { id: string }).id ? item : x))
            : [item, ...list]
          return { [key]: next } as Partial<ContentState>
        }),
      remove: (key, id) =>
        set((state) => ({ [key]: (state[key] as Array<{ id: string }>).filter((x) => x.id !== id) }) as Partial<ContentState>),
      setJourneyTitle: (day, title) => set((s) => ({ journeyTitles: { ...s.journeyTitles, [day]: title } })),
      togglePostHidden: (id) => set((s) => ({ hiddenPosts: s.hiddenPosts.includes(id) ? s.hiddenPosts.filter((x) => x !== id) : [...s.hiddenPosts, id] })),
      updatePlatform: (patch) => set((s) => ({ platform: { ...s.platform, ...patch } })),
      resetContent: () => set(initialContent()),
    }),
    {
      name: STORAGE_KEYS.content,
      storage: createJSONStorage(() => safeStorage),
      version: 1,
    },
  ),
)
