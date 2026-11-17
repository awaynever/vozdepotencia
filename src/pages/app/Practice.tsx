import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, Bot, FlaskConical, Layers, Map, Mic, NotebookPen, Orbit, Sun, Users } from 'lucide-react'
import { PageHeader } from '@/components/ui/primitives'
import { useAppStore } from '@/store/useAppStore'
import { useContentStore } from '@/store/useContentStore'

const items = [
  { to: '/app/laboratorio', title: 'Laboratório Comportamental', text: 'Simule conversas difíceis', icon: FlaskConical, tone: 'bg-rubi text-marfim' },
  { to: '/app/academia', title: 'Academia da Voz', text: 'Grave e treine sua fala', icon: Mic, tone: 'bg-onix text-marfim' },
  { to: '/app/respostas', title: 'Respostas Poderosas', text: '60 cards prontos', icon: Layers, tone: 'bg-white' },
  { to: '/app/rituais', title: 'Rituais de Energia', text: 'Foco, preparo e descanso', icon: Sun, tone: 'bg-white' },
  { to: '/app/aurora', title: 'Aurora IA', text: 'Mentora digital (prévia)', icon: Bot, tone: 'bg-white' },
  { to: '/app/diario', title: 'Meu Diário', text: 'Registros e reflexões', icon: NotebookPen, tone: 'bg-white' },
  { to: '/app/biblioteca', title: 'Biblioteca', text: 'E-books, guias e planners', icon: BookOpen, tone: 'bg-white' },
  { to: '/app/mapa', title: 'Mapa da Potência', text: 'Sua autopercepção', icon: Map, tone: 'bg-white' },
  { to: '/app/metodo', title: 'Método POTÊNCIA', text: 'Os oito pilares', icon: Orbit, tone: 'bg-white' },
  { to: '/app/comunidade', title: 'Comunidade', text: 'Círculo de Potência (prévia)', icon: Users, tone: 'bg-white' },
]

export default function Practice() {
  const results = useAppStore((s) => s.simulationResults)
  const sims = useContentStore((s) => s.simulations)
  const next = sims.find((s) => s.published && !results.some((r) => r.simulationId === s.id))

  return (
    <div>
      <PageHeader eyebrow="Praticar" title="O que você quer praticar hoje?" />
      {next && (
        <Link to={`/app/laboratorio/${next.id}`} className="group relative mb-6 flex min-h-[180px] flex-col justify-end overflow-hidden rounded-2xl p-5 text-marfim">
          <img src={next.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-rubi-deep/95 via-rubi-deep/50 to-transparent" />
          <div className="relative">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-champagne">Próxima simulação sugerida</p>
            <p className="mt-1 font-serif text-[26px] font-semibold leading-tight">{next.title}</p>
            <span className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-champagne">Começar <ArrowRight className="h-4 w-4" aria-hidden="true" /></span>
          </div>
        </Link>
      )}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {items.map(({ to, title, text, icon: I, tone }) => (
          <Link key={to} to={to} className={`flex min-h-[140px] flex-col justify-between rounded-2xl border border-line p-4 shadow-soft transition-transform hover:-translate-y-0.5 ${tone}`}>
            <I className={`h-6 w-6 ${tone === 'bg-white' ? 'text-rubi' : 'text-champagne'}`} aria-hidden="true" />
            <span>
              <span className="block font-serif text-[19px] font-semibold leading-tight">{title}</span>
              <span className="mt-0.5 block text-[12px] opacity-70">{text}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
