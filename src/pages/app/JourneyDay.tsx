import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, BookOpen, Check, CheckCircle2, Clock, Lightbulb, Lock, NotebookPen, Quote, Target } from 'lucide-react'
import { Badge, Button, Card } from '@/components/ui/primitives'
import { useAccess, useJourney } from '@/hooks/useProgress'
import { useAppStore } from '@/store/useAppStore'
import { pillars } from '@/mocks/method'
import { pointsRules } from '@/mocks/achievements'
import { toast } from '@/store/useToastStore'
import { today } from '@/utils/date'
import { cn } from '@/utils/cn'
import NotFound from '../NotFound'

const pillarSkill = { P: 'comunicacao', O: 'comunicacao', T: 'inteligencia-emocional', E: 'energia', N: 'lideranca', C: 'autoconfianca', I: 'autoconfianca', A: 'autonomia' } as const

export default function JourneyDayPage() {
  const params = useParams()
  const dayNum = Number(params.day)
  const { journey, completedDays } = useJourney()
  const { can } = useAccess()
  const completeDay = useAppStore((s) => s.completeJourneyDay)
  const completeMission = useAppStore((s) => s.completeMission)
  const saveJournal = useAppStore((s) => s.saveJournal)
  const missionsDone = useAppStore((s) => s.missionsDone)
  const [steps, setSteps] = useState<number[]>([])
  const [reflection, setReflection] = useState('')
  const [savedReflection, setSavedReflection] = useState(false)

  const day = journey.days.find((d) => d.day === dayNum)
  if (!day) return <NotFound inApp />

  const done = completedDays.includes(day.day)
  const pillar = pillars.find((p) => p.id === day.pillar)
  const phase = journey.phases.find((p) => p.id === day.phase)
  const missionId = `jornada-dia-${day.day}`
  const missionDone = missionsDone.some((m) => m.id === missionId && m.date === today())
  const prev = journey.days.find((d) => d.day === day.day - 1)
  const next = journey.days.find((d) => d.day === day.day + 1)
  const supportLink = day.support.libraryId
    ? `/app/biblioteca/${day.support.libraryId}`
    : day.support.ritualId
      ? `/app/rituais/${day.support.ritualId}`
      : `/app/respostas?categoria=${encodeURIComponent(day.support.cardCategory ?? '')}`

  if (!can('journeyDay', day.day)) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <Lock className="mx-auto h-10 w-10 text-champagne-ink" aria-hidden="true" />
        <h1 className="mt-4 text-[36px]">Dia {day.day}: {day.title}</h1>
        <p className="mt-2 text-muted">No plano Gratuito, os três primeiros dias da jornada estão disponíveis. Conheça o Experience para acessar a jornada completa.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button to="/app/planos">Conhecer os planos</Button>
          <Button to="/app/jornada" variant="outline">Voltar à jornada</Button>
        </div>
      </div>
    )
  }

  return (
    <article className="mx-auto max-w-3xl">
      <Link to="/app/jornada" className="mb-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted hover:text-rubi">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Minha Jornada
      </Link>

      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="rubi">Fase {day.phase} · {phase?.name}</Badge>
          {pillar && <Badge tone="gold">Pilar {pillar.letter} · {pillar.name}</Badge>}
          <span className="inline-flex items-center gap-1 text-[12.5px] text-muted"><Clock className="h-3.5 w-3.5" aria-hidden="true" /> {day.minutes} min</span>
          {done && <Badge tone="success"><Check className="h-3 w-3" aria-hidden="true" /> Concluído</Badge>}
        </div>
        <p className="mt-5 font-serif text-[22px] text-champagne-ink">Dia {day.day} de {journey.totalDays}</p>
        <h1 className="mt-1 text-[38px] leading-[1.05] sm:text-[50px]">{day.title}</h1>
        <p className="mt-4 text-[17px] leading-relaxed text-onix/80">{day.intro}</p>
      </header>

      <div className="space-y-6">
        <section className="prose-vp" aria-labelledby="conteudo-dia">
          <h2 id="conteudo-dia" className="mb-3 flex items-center gap-2 text-[26px]"><BookOpen className="h-5 w-5 text-champagne-ink" aria-hidden="true" /> Conteúdo</h2>
          {day.content.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </section>

        <Card className="border-l-4 border-l-champagne p-5 sm:p-6">
          <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-champagne-ink"><Quote className="h-4 w-4" aria-hidden="true" /> Exemplo do cotidiano</p>
          <p className="mt-2 text-[15px] leading-relaxed">{day.example}</p>
        </Card>

        <Card className="p-5 sm:p-6">
          <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-rubi"><Lightbulb className="h-4 w-4" aria-hidden="true" /> Exercício</p>
          <h3 className="mt-1 text-2xl">{day.exercise.title}</h3>
          <ol className="mt-4 space-y-2">
            {day.exercise.steps.map((s, i) => {
              const on = steps.includes(i)
              return (
                <li key={i}>
                  <button
                    onClick={() => setSteps((c) => (on ? c.filter((x) => x !== i) : [...c, i]))}
                    aria-pressed={on}
                    className="flex w-full items-start gap-3 rounded-xl bg-marfim p-3.5 text-left text-[14.5px] transition-colors hover:bg-bege/60"
                  >
                    <span className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold', on ? 'bg-rubi text-white' : 'bg-white text-onix ring-1 ring-line')}>
                      {on ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : i + 1}
                    </span>
                    <span className={cn(on && 'text-muted')}>{s}</span>
                  </button>
                </li>
              )
            })}
          </ol>
        </Card>

        <Card className="overflow-hidden bg-rubi p-5 text-marfim sm:p-6">
          <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-champagne"><Target className="h-4 w-4" aria-hidden="true" /> Missão prática</p>
          <h3 className="mt-1 text-2xl text-marfim">{day.mission.title}</h3>
          <p className="mt-1.5 text-[14.5px] text-marfim/80">{day.mission.description}</p>
          <div className="mt-4">
            {missionDone ? (
              <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-champagne"><CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Missão registrada hoje</span>
            ) : (
              <Button variant="gold" size="sm" onClick={() => completeMission(missionId, day.mission.title)}>Registrar missão realizada (+{pointsRules.missao})</Button>
            )}
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-champagne-ink"><NotebookPen className="h-4 w-4" aria-hidden="true" /> Pergunta de reflexão</p>
          <p className="mt-2 font-serif text-[24px] italic leading-snug">{day.reflection}</p>
          <label htmlFor="reflexao" className="sr-only">Sua reflexão</label>
          <textarea id="reflexao" value={reflection} onChange={(e) => setReflection(e.target.value)} rows={4} className="input mt-4 resize-y" placeholder="Escreva livremente. Você pode salvar no seu Diário." />
          <div className="mt-3 flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              disabled={!reflection.trim() || savedReflection}
              onClick={() => {
                saveJournal({ date: today(), title: `Reflexão · Dia ${day.day}`, content: `${day.reflection}\n\n${reflection.trim()}`, mood: 'tranquila', categories: ['Reflexões'], favorite: false })
                setSavedReflection(true)
                toast('Reflexão salva no Diário', 'success')
              }}
            >
              {savedReflection ? 'Salvo no Diário' : 'Salvar no Diário'}
            </Button>
          </div>
        </Card>

        <Link to={supportLink} className="card flex items-center justify-between gap-4 p-5 transition-colors hover:border-champagne">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-champagne-ink">Material de apoio</p>
            <p className="mt-0.5 font-serif text-xl font-semibold">{day.support.title}</p>
          </div>
          <ArrowRight className="h-5 w-5 text-rubi" aria-hidden="true" />
        </Link>

        <motion.div layout className="rounded-2xl border border-line bg-white p-6 text-center">
          {done ? (
            <>
              <CheckCircle2 className="mx-auto h-10 w-10 text-sucesso" aria-hidden="true" />
              <p className="mt-2 font-serif text-2xl font-semibold">Atividade concluída</p>
              <p className="text-[13.5px] text-muted">Você pode revisitar este dia sempre que quiser.</p>
            </>
          ) : (
            <>
              <p className="font-serif text-2xl font-semibold">Pronta para concluir o Dia {day.day}?</p>
              <p className="mt-1 text-[13.5px] text-muted">Você ganha {pointsRules.atividade} pontos de evolução e avança na jornada.</p>
              <Button
                size="lg"
                className="mt-4"
                onClick={() => completeDay(day.day, day.title, day.minutes, pillarSkill[day.pillar])}
              >
                <Check className="h-4 w-4" aria-hidden="true" /> Concluir atividade
              </Button>
            </>
          )}
        </motion.div>
      </div>

      <nav className="mt-10 flex items-center justify-between gap-3 border-t border-line pt-6" aria-label="Navegação entre dias">
        {prev ? (
          <Link to={`/app/jornada/${prev.day}`} className="group flex max-w-[45%] items-center gap-2 text-left">
            <ArrowLeft className="h-4 w-4 shrink-0 text-muted group-hover:text-rubi" aria-hidden="true" />
            <span className="min-w-0"><span className="block text-[11.5px] text-muted">Dia {prev.day}</span><span className="block truncate text-[13.5px] font-semibold group-hover:text-rubi">{prev.title}</span></span>
          </Link>
        ) : <span />}
        {next ? (
          <Link to={`/app/jornada/${next.day}`} className="group flex max-w-[45%] items-center gap-2 text-right">
            <span className="min-w-0"><span className="block text-[11.5px] text-muted">Dia {next.day}</span><span className="block truncate text-[13.5px] font-semibold group-hover:text-rubi">{next.title}</span></span>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted group-hover:text-rubi" aria-hidden="true" />
          </Link>
        ) : <span />}
      </nav>
    </article>
  )
}
