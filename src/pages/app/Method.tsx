import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, BookOpen, Check, Dumbbell, Target } from 'lucide-react'
import { Badge, PageHeader, ProgressBar } from '@/components/ui/primitives'
import { pillars } from '@/mocks/method'
import { useJourney } from '@/hooks/useProgress'
import { cn } from '@/utils/cn'

export default function Method() {
  const [active, setActive] = useState(0)
  const { days, completedDays } = useJourney()
  const p = pillars[active]
  const progressOf = (ids: number[]) => Math.round((ids.filter((d) => completedDays.includes(d)).length / ids.length) * 100)

  return (
    <div>
      <PageHeader
        eyebrow="Metodologia autoral"
        title="Método POTÊNCIA"
        description="Oito pilares que organizam seu desenvolvimento. Uma estrutura educacional criada pela Voz de Potência para guiar conteúdos, exercícios e missões."
      />

      <div className="rounded-3xl bg-onix p-4 sm:p-6">
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-8 sm:gap-3" role="tablist" aria-label="Pilares">
          {pillars.map((pl, i) => {
            const prog = progressOf(pl.relatedDays)
            return (
              <button
                key={pl.id}
                role="tab"
                id={`tab-${pl.id}`}
                aria-selected={active === i}
                aria-controls="painel-pilar"
                onClick={() => setActive(i)}
                className={cn('relative flex aspect-[3/4] flex-col items-center justify-center rounded-2xl border transition-all', active === i ? 'border-champagne bg-rubi' : 'border-white/10 hover:border-champagne/50')}
              >
                <span className={cn('font-serif text-[40px] font-semibold leading-none sm:text-[54px]', active === i ? 'text-champagne' : 'text-marfim')}>{pl.letter}</span>
                <span className="mt-1 px-1 text-center text-[10.5px] font-medium leading-tight text-marfim/70">{pl.name}</span>
                <span className="absolute inset-x-3 bottom-2.5 h-0.5 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
                  <span className="block h-full bg-champagne" style={{ width: `${prog}%` }} />
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.section
          key={p.id}
          id="painel-pilar"
          role="tabpanel"
          aria-labelledby={`tab-${p.id}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
          className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]"
        >
          <div className="overflow-hidden rounded-3xl">
            <img src={p.image} alt="" className="h-72 w-full object-cover lg:h-full" />
          </div>
          <div className="space-y-5">
            <div>
              <p className="eyebrow">Pilar {p.letter}</p>
              <h2 className="mt-1 text-[42px]">{p.name}</h2>
              <p className="font-serif text-2xl italic text-rubi">{p.tagline}</p>
              <p className="mt-3 text-[15px] leading-relaxed text-onix/85">{p.description}</p>
            </div>
            <div className="card p-5">
              <div className="flex items-center justify-between text-[13px]">
                <span className="font-semibold">Seu progresso neste pilar</span>
                <span className="font-semibold text-rubi">{progressOf(p.relatedDays)}%</span>
              </div>
              <ProgressBar value={progressOf(p.relatedDays)} className="mt-2" label={`Progresso no pilar ${p.name}`} />
              <p className="mt-2 text-[12px] text-muted">Baseado nos dias da jornada ligados a este pilar.</p>
            </div>
            <div>
              <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-muted">Habilidades trabalhadas</p>
              <div className="flex flex-wrap gap-2">
                {p.skills.map((s) => <Badge key={s} tone="gold" className="px-3 py-1 text-[12.5px]">{s}</Badge>)}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="card p-5">
                <p className="mb-2 flex items-center gap-2 text-[13px] font-semibold"><BookOpen className="h-4 w-4 text-champagne-ink" aria-hidden="true" /> Conteúdos</p>
                <ul className="space-y-1.5 text-[13.5px]">
                  {p.contents.map((c) => (
                    <li key={c.title}>
                      {c.libraryId ? <Link to={`/app/biblioteca/${c.libraryId}`} className="text-rubi hover:underline">{c.title}</Link> : <span>{c.title}</span>}
                      <span className="ml-1 text-[11.5px] text-muted">· {c.type}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card p-5">
                <p className="mb-2 flex items-center gap-2 text-[13px] font-semibold"><Dumbbell className="h-4 w-4 text-champagne-ink" aria-hidden="true" /> Exercícios</p>
                <ul className="space-y-1.5 text-[13.5px]">
                  {p.exercises.map((e) => <li key={e}>{e}</li>)}
                </ul>
              </div>
              <div className="card p-5 sm:col-span-2">
                <p className="mb-2 flex items-center gap-2 text-[13px] font-semibold"><Target className="h-4 w-4 text-champagne-ink" aria-hidden="true" /> Missões e dias da jornada</p>
                <ul className="mb-3 space-y-1 text-[13.5px]">
                  {p.missions.map((m) => <li key={m}>{m}</li>)}
                </ul>
                <div className="flex flex-wrap gap-2">
                  {p.relatedDays.map((d) => {
                    const day = days.find((x) => x.day === d)
                    const done = completedDays.includes(d)
                    return (
                      <Link key={d} to={`/app/jornada/${d}`} className={cn('inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12.5px] font-medium', done ? 'border-sucesso/30 bg-sucesso-soft text-sucesso' : 'border-line hover:border-champagne')}>
                        {done && <Check className="h-3 w-3" aria-hidden="true" />} Dia {d}{day ? ` · ${day.title.slice(0, 28)}${day.title.length > 28 ? '…' : ''}` : ''}
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
            <Link to={`/app/jornada/${p.relatedDays[0]}`} className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-rubi hover:underline">
              Praticar este pilar <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </motion.section>
      </AnimatePresence>

      <p className="mt-10 text-[12.5px] text-muted">O Método POTÊNCIA é uma estrutura educacional autoral. Ele organiza práticas reconhecidas de comunicação e desenvolvimento pessoal e não reivindica validação científica específica.</p>
    </div>
  )
}
