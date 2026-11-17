import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle2, Clock, Search, SlidersHorizontal } from 'lucide-react'
import { Badge, Chip, EmptyState, PageHeader, PremiumLock, ProgressBar, Segmented } from '@/components/ui/primitives'
import { useContentStore } from '@/store/useContentStore'
import { useAppStore } from '@/store/useAppStore'
import { useAccess } from '@/hooks/useProgress'
import { simulationCategories } from '@/mocks/simulations'
import type { Difficulty } from '@/types'

const difficulties: Difficulty[] = ['Iniciante', 'Intermediário', 'Avançado']

export default function Lab() {
  const [params, setParams] = useSearchParams()
  const simulations = useContentStore((s) => s.simulations).filter((s) => s.published)
  const results = useAppStore((s) => s.simulationResults)
  const { can } = useAccess()
  const [query, setQuery] = useState('')
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all')
  const [duration, setDuration] = useState<'all' | 'short' | 'long'>('all')
  const [status, setStatus] = useState<'all' | 'done' | 'todo'>('all')
  const category = params.get('categoria') ?? 'Todas'

  const doneIds = useMemo(() => new Set(results.map((r) => r.simulationId)), [results])
  const filtered = useMemo(
    () =>
      simulations.filter((s) => {
        if (category !== 'Todas' && s.category !== category) return false
        if (difficulty !== 'all' && s.difficulty !== difficulty) return false
        if (duration === 'short' && s.minutes > 4) return false
        if (duration === 'long' && s.minutes <= 4) return false
        if (status === 'done' && !doneIds.has(s.id)) return false
        if (status === 'todo' && doneIds.has(s.id)) return false
        if (query && !`${s.title} ${s.description} ${s.situation}`.toLowerCase().includes(query.toLowerCase())) return false
        return true
      }),
    [simulations, category, difficulty, duration, status, query, doneIds],
  )
  const doneCount = simulations.filter((s) => doneIds.has(s.id)).length

  return (
    <div>
      <PageHeader
        eyebrow="Pratique antes que aconteça"
        title="Laboratório Comportamental"
        description="Escolha uma situação real, decida como responderia e receba um feedback sobre clareza, assertividade, respeito e contexto."
      >
        <div className="mt-5 flex max-w-md items-center gap-4">
          <div className="flex-1">
            <ProgressBar value={(doneCount / Math.max(1, simulations.length)) * 100} label="Simulações concluídas" />
          </div>
          <p className="text-[13px] font-semibold"><span className="text-rubi">{doneCount}</span> de {simulations.length} concluídas</p>
        </div>
      </PageHeader>

      <div className="sticky top-16 z-20 -mx-4 mb-6 space-y-3 border-b border-line/60 bg-marfim/95 px-4 py-3 backdrop-blur lg:top-0 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" role="group" aria-label="Categorias">
          {['Todas', ...simulationCategories].map((c) => (
            <Chip key={c} active={category === c} onClick={() => setParams(c === 'Todas' ? {} : { categoria: c })}>{c}</Chip>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar situação" className="input h-10 py-0 pl-9" aria-label="Buscar simulações" />
          </div>
          <label className="sr-only" htmlFor="dif">Dificuldade</label>
          <select id="dif" value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty | 'all')} className="input h-10 w-auto py-0">
            <option value="all">Todas as dificuldades</option>
            {difficulties.map((d) => <option key={d}>{d}</option>)}
          </select>
          <label className="sr-only" htmlFor="dur">Duração</label>
          <select id="dur" value={duration} onChange={(e) => setDuration(e.target.value as typeof duration)} className="input h-10 w-auto py-0">
            <option value="all">Qualquer duração</option>
            <option value="short">Até 4 min</option>
            <option value="long">5 min ou mais</option>
          </select>
          <Segmented label="Status" value={status} onChange={setStatus} options={[{ value: 'all', label: 'Todas' }, { value: 'todo', label: 'A fazer' }, { value: 'done', label: 'Concluídas' }]} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<SlidersHorizontal className="h-8 w-8" />} title="Nenhuma simulação encontrada" description="Ajuste os filtros ou a busca para ver outras situações." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((s) => {
            const done = doneIds.has(s.id)
            const locked = !can('simulation', s.id)
            return (
              <Link key={s.id} to={`/app/laboratorio/${s.id}`} className="group card flex flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lift">
                <div className="relative h-40 overflow-hidden">
                  <img src={s.image} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-onix/60 to-transparent" />
                  <div className="absolute left-3 top-3 flex gap-1.5">
                    <Badge className="bg-white/90 text-onix">{s.category}</Badge>
                  </div>
                  {done && <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-sucesso px-2 py-0.5 text-[11px] font-semibold text-white"><CheckCircle2 className="h-3 w-3" aria-hidden="true" /> Concluída</span>}
                  {locked && <PremiumLock compact className="absolute bottom-3 right-3" />}
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="font-serif text-[22px] font-semibold leading-snug group-hover:text-rubi">{s.title}</p>
                  <p className="mt-1 flex-1 text-[13.5px] text-muted">{s.description}</p>
                  <div className="mt-4 flex items-center gap-3 text-[12px] text-muted">
                    <Badge tone={s.difficulty === 'Avançado' ? 'rubi' : s.difficulty === 'Intermediário' ? 'gold' : 'neutral'}>{s.difficulty}</Badge>
                    <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden="true" /> {s.minutes} min</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
