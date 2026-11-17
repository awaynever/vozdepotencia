// Tipos centrais da plataforma Voz de Potência

export type PlanId = 'free' | 'experience' | 'club'

export type DimensionId =
  | 'comunicacao'
  | 'autoconfianca'
  | 'inteligencia-emocional'
  | 'autonomia'
  | 'disciplina'
  | 'lideranca'
  | 'limites'
  | 'energia'

export type Mood = 'confiante' | 'motivada' | 'tranquila' | 'insegura' | 'cansada' | 'sobrecarregada'

export type Difficulty = 'Iniciante' | 'Intermediário' | 'Avançado'

export interface UserProfile {
  id: string
  name: string
  firstName: string
  age: number
  profession: string
  email: string
  city: string
  avatar: string
  plan: PlanId
  journeyId: string
  goals: string[]
  dailyMinutes: number
  bio: string
}

export interface UserStats {
  activitiesCompleted: number
  missionsCompleted: number
  minutesDedicated: number
  streak: number
  points: number
  voiceExercises: number
  simulations: number
}

export interface Dimension {
  id: DimensionId
  name: string
  short: string
  description: string
  icon: string
}

export interface AssessmentQuestion {
  id: string
  dimension: DimensionId
  text: string
  reverse?: boolean
}

export type DimensionScores = Record<DimensionId, number>

export interface AssessmentRecord {
  id: string
  date: string
  label: string
  scores: DimensionScores
}

export interface OnboardingGoal {
  id: string
  label: string
  dimensions: DimensionId[]
}

export interface JourneyDay {
  day: number
  phase: 1 | 2 | 3
  title: string
  minutes: number
  intro: string
  content: string[]
  example: string
  exercise: { title: string; steps: string[] }
  mission: { title: string; description: string }
  reflection: string
  support: { title: string; libraryId?: string; ritualId?: string; cardCategory?: string }
  pillar: PillarId
}

export interface JourneyPhase {
  id: 1 | 2 | 3
  name: string
  subtitle: string
  description: string
}

export interface Journey {
  id: string
  title: string
  subtitle: string
  totalDays: number
  image: string
  phases: JourneyPhase[]
  days: JourneyDay[]
  status: 'disponivel' | 'em-breve'
}

export type PillarId = 'P' | 'O' | 'T' | 'E' | 'N' | 'C' | 'I' | 'A'

export interface Pillar {
  id: PillarId
  letter: string
  name: string
  tagline: string
  description: string
  image: string
  skills: string[]
  contents: { title: string; type: string; libraryId?: string }[]
  exercises: string[]
  missions: string[]
  relatedDays: number[]
}

export type SimulationCategory =
  | 'Trabalho'
  | 'Relacionamentos'
  | 'Liderança'
  | 'Negociação'
  | 'Vendas'
  | 'Limites pessoais'
  | 'Comunicação familiar'
  | 'Entrevistas'
  | 'Empreendedorismo'
  | 'Autonomia financeira'

export interface SimulationOption {
  id: string
  text: string
  style: 'passiva' | 'reativa' | 'assertiva' | 'evasiva' | 'colaborativa'
  consequences: string
  clarity: number
  assertiveness: number
  respect: number
  suggestion: string
}

export interface Simulation {
  id: string
  title: string
  category: SimulationCategory
  difficulty: Difficulty
  minutes: number
  image: string
  description: string
  situation: string
  question: string
  options: SimulationOption[]
  context: string
  idealExample: string
  published: boolean
}

export interface SimulationResult {
  simulationId: string
  optionId: string
  customText?: string
  category?: SimulationCategory
  date: string
}

export interface VoiceModule {
  id: string
  name: string
  description: string
  icon: string
  tips: string[]
  practice: string
  minutes: number
}

export interface VoiceExercise {
  id: string
  title: string
  description: string
  seconds: number
  prompt: string
  guide: string[]
  moduleIds: string[]
}

export interface VoiceAnalysis {
  duration: string
  wpm: number
  fillerWords: number
  pauses: number
  structure: string[]
  highlights: string[]
  suggestions: string[]
}

export interface Ritual {
  id: string
  title: string
  category: string
  minutes: number
  description: string
  cover: string
  coverTone: 'rubi' | 'champagne' | 'onix' | 'bege' | 'photo'
  steps: { title: string; text: string; seconds: number }[]
  published: boolean
}

export interface ResponseCard {
  id: string
  category: string
  situation: string
  response: string
  explanation: string
  variations: string[]
  simulationId?: string
  published: boolean
}

export type LibraryFormat = 'E-book' | 'Artigo' | 'Áudio' | 'Guia' | 'Exercício' | 'Planner' | 'Checklist'

export interface LibrarySection {
  heading: string
  paragraphs?: string[]
  list?: string[]
}

export interface LibraryItem {
  id: string
  title: string
  description: string
  format: LibraryFormat
  category: string
  minutes: number
  cover: 'rubi' | 'champagne' | 'onix' | 'bege' | 'marfim'
  image?: string
  featured?: boolean
  sections: LibrarySection[]
  published: boolean
}

export interface JournalEntry {
  id: string
  date: string
  title: string
  content: string
  mood: Mood
  categories: string[]
  favorite: boolean
  createdAt: string
  updatedAt: string
}

export interface Achievement {
  id: string
  title: string
  description: string
  criteria: string
  icon: string
}

export interface CommunityProfile {
  id: string
  name: string
  avatar: string
  role: string
  city: string
  bio: string
}

export interface CommunityComment {
  id: string
  authorId: string
  text: string
  date: string
}

export interface CommunityPost {
  id: string
  authorId: string
  groupId: string
  type: 'reflexao' | 'conquista' | 'pergunta' | 'desafio'
  text: string
  date: string
  reactions: Record<string, number>
  comments: CommunityComment[]
  image?: string
}

export interface CommunityGroup {
  id: string
  name: string
  description: string
  members: number
  icon: string
}

export interface CommunityChallenge {
  id: string
  title: string
  description: string
  days: number
  participants: number
}

export interface Plan {
  id: PlanId
  name: string
  price: string
  priceNote: string
  description: string
  features: string[]
  highlight?: boolean
  comingSoon?: boolean
}

export interface AuroraTopic {
  id: string
  title: string
  keywords: string[]
  turns: { aurora: string; followUps: { label: string; next: number }[] }[]
}

export interface AuroraPersona {
  id: string
  name: string
  role: string
  description: string
  opening: string
  scenario: string
  replies: { aurora: string; options: { label: string; next: number; tip?: string }[] }[]
}

export interface ChatMessage {
  id: string
  from: 'aurora' | 'user' | 'persona'
  text: string
  meta?: string
}

export interface ActivityLogEntry {
  id: string
  date: string // YYYY-MM-DD
  type: 'atividade' | 'missao' | 'oratoria' | 'simulacao' | 'ritual' | 'leitura' | 'diario' | 'checkin'
  label: string
  minutes: number
  points: number
  skill?: DimensionId
}

export interface CheckIn {
  date: string
  mood: Mood
}

export interface Notification {
  id: string
  title: string
  text: string
  date: string
  read: boolean
  link?: string
}

export interface Banner {
  id: string
  title: string
  subtitle: string
  image: string
  cta: string
  link: string
  active: boolean
}

export interface DailyMission {
  id: string
  title: string
  description: string
  minutes: number
  steps: string[]
  pillar: PillarId
}

export interface Reflection {
  id: string
  quote: string
  question: string
}

export interface AdminUser {
  id: string
  name: string
  email: string
  plan: PlanId
  journeyDay: number
  status: 'ativa' | 'inativa'
  joined: string
}
