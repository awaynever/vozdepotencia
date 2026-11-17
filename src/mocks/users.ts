import type { AdminUser, UserProfile, UserStats } from '@/types'
import { images } from './images'

// Usuária fictícia padrão da demonstração. Edite aqui para trocar a persona.
export const demoUser: UserProfile = {
  id: 'u-marina',
  name: 'Marina Almeida',
  firstName: 'Marina',
  age: 32,
  profession: 'Empreendedora',
  email: 'marina.almeida@exemplo.com',
  city: 'Salvador, BA',
  avatar: images.retratoEbony,
  plan: 'experience',
  journeyId: 'despertar-minha-voz',
  goals: ['comunicacao-assertiva', 'autoconfianca', 'negociar-valor'],
  dailyMinutes: 10,
  bio: 'Fundadora de um ateliê de design de interiores. Quer liderar reuniões com mais segurança e precificar melhor o próprio trabalho.',
}

export const demoUserGoalsLabels = [
  'Desenvolver comunicação assertiva.',
  'Fortalecer a autoconfiança.',
  'Aprender a negociar meu valor.',
]

export const demoStats: UserStats = {
  activitiesCompleted: 19,
  missionsCompleted: 7,
  minutesDedicated: 155,
  streak: 5,
  points: 780,
  voiceExercises: 5,
  simulations: 8,
}

export const demoCurrentDay = 8
export const demoCompletedDays = [1, 2, 3, 4, 5, 6, 7]

export const adminUsers: AdminUser[] = [
  { id: 'au-1', name: 'Marina Almeida', email: 'marina.almeida@exemplo.com', plan: 'experience', journeyDay: 8, status: 'ativa', joined: '2026-10-28' },
  { id: 'au-2', name: 'Juliana Prado', email: 'juliana.prado@exemplo.com', plan: 'free', journeyDay: 2, status: 'ativa', joined: '2026-11-10' },
  { id: 'au-3', name: 'Aline Nascimento', email: 'aline.n@exemplo.com', plan: 'experience', journeyDay: 15, status: 'ativa', joined: '2026-10-12' },
  { id: 'au-4', name: 'Beatriz Ramos', email: 'bia.ramos@exemplo.com', plan: 'experience', journeyDay: 21, status: 'ativa', joined: '2026-09-30' },
  { id: 'au-5', name: 'Cláudia Ferreira', email: 'claudia.f@exemplo.com', plan: 'free', journeyDay: 0, status: 'inativa', joined: '2026-11-02' },
  { id: 'au-6', name: 'Fernanda Lima', email: 'fe.lima@exemplo.com', plan: 'experience', journeyDay: 11, status: 'ativa', joined: '2026-10-20' },
  { id: 'au-7', name: 'Helena Duarte', email: 'helena.d@exemplo.com', plan: 'free', journeyDay: 4, status: 'ativa', joined: '2026-11-08' },
  { id: 'au-8', name: 'Rosana Teixeira', email: 'rosana.t@exemplo.com', plan: 'experience', journeyDay: 6, status: 'ativa', joined: '2026-11-01' },
]
