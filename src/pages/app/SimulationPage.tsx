import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Clock, Info, Lightbulb, Lock, PenLine, RotateCcw, ShieldAlert } from 'lucide-react'
import { Badge, Button, Card, DemoNotice } from '@/components/ui/primitives'
import { useContentStore } from '@/store/useContentStore'
import { useAppStore } from '@/store/useAppStore'
import { useAccess } from '@/hooks/useProgress'
import { cn } from '@/utils/cn'
import NotFound from '../NotFound'

const styleLabels: Record<string, string> = {
  passiva: 'Resposta passiva',
  reativa: 'Resposta reativa',
  assertiva: 'Resposta assertiva',
  evasiva: 'Resposta evasiva',
  colaborativa: 'Resposta colaborativa',
}

const selfChecks = [
  'Falei em primeira pessoa ("eu sinto", "eu preciso").',
  'Descrevi fatos, sem rótulos ou acusações.',
  'Fiz um pedido ou proposta concreta.',
  'Mantive o respeito pela outra pessoa.',
  'Considerei se o contexto era seguro para essa resposta.',
]

function Score({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-[12.5px]"><span className="font-medium">{label}</span><span className="font-semibold text-rubi">{value}/5</span></div>
      <div className="mt-1.5 flex gap-1" role="img" aria-label={`${label}: ${value} de 5`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={cn('h-2 flex-1 rounded-full', i <= value ? 'bg-rubi' : 'bg-bege')} />
        ))}
      </div>
    </div>
  )
}

export default function SimulationPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const simulations = useContentStore((s) => s.simulations)
  const cards = useContentStore((s) => s.responseCards)
  const results = useAppStore((s) => s.simulationResults)
  const complete = useAppStore((s) => s.completeSimulation)
  const { can } = useAccess()
  const [choice, setChoice] = useState<string | null>(null)
  const [custom, setCustom] = useState('')
  const [customSubmitted, setCustomSubmitted] = useState(false)
  const [checks, setChecks] = useState<number[]>([])

  const sim = simulations.find((s) => s.id === id)
  if (!sim) return <NotFound inApp />

  const previous = results.find((r) => r.simulationId === sim.id)
  const option = sim.options.find((o) => o.id === choice)
  const showFeedback = !!option || (choice === 'custom' && customSubmitted)
  const relatedCards = cards.filter((c) => c.simulationId === sim.id).slice(0, 2)
  const idx = simulations.findIndex((s) => s.id === sim.id)
  const nextSim = simulations[(idx + 1) % simulations.length]

  const select = (optId: string) => {
    if (showFeedback) return
    setChoice(optId)
    if (optId !== 'custom') complete(sim.id, sim.title, sim.category, optId)
  }

  const reset = () => {
    setChoice(null)
    setCustom('')
    setCustomSubmitted(false)
    setChecks([])
  }

  if (!can('simulation', sim.id)) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <Lock className="mx-auto h-10 w-10 text-champagne-ink" aria-hidden="true" />
        <h1 className="mt-4 text-[34px]">{sim.title}</h1>
        <p className="mt-2 text-muted">Esta simulação faz parte do plano Experience. No plano Gratuito, algumas simulações estão liberadas para você experimentar.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Button to="/app/planos">Conhecer os planos</Button>
          <Button to="/app/laboratorio" variant="outline">Voltar ao Laboratório</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/app/laboratorio" className="mb-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted hover:text-rubi">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Laboratório
      </Link>

      <div className="relative overflow-hidden rounded-3xl">
        <img src={sim.image} alt="" className="h-56 w-full object-cover sm:h-72" />
        <div className="absolute inset-0 bg-gradient-to-t from-onix/95 via-onix/65 to-onix/20" />
        <div className="absolute inset-x-5 bottom-5 sm:inset-x-8 sm:bottom-7">
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-white/90 text-onix">{sim.category}</Badge>
            <Badge className="bg-champagne text-onix">{sim.difficulty}</Badge>
            <span className="inline-flex items-center gap-1 rounded-full bg-onix/60 px-2 py-0.5 text-[12px] text-marfim"><Clock className="h-3.5 w-3.5" aria-hidden="true" /> {sim.minutes} min</span>
            {previous && <Badge tone="success">Já concluída</Badge>}
          </div>
          <h1 className="mt-2 text-[32px] text-marfim sm:text-[42px]">Situação: {sim.title}</h1>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <Card className="p-5 sm:p-6">
            <p className="text-[16px] leading-relaxed">{sim.situation}</p>
            <p className="mt-5 font-serif text-2xl font-semibold">{sim.question}</p>
            <div className="mt-4 space-y-2.5" role="radiogroup" aria-label="Alternativas de resposta">
              {sim.options.map((o, i) => {
                const selected = choice === o.id
                return (
                  <button
                    key={o.id}
                    role="radio"
                    aria-checked={selected}
                    disabled={showFeedback && !selected}
                    onClick={() => select(o.id)}
                    className={cn(
                      'flex w-full items-start gap-3 rounded-xl border p-4 text-left text-[14.5px] transition-all',
                      selected ? 'border-rubi bg-rubi-soft' : 'border-line bg-white hover:border-champagne',
                      showFeedback && !selected && 'opacity-50',
                    )}
                  >
                    <span className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold', selected ? 'bg-rubi text-white' : 'bg-bege')}>{String.fromCharCode(65 + i)}</span>
                    <span className="pt-0.5">{o.text}</span>
                  </button>
                )
              })}
              <div className={cn('rounded-xl border p-4 transition-all', choice === 'custom' ? 'border-rubi bg-rubi-soft' : 'border-line bg-white', showFeedback && choice !== 'custom' && 'opacity-50')}>
                <button role="radio" aria-checked={choice === 'custom'} disabled={showFeedback} onClick={() => select('custom')} className="flex w-full items-start gap-3 text-left text-[14.5px]">
                  <span className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold', choice === 'custom' ? 'bg-rubi text-white' : 'bg-bege')}>{String.fromCharCode(65 + sim.options.length)}</span>
                  <span className="inline-flex items-center gap-2 pt-0.5"><PenLine className="h-4 w-4" aria-hidden="true" /> Escreveria minha própria resposta</span>
                </button>
                {choice === 'custom' && !customSubmitted && (
                  <div className="mt-3">
                    <label htmlFor="custom" className="sr-only">Sua resposta</label>
                    <textarea id="custom" rows={3} value={custom} onChange={(e) => setCustom(e.target.value)} className="input" placeholder="Escreva exatamente o que você diria…" autoFocus />
                    <div className="mt-2 flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={reset}>Cancelar</Button>
                      <Button size="sm" disabled={custom.trim().length < 5} onClick={() => setCustomSubmitted(true)}>Ver orientações</Button>
                    </div>
                  </div>
                )}
                {choice === 'custom' && customSubmitted && <p className="mt-3 rounded-lg bg-white p-3 text-[14px] italic">“{custom}”</p>}
              </div>
            </div>
          </Card>
        </div>

        <aside className="space-y-4">
          <AnimatePresence mode="wait">
            {!showFeedback && (
              <motion.div key="hint" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Card className="p-5">
                  <p className="flex items-center gap-2 text-[13px] font-semibold"><Info className="h-4 w-4 text-champagne-ink" aria-hidden="true" /> Como funciona</p>
                  <p className="mt-2 text-[13.5px] text-muted">Escolha a alternativa mais próxima do que você faria de verdade, não a que parece "certa". O feedback mostra consequências possíveis e sugestões de melhoria.</p>
                  {previous && <p className="mt-3 text-[12.5px] text-muted">Você já fez esta simulação. Pode repetir quantas vezes quiser; os pontos são contabilizados apenas na primeira vez.</p>}
                </Card>
              </motion.div>
            )}
            {option && (
              <motion.div key="fb" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <Card className="p-5">
                  <Badge tone={option.style === 'assertiva' || option.style === 'colaborativa' ? 'success' : option.style === 'reativa' ? 'rubi' : 'warning'}>{styleLabels[option.style]}</Badge>
                  <p className="mt-3 text-[12px] font-semibold uppercase tracking-[0.12em] text-muted">Possíveis consequências</p>
                  <p className="mt-1 text-[14.5px]">{option.consequences}</p>
                  <div className="mt-5 space-y-3">
                    <Score label="Clareza da comunicação" value={option.clarity} />
                    <Score label="Assertividade" value={option.assertiveness} />
                    <Score label="Respeito" value={option.respect} />
                  </div>
                </Card>
                <Card className="p-5">
                  <p className="flex items-center gap-2 text-[13px] font-semibold"><Lightbulb className="h-4 w-4 text-champagne-ink" aria-hidden="true" /> Sugestão de melhoria</p>
                  <p className="mt-1.5 text-[14px]">{option.suggestion}</p>
                </Card>
              </motion.div>
            )}
            {choice === 'custom' && customSubmitted && (
              <motion.div key="custom-fb" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <DemoNotice>Respostas personalizadas não são analisadas automaticamente nesta versão. Use a lista abaixo para revisar sua própria resposta.</DemoNotice>
                <Card className="p-5">
                  <p className="text-[13px] font-semibold">Autoavaliação</p>
                  <ul className="mt-3 space-y-2">
                    {selfChecks.map((c, i) => {
                      const on = checks.includes(i)
                      return (
                        <li key={c}>
                          <button onClick={() => setChecks((x) => (on ? x.filter((y) => y !== i) : [...x, i]))} aria-pressed={on} className="flex w-full items-start gap-2.5 text-left text-[13.5px]">
                            <span className={cn('mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border', on ? 'border-rubi bg-rubi text-white' : 'border-line')}>{on && <Check className="h-3 w-3" aria-hidden="true" />}</span>
                            {c}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                  <Button className="mt-4 w-full" size="sm" disabled={!!previous && results.some((r) => r.simulationId === sim.id && r.customText === custom)} onClick={() => complete(sim.id, sim.title, sim.category, 'custom', custom)}>
                    Registrar prática
                  </Button>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </aside>
      </div>

      {showFeedback && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-6 grid gap-4 md:grid-cols-2">
          <Card className="p-5 sm:p-6">
            <p className="flex items-center gap-2 text-[13px] font-semibold"><ShieldAlert className="h-4 w-4 text-champagne-ink" aria-hidden="true" /> Contexto e segurança</p>
            <p className="mt-2 text-[14px] text-onix/85">{sim.context}</p>
          </Card>
          <Card className="bg-onix p-5 text-marfim sm:p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-champagne">Exemplo de resposta</p>
            <p className="mt-2 font-serif text-[22px] italic leading-snug">{sim.idealExample}</p>
          </Card>
          {relatedCards.length > 0 && (
            <Card className="p-5 md:col-span-2">
              <p className="text-[13px] font-semibold">Respostas poderosas relacionadas</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {relatedCards.map((c) => (
                  <Link key={c.id} to={`/app/respostas?card=${c.id}`} className="rounded-xl bg-marfim p-4 text-[14px] hover:bg-bege/60">
                    <span className="block text-[11.5px] font-semibold text-champagne-ink">{c.category}</span>
                    “{c.response}”
                  </Link>
                ))}
              </div>
            </Card>
          )}
          <div className="flex flex-wrap gap-3 md:col-span-2">
            <Button variant="outline" onClick={reset}><RotateCcw className="h-4 w-4" aria-hidden="true" /> Repetir exercício</Button>
            <Button onClick={() => { reset(); navigate(`/app/laboratorio/${nextSim.id}`) }}>Próxima simulação <ArrowRight className="h-4 w-4" aria-hidden="true" /></Button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
