import { Link } from 'react-router-dom'
import { ArrowRight, Check, Clock, Flag, Lock } from 'lucide-react'
import { Badge, Button, PageHeader, ProgressBar, ProgressRing } from '@/components/ui/primitives'
import { useAccess, useJourney } from '@/hooks/useProgress'
import { journeys } from '@/mocks/journeys'
import { pillars } from '@/mocks/method'
import { cn } from '@/utils/cn'

export default function Journey() {
  const { journey, completedDays, currentDay, percent } = useJourney()
  const { can } = useAccess()

  return (
    <div>
      <PageHeader
        eyebrow="Minha Jornada"
        title={journey.title}
        description={journey.subtitle}
        actions={<Button to={`/app/jornada/${currentDay}`}>Continuar no Dia {currentDay} <ArrowRight className="h-4 w-4" aria-hidden="true" /></Button>}
      />

      <div className="mb-10 grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
        <div className="card flex items-center gap-5 p-5">
          <ProgressRing value={percent} size={78} stroke={6}>
            <span className="font-serif text-xl font-semibold">{percent}%</span>
          </ProgressRing>
          <div>
            <p className="font-serif text-2xl font-semibold">{completedDays.length} de {journey.totalDays} dias</p>
            <p className="text-[13px] text-muted">Avance no seu ritmo. Nenhum conteúdo é bloqueado por ausência.</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {journey.phases.map((ph) => {
            const ds = journey.days.filter((d) => d.phase === ph.id)
            const done = ds.filter((d) => completedDays.includes(d.day)).length
            return (
              <div key={ph.id} className="card p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-champagne-ink">Fase {ph.id}</p>
                <p className="font-serif text-xl font-semibold">{ph.name}</p>
                <ProgressBar value={(done / ds.length) * 100} className="mt-2" label={`Progresso da fase ${ph.name}`} />
                <p className="mt-1 text-[11.5px] text-muted">{done}/{ds.length} dias</p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="space-y-12">
        {journey.phases.map((ph) => (
          <section key={ph.id} aria-labelledby={`fase-${ph.id}`}>
            <div className="mb-5 flex items-end gap-4">
              <span className="font-serif text-[64px] font-semibold leading-none text-champagne">0{ph.id}</span>
              <div>
                <h2 id={`fase-${ph.id}`} className="text-[30px]">{ph.name}</h2>
                <p className="text-[13px] text-muted">{ph.subtitle} · {ph.description}</p>
              </div>
            </div>
            <ol className="relative ml-4 space-y-3 border-l border-line pl-6 sm:ml-6 sm:pl-8">
              {journey.days.filter((d) => d.phase === ph.id).map((d) => {
                const done = completedDays.includes(d.day)
                const current = d.day === currentDay && !done
                const locked = !can('journeyDay', d.day)
                const isCheckpoint = d.day % 7 === 0
                const pillar = pillars.find((p) => p.id === d.pillar)
                return (
                  <li key={d.day} className="relative">
                    <span
                      className={cn(
                        'absolute -left-[37px] top-5 flex h-6 w-6 items-center justify-center rounded-full border-2 sm:-left-[45px]',
                        done ? 'border-rubi bg-rubi text-white' : current ? 'border-rubi bg-white' : 'border-line bg-marfim',
                      )}
                      aria-hidden="true"
                    >
                      {done ? <Check className="h-3.5 w-3.5" /> : current ? <span className="h-2 w-2 rounded-full bg-rubi" /> : null}
                    </span>
                    <Link
                      to={`/app/jornada/${d.day}`}
                      className={cn(
                        'group flex flex-col gap-3 rounded-2xl border bg-white p-4 transition-all hover:border-champagne hover:shadow-soft sm:flex-row sm:items-center sm:p-5',
                        current ? 'border-rubi shadow-soft' : 'border-line',
                      )}
                    >
                      <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-marfim">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">Dia</span>
                        <span className="font-serif text-2xl font-semibold leading-none">{d.day}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          {done && <Badge tone="success">Concluído</Badge>}
                          {current && <Badge tone="rubi">Hoje</Badge>}
                          {isCheckpoint && <Badge tone="gold"><Flag className="h-3 w-3" aria-hidden="true" /> Checkpoint</Badge>}
                          {pillar && <span className="text-[11.5px] text-muted">Pilar {pillar.letter} · {pillar.name}</span>}
                        </div>
                        <p className="mt-1 font-serif text-[21px] font-semibold leading-snug group-hover:text-rubi">{d.title}</p>
                        <p className="mt-0.5 line-clamp-1 text-[13px] text-muted">{d.mission.title} · {d.exercise.title}</p>
                      </div>
                      <div className="flex items-center gap-3 text-[12.5px] text-muted">
                        <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" aria-hidden="true" />{d.minutes} min</span>
                        {locked ? <Lock className="h-4 w-4 text-champagne-ink" aria-label="Disponível no plano Experience" /> : <ArrowRight className="h-4 w-4 text-rubi transition-transform group-hover:translate-x-0.5" aria-hidden="true" />}
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ol>
          </section>
        ))}
      </div>

      <section className="mt-14">
        <h2 className="mb-4 text-[28px]">Próximas jornadas</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {journeys.slice(1).map((j) => (
            <div key={j.id} className="relative overflow-hidden rounded-2xl">
              <img src={j.image} alt="" className="h-48 w-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-onix/90 to-onix/10" />
              <div className="absolute inset-x-5 bottom-5 text-marfim">
                <Badge tone="dark" className="bg-champagne text-onix">Em breve · Clube</Badge>
                <p className="mt-2 font-serif text-2xl font-semibold">{j.title}</p>
                <p className="text-[13px] text-marfim/75">{j.subtitle} · {j.totalDays} dias</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
