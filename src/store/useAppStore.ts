import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type {
  ActivityLogEntry,
  AssessmentRecord,
  CheckIn,
  CommunityComment,
  CommunityPost,
  DimensionId,
  DimensionScores,
  JournalEntry,
  Mood,
  PlanId,
  SimulationCategory,
  SimulationResult,
  UserProfile,
} from '@/types'
import { demoCompletedDays, demoUser } from '@/mocks/users'
import { assessmentHistory } from '@/mocks/assessments'
import { buildDemoActivityLog, buildDemoCheckins } from '@/mocks/analytics'
import { demoCompletedSimulations, simulations as baseSimulations } from '@/mocks/simulations'
import { demoVoiceExercisesDone } from '@/mocks/voiceExercises'
import { demoJournal } from '@/mocks/journal'
import { achievements, demoUnlocked, pointsRules } from '@/mocks/achievements'
import { safeStorage, STORAGE_KEYS, uid } from '@/services/storage'
import { today } from '@/utils/date'

export type FavoriteKind = 'cards' | 'rituals' | 'library' | 'reflections' | 'simulations'

export interface Settings {
  largeText: boolean
  highContrast: boolean
  reduceMotion: boolean
  notifications: { daily: boolean; missions: boolean; community: boolean; email: boolean }
  reminderTime: string
  shareProgress: boolean
}

export interface OnboardingState {
  completed: boolean
  goals: string[]
  answers: Record<string, number>
  minutes: number
  scores?: DimensionScores
  suggestedJourney?: string
}

export interface Celebration {
  id: string
  kind: 'achievement' | 'points'
  title: string
  description: string
  points?: number
}

interface AppData {
  isDemo: boolean
  profile: UserProfile
  onboarding: OnboardingState
  assessments: AssessmentRecord[]
  completedDays: number[]
  currentDay: number
  activityLog: ActivityLogEntry[]
  awardedKeys: string[]
  simulationResults: SimulationResult[]
  voiceDone: string[]
  ritualsDone: { id: string; date: string }[]
  libraryRead: string[]
  missionsDone: { id: string; date: string }[]
  favorites: Record<FavoriteKind, string[]>
  journal: JournalEntry[]
  checkins: CheckIn[]
  unlocked: { id: string; date: string }[]
  community: {
    reactions: Record<string, string[]> // postId -> reactions dadas pela usuária
    comments: Record<string, CommunityComment[]>
    posts: CommunityPost[]
    groups: string[]
    challenges: string[]
  }
  readNotifications: string[]
  settings: Settings
}

interface AppActions {
  completeJourneyDay: (day: number, title: string, minutes: number, skill?: DimensionId) => void
  completeMission: (id: string, title: string) => void
  completeSimulation: (id: string, title: string, category: SimulationCategory, optionId: string, customText?: string) => void
  completeVoiceExercise: (id: string, title: string) => void
  completeRitual: (id: string, title: string, minutes: number) => void
  markLibraryRead: (id: string, title: string) => void
  checkIn: (mood: Mood) => void
  toggleFavorite: (kind: FavoriteKind, id: string) => void
  saveJournal: (entry: Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => string
  deleteJournal: (id: string) => void
  toggleJournalFavorite: (id: string) => void
  saveAssessment: (scores: DimensionScores, label: string) => void
  completeOnboarding: (data: Omit<OnboardingState, 'completed'>) => void
  restartOnboarding: () => void
  setPlan: (plan: PlanId) => void
  updateProfile: (patch: Partial<UserProfile>) => void
  updateSettings: (patch: Partial<Settings>) => void
  toggleReaction: (postId: string, reaction: string) => void
  addComment: (postId: string, text: string) => void
  createPost: (text: string, groupId: string, type: CommunityPost['type']) => void
  toggleGroup: (groupId: string) => void
  toggleChallenge: (challengeId: string) => void
  markNotificationRead: (id: string) => void
  markAllNotificationsRead: (ids: string[]) => void
  setCurrentDay: (day: number) => void
  dismissCelebration: () => void
  resetDemo: () => void
}

interface Transient {
  celebrations: Celebration[]
}

export type AppState = AppData & AppActions & Transient

const defaultSettings: Settings = {
  largeText: false,
  highContrast: false,
  reduceMotion: false,
  notifications: { daily: true, missions: true, community: false, email: false },
  reminderTime: '08:00',
  shareProgress: false,
}

export const buildInitialData = (): AppData => {
  const log = buildDemoActivityLog()
  return {
    isDemo: true,
    profile: structuredClone(demoUser),
    onboarding: { completed: true, goals: ['falar-seguranca', 'autoestima', 'vida-profissional'], answers: {}, minutes: 10, suggestedJourney: 'despertar-minha-voz' },
    assessments: structuredClone(assessmentHistory),
    completedDays: [...demoCompletedDays],
    currentDay: 8,
    activityLog: log,
    awardedKeys: [
      ...demoCompletedDays.map((d) => `day:${d}`),
      ...demoCompletedSimulations.map((s) => `sim:${s.id}`),
      ...demoVoiceExercisesDone.map((v) => `voice:${v}`),
    ],
    simulationResults: demoCompletedSimulations.map((s) => ({ simulationId: s.id, optionId: s.optionId, date: s.date })),
    voiceDone: [...demoVoiceExercisesDone],
    ritualsDone: [],
    libraryRead: [],
    missionsDone: [],
    favorites: { cards: ['card-01', 'card-37'], rituals: ['rit-manha'], library: ['lib-negociacao'], reflections: [], simulations: [] },
    journal: structuredClone(demoJournal),
    checkins: buildDemoCheckins(),
    unlocked: structuredClone(demoUnlocked),
    community: { reactions: {}, comments: {}, posts: [], groups: ['g-empreendedoras', 'g-lideranca'], challenges: [] },
    readNotifications: [],
    settings: structuredClone(defaultSettings),
  }
}

const categoryOf = (simId: string): SimulationCategory | undefined => baseSimulations.find((s) => s.id === simId)?.category

// Avalia quais conquistas devem ser desbloqueadas a partir do estado atual
const evaluateAchievements = (state: AppData): string[] => {
  const missions = state.activityLog.filter((e) => e.type === 'missao').length
  const voice = state.activityLog.filter((e) => e.type === 'oratoria').length
  const catOf = (r: SimulationResult) => r.category ?? categoryOf(r.simulationId)
  const simCats = state.simulationResults.map(catOf)
  const limites = new Set(state.simulationResults.filter((r) => catOf(r) === 'Limites pessoais').map((r) => r.simulationId)).size
  const rules: Record<string, boolean> = {
    'primeira-missao': missions >= 1,
    'voz-espaco': voice >= 1,
    'primeiro-ato': missions >= 3,
    'guardia-limites': limites >= 2,
    'mulher-palavra': missions >= 10,
    'primeira-negociacao': simCats.includes('Negociação'),
    'sete-dias': state.completedDays.length >= 7,
    'vinte-um-dias': state.completedDays.length >= 21,
  }
  const have = new Set(state.unlocked.map((u) => u.id))
  return Object.entries(rules).filter(([id, ok]) => ok && !have.has(id)).map(([id]) => id)
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => {
      // Registra atividade, concede pontos apenas uma vez por chave e avalia conquistas
      const record = (key: string, entry: Omit<ActivityLogEntry, 'id' | 'date'>, patch: Partial<AppData> = {}) => {
        const state = get()
        const alreadyAwarded = state.awardedKeys.includes(key)
        const celebrations: Celebration[] = []
        let next: Partial<AppData> = { ...patch }
        if (!alreadyAwarded) {
          const logEntry: ActivityLogEntry = { ...entry, id: uid('log'), date: today() }
          next = { ...next, activityLog: [...state.activityLog, logEntry], awardedKeys: [...state.awardedKeys, key] }
          if (entry.points > 0) {
            celebrations.push({ id: uid('cel'), kind: 'points', title: `+${entry.points} pontos de evolução`, description: entry.label, points: entry.points })
          }
        }
        const merged = { ...state, ...next } as AppData
        const newly = evaluateAchievements(merged)
        if (newly.length) {
          next.unlocked = [...merged.unlocked, ...newly.map((id) => ({ id, date: today() }))]
          for (const id of newly) {
            const a = achievements.find((x) => x.id === id)
            if (a) celebrations.push({ id: uid('cel'), kind: 'achievement', title: a.title, description: a.description })
          }
        }
        set({ ...next, celebrations: [...get().celebrations, ...celebrations] } as Partial<AppState>)
        return !alreadyAwarded
      }

      return {
        ...buildInitialData(),
        celebrations: [],

        completeJourneyDay: (day, title, minutes, skill) => {
          const s = get()
          const completedDays = s.completedDays.includes(day) ? s.completedDays : [...s.completedDays, day].sort((a, b) => a - b)
          const nextDay = Math.min(21, Math.max(s.currentDay, day + 1))
          record(`day:${day}`, { type: 'atividade', label: `Dia ${day} · ${title}`, minutes: Math.min(minutes, 15), points: pointsRules.atividade, skill }, { completedDays, currentDay: nextDay })
        },
        completeMission: (id, title) => {
          const s = get()
          const key = `mission:${id}:${today()}`
          record(key, { type: 'missao', label: `Missão: ${title}`, minutes: 5, points: pointsRules.missao, skill: 'autoconfianca' }, {
            missionsDone: s.missionsDone.some((m) => m.id === id && m.date === today()) ? s.missionsDone : [...s.missionsDone, { id, date: today() }],
          })
        },
        completeSimulation: (id, title, category, optionId, customText) => {
          const s = get()
          const results = [...s.simulationResults.filter((r) => r.simulationId !== id), { simulationId: id, optionId, customText, category, date: today() }]
          const skillMap: Partial<Record<SimulationCategory, DimensionId>> = {
            Trabalho: 'comunicacao', Relacionamentos: 'inteligencia-emocional', Liderança: 'lideranca', Negociação: 'autonomia', Vendas: 'comunicacao',
            'Limites pessoais': 'limites', 'Comunicação familiar': 'inteligencia-emocional', Entrevistas: 'autoconfianca', Empreendedorismo: 'lideranca', 'Autonomia financeira': 'autonomia',
          }
          record(`sim:${id}`, { type: 'simulacao', label: `Simulação: ${title}`, minutes: 4, points: pointsRules.simulacao, skill: skillMap[category] }, { simulationResults: results })
        },
        completeVoiceExercise: (id, title) => {
          const s = get()
          record(`voice:${id}`, { type: 'oratoria', label: `Academia: ${title}`, minutes: 3, points: pointsRules.oratoria, skill: 'comunicacao' }, {
            voiceDone: s.voiceDone.includes(id) ? s.voiceDone : [...s.voiceDone, id],
          })
        },
        completeRitual: (id, title, minutes) => {
          const s = get()
          record(`ritual:${id}:${today()}`, { type: 'ritual', label: `Ritual: ${title}`, minutes, points: 10, skill: 'energia' }, {
            ritualsDone: [...s.ritualsDone, { id, date: today() }],
          })
        },
        markLibraryRead: (id, title) => {
          const s = get()
          record(`read:${id}`, { type: 'leitura', label: `Leitura: ${title}`, minutes: 3, points: 5 }, {
            libraryRead: s.libraryRead.includes(id) ? s.libraryRead : [...s.libraryRead, id],
          })
        },
        checkIn: (mood) => {
          const s = get()
          const checkins = [...s.checkins.filter((c) => c.date !== today()), { date: today(), mood }]
          record(`checkin:${today()}`, { type: 'checkin', label: 'Check-in diário', minutes: 0, points: 3 }, { checkins })
        },
        toggleFavorite: (kind, id) =>
          set((s) => {
            const list = s.favorites[kind]
            return { favorites: { ...s.favorites, [kind]: list.includes(id) ? list.filter((x) => x !== id) : [...list, id] } }
          }),
        saveJournal: (entry) => {
          const now = new Date().toISOString()
          const id = entry.id ?? uid('j')
          const s = get()
          const existing = s.journal.find((j) => j.id === id)
          const full: JournalEntry = { ...entry, id, createdAt: existing?.createdAt ?? now, updatedAt: now }
          const journal = existing ? s.journal.map((j) => (j.id === id ? full : j)) : [full, ...s.journal]
          if (!existing) {
            record(`journal:${id}`, { type: 'diario', label: `Diário: ${entry.title}`, minutes: 5, points: 0, skill: 'inteligencia-emocional' }, { journal })
          } else {
            set({ journal })
          }
          return id
        },
        deleteJournal: (id) => set((s) => ({ journal: s.journal.filter((j) => j.id !== id) })),
        toggleJournalFavorite: (id) => set((s) => ({ journal: s.journal.map((j) => (j.id === id ? { ...j, favorite: !j.favorite } : j)) })),
        saveAssessment: (scores, label) =>
          set((s) => ({ assessments: [...s.assessments, { id: uid('a'), date: today(), label, scores }] })),
        completeOnboarding: (data) =>
          set((s) => ({
            onboarding: { ...data, completed: true },
            profile: { ...s.profile, dailyMinutes: data.minutes },
            assessments: data.scores ? [...s.assessments, { id: uid('a'), date: today(), label: 'Avaliação do onboarding', scores: data.scores }] : s.assessments,
          })),
        restartOnboarding: () => set((s) => ({ onboarding: { ...s.onboarding, completed: false } })),
        setPlan: (plan) => set((s) => ({ profile: { ...s.profile, plan } })),
        updateProfile: (patch) => set((s) => ({ profile: { ...s.profile, ...patch } })),
        updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
        toggleReaction: (postId, reaction) =>
          set((s) => {
            const mine = s.community.reactions[postId] ?? []
            const next = mine.includes(reaction) ? mine.filter((r) => r !== reaction) : [...mine, reaction]
            return { community: { ...s.community, reactions: { ...s.community.reactions, [postId]: next } } }
          }),
        addComment: (postId, text) =>
          set((s) => {
            const c: CommunityComment = { id: uid('c'), authorId: 'me', text, date: new Date().toISOString() }
            return { community: { ...s.community, comments: { ...s.community.comments, [postId]: [...(s.community.comments[postId] ?? []), c] } } }
          }),
        createPost: (text, groupId, type) =>
          set((s) => {
            const p: CommunityPost = { id: uid('post'), authorId: 'me', groupId, type, text, date: new Date().toISOString(), reactions: {}, comments: [] }
            return { community: { ...s.community, posts: [p, ...s.community.posts] } }
          }),
        toggleGroup: (groupId) =>
          set((s) => {
            const g = s.community.groups
            return { community: { ...s.community, groups: g.includes(groupId) ? g.filter((x) => x !== groupId) : [...g, groupId] } }
          }),
        toggleChallenge: (id) =>
          set((s) => {
            const c = s.community.challenges
            return { community: { ...s.community, challenges: c.includes(id) ? c.filter((x) => x !== id) : [...c, id] } }
          }),
        markNotificationRead: (id) => set((s) => ({ readNotifications: s.readNotifications.includes(id) ? s.readNotifications : [...s.readNotifications, id] })),
        markAllNotificationsRead: (ids) => set((s) => ({ readNotifications: Array.from(new Set([...s.readNotifications, ...ids])) })),
        setCurrentDay: (day) => set({ currentDay: day }),
        dismissCelebration: () => set((s) => ({ celebrations: s.celebrations.slice(1) })),
        resetDemo: () => set({ ...buildInitialData(), celebrations: [] }),
      }
    },
    {
      name: STORAGE_KEYS.app,
      storage: createJSONStorage(() => safeStorage),
      version: 1,
      partialize: (state) => {
        const rest: Partial<AppState> = { ...state }
        delete rest.celebrations
        return rest as AppState
      },
    },
  ),
)
