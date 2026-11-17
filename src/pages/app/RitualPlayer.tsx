import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Check, CheckCircle2, ChevronLeft, ChevronRight, Lock, Pause, Play, RotateCcw } from 'lucide-react'
import { Badge, Button, Card, DemoTag, FavoriteButton, ProgressBar } from '@/components/ui/primitives'
import { useContentStore } from '@/store/useContentStore'
import { useAppStore } from '@/store/useAppStore'
import { useAccess } from '@/hooks/useProgress'
import { formatShort } from '@/utils/date'
import { cn } from '@/utils/cn'
import { RitualCover } from './Rituals'
import NotFound from '../NotFound'

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

export default function RitualPlayer() {
  const { id } = useParams()
  const ritual = useContentStore((s) => s.rituals.find((r) => r.id === id))
  const favorites = useAppStore((s) => s.favorites.rituals)
  const toggleFavorite = useAppStore((s) => s.toggleFavorite)
  const done = useAppStore((s) => s.ritualsDone)
  const completeRitual = useAppStore((s) => s.completeRitual)
  const { can } = useAccess()
  const [pos, setPos] = useState({ step: 0, remaining: ritual?.steps[0]?.seconds ?? 0, finished: false })
  const [playing, setPlaying] = useState(false)
  const { step, remaining, finished } = pos

  const running = playing && !finished
  useEffect(() => {
    if (!running || !ritual) return
    const t = setInterval(() => {
      setPos((p) => {
        if (p.finished) return p
        if (p.remaining > 1) return { ...p, remaining: p.remaining - 1 }
        if (p.step < ritual.steps.length - 1) return { step: p.step + 1, remaining: ritual.steps[p.step + 1].seconds, finished: false }
        return { ...p, remaining: 0, finished: true }
      })
    }, 1000)
    return () => clearInterval(t)
  }, [running, ritual])

  if (!ritual) return <NotFound inApp />
  if (!can('ritual', ritual.id)) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <Lock className="mx-auto h-10 w-10 text-champagne-ink" aria-hidden="true" />
        <h1 className="mt-4 text-[34px]">{ritual.title}</h1>
        <p className="mt-2 text-muted">Este ritual faz parte do plano Experience.</p>
        <Button to="/app/planos" className="mt-6">Conhecer os planos</Button>
      </div>
    )
  }

  const total = ritual.steps.reduce((a, s) => a + s.seconds, 0)
  const elapsed = ritual.steps.slice(0, step).reduce((a, s) => a + s.seconds, 0) + (ritual.steps[step].seconds - remaining)
  const history = done.filter((d) => d.id === ritual.id)
  const current = ritual.steps[step]

  const goTo = (i: number) => setPos({ step: i, remaining: ritual.steps[i].seconds, finished: false })
  const finish = () => setPos((p) => ({ ...p, remaining: 0, finished: true }))
  const restart = () => {
    goTo(0)
    setPlaying(false)
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/app/rituais" className="mb-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted hover:text-rubi">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Rituais de Energia
      </Link>

      <div className="relative h-56 overflow-hidden rounded-3xl sm:h-64">
        <RitualCover ritual={ritual} />
        <div className="absolute inset-0 bg-gradient-to-t from-onix/85 via-onix/30 to-transparent" />
        <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 sm:inset-x-8">
          <div>
            <Badge className="bg-white/90 text-onix">{ritual.category} · {ritual.minutes} min</Badge>
            <h1 className="mt-2 text-[32px] text-marfim sm:text-[42px]">{ritual.title}</h1>
          </div>
          <FavoriteButton active={favorites.includes(ritual.id)} onToggle={() => toggleFavorite('rituals', ritual.id)} light />
        </div>
      </div>
      <p className="mt-5 text-[16px] text-muted">{ritual.description}</p>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <Card className="overflow-hidden">
          <div className="bg-onix p-6 text-marfim sm:p-8">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-champagne">Etapa {step + 1} de {ritual.steps.length}</span>
              <DemoTag label="Player demonstrativo" className="border-champagne/40 text-champagne" />
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={finished ? 'end' : step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4 }} className="min-h-[170px] py-6" aria-live="polite">
                {finished ? (
                  <>
                    <CheckCircle2 className="h-9 w-9 text-champagne" aria-hidden="true" />
                    <p className="mt-3 font-serif text-[30px]">Ritual concluído.</p>
                    <p className="mt-1 text-marfim/70">Perceba como você está agora. Leve essa sensação para o próximo momento do seu dia.</p>
                  </>
                ) : (
                  <>
                    <p className="font-serif text-[30px] leading-tight sm:text-[36px]">{current.title}</p>
                    <p className="mt-3 text-[16px] leading-relaxed text-marfim/80">{current.text}</p>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
            <ProgressBar value={finished ? 100 : (elapsed / total) * 100} tone="light" label="Progresso do ritual" />
            <div className="mt-2 flex justify-between text-[12px] tabular-nums text-marfim/60">
              <span>{fmt(finished ? total : elapsed)}</span>
              <span>{finished ? 'concluído' : `${fmt(remaining)} nesta etapa`}</span>
              <span>{fmt(total)}</span>
            </div>
            <div className="mt-5 flex items-center justify-center gap-4">
              <button onClick={() => step > 0 && goTo(step - 1)} disabled={step === 0 || finished} className="rounded-full p-2 hover:bg-white/10 disabled:opacity-30" aria-label="Etapa anterior"><ChevronLeft className="h-6 w-6" aria-hidden="true" /></button>
              {finished ? (
                <button onClick={restart} className="flex h-14 w-14 items-center justify-center rounded-full bg-champagne text-onix" aria-label="Recomeçar"><RotateCcw className="h-6 w-6" aria-hidden="true" /></button>
              ) : (
                <button onClick={() => setPlaying((p) => !p)} className="flex h-14 w-14 items-center justify-center rounded-full bg-champagne text-onix shadow-soft" aria-label={running ? 'Pausar' : 'Iniciar'}>
                  {running ? <Pause className="h-6 w-6" aria-hidden="true" /> : <Play className="ml-0.5 h-6 w-6" aria-hidden="true" />}
                </button>
              )}
              <button
                onClick={() => (step < ritual.steps.length - 1 ? goTo(step + 1) : finish())}
                disabled={finished}
                className="rounded-full p-2 hover:bg-white/10 disabled:opacity-30"
                aria-label="Próxima etapa"
              >
                <ChevronRight className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
          <div className="p-5 text-center">
            {finished ? (
              <Button onClick={() => { completeRitual(ritual.id, ritual.title, ritual.minutes); restart() }}>
                <Check className="h-4 w-4" aria-hidden="true" /> Registrar ritual concluído
              </Button>
            ) : (
              <p className="text-[13px] text-muted">Leia o texto guiado no seu ritmo ou deixe o player avançar automaticamente.</p>
            )}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <p className="text-[13px] font-semibold">Texto guiado</p>
            <ol className="mt-3 space-y-1.5">
              {ritual.steps.map((s, i) => (
                <li key={s.title}>
                  <button onClick={() => goTo(i)} className={cn('flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-[13.5px] transition-colors', i === step && !finished ? 'bg-rubi-soft font-semibold text-rubi' : 'hover:bg-marfim')}>
                    <span className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold', i < step || finished ? 'bg-rubi text-white' : 'bg-bege')}>
                      {i < step || finished ? <Check className="h-3 w-3" aria-hidden="true" /> : i + 1}
                    </span>
                    <span className="flex-1">{s.title}</span>
                    <span className="text-[11.5px] text-muted">{fmt(s.seconds)}</span>
                  </button>
                </li>
              ))}
            </ol>
          </Card>
          <Card className="p-5">
            <p className="text-[13px] font-semibold">Histórico de conclusão</p>
            {history.length === 0 ? (
              <p className="mt-2 text-[13px] text-muted">Você ainda não concluiu este ritual.</p>
            ) : (
              <ul className="mt-2 space-y-1 text-[13px]">
                {[...history].reverse().slice(0, 6).map((h, i) => (
                  <li key={i} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-sucesso" aria-hidden="true" /> {formatShort(h.date)}</li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
