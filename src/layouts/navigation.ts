import {
  BookOpen, Bot, FlaskConical, House, Layers, Map, Mic, NotebookPen, Route, Settings, Sun, TrendingUp, Users, Dumbbell, UserRound, Orbit,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
  badge?: string
}

export const sidebarNav: NavItem[] = [
  { to: '/app', label: 'Início', icon: House, end: true },
  { to: '/app/jornada', label: 'Minha Jornada', icon: Route },
  { to: '/app/mapa', label: 'Mapa da Potência', icon: Map },
  { to: '/app/academia', label: 'Academia da Voz', icon: Mic },
  { to: '/app/laboratorio', label: 'Laboratório Comportamental', icon: FlaskConical },
  { to: '/app/respostas', label: 'Respostas Poderosas', icon: Layers },
  { to: '/app/rituais', label: 'Rituais de Energia', icon: Sun },
  { to: '/app/diario', label: 'Meu Diário', icon: NotebookPen },
  { to: '/app/biblioteca', label: 'Biblioteca', icon: BookOpen },
  { to: '/app/aurora', label: 'Aurora IA', icon: Bot, badge: 'Prévia' },
  { to: '/app/evolucao', label: 'Minha Evolução', icon: TrendingUp },
  { to: '/app/comunidade', label: 'Comunidade', icon: Users, badge: 'Prévia' },
  { to: '/app/configuracoes', label: 'Configurações', icon: Settings },
]

export const methodNav: NavItem = { to: '/app/metodo', label: 'Método POTÊNCIA', icon: Orbit }

export const bottomNav: NavItem[] = [
  { to: '/app', label: 'Início', icon: House, end: true },
  { to: '/app/jornada', label: 'Jornada', icon: Route },
  { to: '/app/praticar', label: 'Praticar', icon: Dumbbell },
  { to: '/app/evolucao', label: 'Evolução', icon: TrendingUp },
  { to: '/app/configuracoes', label: 'Perfil', icon: UserRound },
]
