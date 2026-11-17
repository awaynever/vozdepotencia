import type { Banner, Notification } from '@/types'
import { images } from './images'
import { daysAgoDateTime } from '@/utils/date'

export const banners: Banner[] = [
  { id: 'b-1', title: 'Fase Expressar começou', subtitle: 'Sete dias para descobrir e fortalecer sua voz.', image: images.liderReuniao, cta: 'Continuar minha jornada', link: '/app/jornada/8', active: true },
  { id: 'b-2', title: 'Novo no Laboratório', subtitle: '30 simulações para praticar conversas reais.', image: images.duasNegrasReuniao, cta: 'Explorar simulações', link: '/app/laboratorio', active: true },
  { id: 'b-3', title: 'Clube Voz de Potência', subtitle: 'Desenvolvimento contínuo em comunidade. Em breve.', image: images.risoReuniao, cta: 'Conhecer planos', link: '/app/planos', active: false },
]

export const notifications: Notification[] = [
  { id: 'n-1', title: 'Fase Expressar desbloqueada', text: 'Você concluiu a fase Despertar. O Dia 8 está pronto para você.', date: daysAgoDateTime(0, '07:00:00'), read: false, link: '/app/jornada/8' },
  { id: 'n-2', title: 'Medalha conquistada', text: 'Sete dias de dedicação. Que caminho bonito!', date: daysAgoDateTime(2, '21:10:00'), read: false, link: '/app/evolucao' },
  { id: 'n-3', title: 'Ritual sugerido', text: 'Experimente "Prepare sua voz" antes da sua próxima reunião.', date: daysAgoDateTime(3, '09:30:00'), read: true, link: '/app/rituais/rit-voz' },
]
