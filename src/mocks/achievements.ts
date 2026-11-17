import { daysAgo } from '@/utils/date'
import type { Achievement } from '@/types'

export const pointsRules = {
  atividade: 20,
  missao: 30,
  oratoria: 25,
  simulacao: 25,
} as const

export const achievements: Achievement[] = [
  { id: 'primeira-missao', title: 'Minha primeira missão', description: 'Você deu o primeiro passo prático.', criteria: 'Concluir 1 missão.', icon: 'Flag' },
  { id: 'voz-espaco', title: 'Minha voz merece espaço', description: 'Sua primeira prática de oratória.', criteria: 'Concluir 1 exercício na Academia da Voz.', icon: 'Mic' },
  { id: 'primeiro-ato', title: 'Primeiro ato de coragem', description: 'Agir apesar do desconforto.', criteria: 'Concluir 3 missões.', icon: 'Flame' },
  { id: 'guardia-limites', title: 'Guardiã dos meus limites', description: 'Praticou limites com consistência.', criteria: 'Concluir 2 simulações de Limites pessoais.', icon: 'Shield' },
  { id: 'mulher-palavra', title: 'Mulher de palavra', description: 'Compromissos cumpridos consigo mesma.', criteria: 'Concluir 10 missões.', icon: 'Gem' },
  { id: 'primeira-negociacao', title: 'Minha primeira negociação', description: 'Praticou negociar seu valor.', criteria: 'Concluir 1 simulação de Negociação.', icon: 'Handshake' },
  { id: 'sete-dias', title: 'Sete dias de dedicação', description: 'Concluiu a fase Despertar.', criteria: 'Concluir 7 dias da jornada.', icon: 'CalendarCheck' },
  { id: 'vinte-um-dias', title: 'Vinte e um dias de potência', description: 'Concluiu a jornada completa.', criteria: 'Concluir os 21 dias da jornada.', icon: 'Award' },
]

export const demoUnlocked: { id: string; date: string }[] = [
  { id: 'primeira-missao', date: daysAgo(20) },
  { id: 'voz-espaco', date: daysAgo(17) },
  { id: 'primeiro-ato', date: daysAgo(14) },
  { id: 'sete-dias', date: daysAgo(2) },
]
