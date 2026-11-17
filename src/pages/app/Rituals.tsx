import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Atom, CheckCircle2, ChevronDown, Clock, Sun } from 'lucide-react'
import { Badge, Chip, EmptyState, FavoriteButton, PageHeader, PremiumLock, Segmented } from '@/components/ui/primitives'
import { useContentStore } from '@/store/useContentStore'
import { useAppStore } from '@/store/useAppStore'
import { useAccess } from '@/hooks/useProgress'
import { quantumEducation, ritualCategories } from '@/mocks/rituals'
import { cn } from '@/utils/cn'
import type { Ritual } from '@/types'

export function RitualCover({ ritual, className }: { ritual: Ritual; className?: string }) {
  if (ritual.coverTone === 'photo' && ritual.cover) {
    return <img src={ritual.cover} alt="" className={cn('h-full w-full object-cover', className)} loading="lazy" />
  }
  const tones = {
    rubi: 'from-rubi to-rubi-deep',
    champagne: 'from-[#d9c095] to-champagne-ink',
    onix: 'from-onix to-rubi-deep',
    bege: 'from-bege to-[#d8c9b1]',
    photo: 'from-rubi to-rubi-deep',
  }
  return (
    <div className={cn('relative h-full w-full bg-gradient-to-br', tones[ritual.coverTone], className)}>
      <span className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30" aria-hidden="true" />
      <span className="absolute left-1/2 top-1/2 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/15" aria-hidden="true" />
    </div>
  )
}

export default function Rituals() {
  const rituals = useContentStore((s) => s.rituals).filter((r) => r.published)
  const favorites = useAppStore((s) => s.favorites.rituals)
  const toggleFavorite = useAppStore((s) => s.toggleFavorite)
  const done = useAppStore((s) => s.ritualsDone)
  const { can } = useAccess()
  const [category, setCategory] = useState('Todos')
  const [view, setView] = useState<'all' | 'fav'>('all')
  const [openQ, setOpenQ] = useState(false)

  const filtered = rituals.filter((r) => (category === 'Todos' || r.category === category) && (view === 'all' || favorites.includes(r.id)))

  return (
    <div>
      <PageHeader
        eyebrow="Experiências guiadas"
        title="Rituais de Energia"
        description="Energia aqui significa disposição, atenção, foco, esforço e descanso. Rituais curtos para começar, focar, preparar e encerrar o dia."
        actions={<Segmented label="Exibição" value={view} onChange={setView} options={[{ value: 'all', label: 'Todos' }, { value: 'fav', label: 'Favoritos' }]} />}
      />
      <div className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:flex-wrap sm:px-0">
        {['Todos', ...ritualCategories].map((c) => (
          <Chip key={c} active={category === c} onClick={() => setCategory(c)}>{c}</Chip>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Sun className="h-8 w-8" />} title="Nenhum ritual aqui" description="Favorite rituais para encontrá-los rapidamente." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((r) => {
            const count = done.filter((d) => d.id === r.id).length
            const locked = !can('ritual', r.id)
            return (
              <Link key={r.id} to={`/app/rituais/${r.id}`} className="group card flex flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lift">
                <div className="relative h-44 overflow-hidden">
                  <RitualCover ritual={r} className="transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-onix/50 to-transparent" />
                  <FavoriteButton active={favorites.includes(r.id)} onToggle={() => toggleFavorite('rituals', r.id)} light className="absolute right-3 top-3" />
                  <span className="absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[11.5px] font-semibold"><Clock className="h-3 w-3" aria-hidden="true" /> {r.minutes} min</span>
                  {locked && <PremiumLock compact className="absolute bottom-3 right-3" />}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-champagne-ink">{r.category}</p>
                  <p className="mt-1 font-serif text-[22px] font-semibold leading-snug group-hover:text-rubi">{r.title}</p>
                  <p className="mt-1 flex-1 text-[13.5px] text-muted">{r.description}</p>
                  {count > 0 && <Badge tone="success" className="mt-3 w-fit"><CheckCircle2 className="h-3 w-3" aria-hidden="true" /> Realizado {count}×</Badge>}
                </div>
              </Link>
            )
          })}
        </div>
      )}

      <section className="mt-12 overflow-hidden rounded-2xl border border-line bg-white" aria-labelledby="quantica">
        <button className="flex w-full items-center gap-4 p-5 text-left sm:p-6" onClick={() => setOpenQ((v) => !v)} aria-expanded={openQ} aria-controls="quantica-conteudo">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-onix text-champagne"><Atom className="h-6 w-6" aria-hidden="true" /></span>
          <span className="flex-1">
            <span className="eyebrow block">Seção educacional</span>
            <span id="quantica" className="block font-serif text-[24px] font-semibold">{quantumEducation.title}</span>
          </span>
          <ChevronDown className={cn('h-5 w-5 text-muted transition-transform', openQ && 'rotate-180')} aria-hidden="true" />
        </button>
        {openQ && (
          <div id="quantica-conteudo" className="border-t border-line px-5 pb-6 pt-5 sm:px-6">
            <p className="text-[15px] text-onix/85">{quantumEducation.intro}</p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {quantumEducation.sections.map((s) => (
                <div key={s.heading} className="rounded-xl bg-marfim p-4">
                  <p className="font-serif text-xl font-semibold">{s.heading}</p>
                  <p className="mt-1 text-[14px] text-onix/80">{s.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
