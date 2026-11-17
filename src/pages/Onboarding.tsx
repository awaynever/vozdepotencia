import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Clock, Info } from 'lucide-react'
import { Logo } from '@/components/ui/Logo'
import { Button, ProgressBar } from '@/components/ui/primitives'
import { PowerRadar } from '@/components/charts/PowerRadar'
import { assessmentQuestions, dimensionInsights, dimensions, onboardingGoals, scaleLabels } from '@/mocks/assessments'
import { journeys } from '@/mocks/journeys'
import { images } from '@/mocks/images'
import { useAppStore } from '@/store/useAppStore'
import { averageScore, computeAssessmentScores, rankDimensions } from '@/services/progressService'
import { cn } from '@/utils/cn'

const STEPS = ['Boas-vindas', 'Objetivos', 'Autopercepção', 'Tempo', 'Resultado'] as const
const timeOptions = [5, 10, 15, 20]

export default function Onboarding() {
  const navigate = useNavigate()
  const completeOnboarding = useAppStore((s) => s.completeOnboarding)
  const updateProfile = useAppStore((s) => s.updateProfile)
  const profile = useAppStore((s) => s.profile)

  const [step, setStep] = useState(0)
  const [name, setName] = useState(profile.firstName)
  const [goals, setGoals] = useState<string[]>([])
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [group, setGroup] = useState(0) // grupos de 3 perguntas (uma dimensão por tela)
  const [minutes, setMinutes] = useState<number | null>(null)

  const groups = useMemo(() => dimensions.map((d) => assessmentQuestions.filter((q) => q.dimension === d.id)), [])
  const currentGroup = groups[group]
  const groupComplete = currentGroup.every((q) => answers[q.id])
  const answeredCount = Object.keys(answers).length

  const scores = useMemo(() => computeAssessmentScores(answers), [answers])
  const ranking = useMemo(() => rankDimensions(scores), [scores])

  const progress = step === 2 ? ((2 + group / groups.length) / (STEPS.length - 1)) * 100 : (step / (STEPS.length - 1)) * 100

  const toggleGoal = (id: string) => setGoals((g) => (g.includes(id) ? g.filter((x) => x !== id) : g.length >= 3 ? g : [...g, id]))

  const next = () => {
    if (step === 2 && group < groups.length - 1) {
      setGroup(group + 1)
      return
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }
  const back = () => {
    if (step === 2 && group > 0) {
      setGroup(group - 1)
      return
    }
    setStep((s) => Math.max(0, s - 1))
  }

  const finish = () => {
    if (name.trim()) {
      const first = name.trim().split(' ')[0]
      updateProfile({ firstName: first })
    }
    completeOnboarding({ goals, answers, minutes: minutes ?? 10, scores, suggestedJourney: 'despertar-minha-voz' })
    navigate('/app')
  }

  const canNext = (step === 0 && name.trim().length > 0) || (step === 1 && goals.length > 0) || (step === 2 && groupComplete) || (step === 3 && minutes !== null)

  const goalLabels = goals.map((g) => onboardingGoals.find((x) => x.id === g)?.label).filter(Boolean)
  const nextJourney = goals.some((g) => ['liderar', 'vida-profissional'].includes(g)) ? journeys[1] : goals.some((g) => ['autonomia-financeira'].includes(g)) ? journeys[2] : null

  return (
    <div className="min-h-dvh bg-marfim">
      <header className="sticky top-0 z-20 border-b border-line/70 bg-marfim/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-5">
          <Link to="/" aria-label="Voltar para a página inicial">
            <Logo compact />
          </Link>
          <span className="text-[12px] font-medium text-muted">
            Etapa {step + 1} de {STEPS.length} · {STEPS[step]}
          </span>
        </div>
        <ProgressBar value={progress} className="h-1 rounded-none" label="Progresso do onboarding" />
      </header>

      <main className="mx-auto max-w-3xl px-5 py-10 sm:py-14">
        <AnimatePresence mode="wait">
          <motion.div key={`${step}-${step === 2 ? group : 0}`} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.35, ease: 'easeOut' }}>
            {step === 0 && (
              <section className="grid gap-10 md:grid-cols-[1fr_0.9fr] md:items-center">
                <div>
                  <p className="eyebrow mb-4">Boas-vindas</p>
                  <h1 className="text-[40px] leading-[1.02] sm:text-[52px]">Existe uma potência em você que merece ser reconhecida.</h1>
                  <p className="mt-5 font-serif text-2xl italic text-rubi">Vamos descobrir como fortalecê-la?</p>
                  <div className="mt-8 max-w-sm">
                    <label htmlFor="nome" className="mb-1.5 block text-[13px] font-semibold">Como você prefere ser chamada?</label>
                    <input id="nome" className="input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="given-name" />
                  </div>
                  <p className="mt-6 flex items-center gap-2 text-[13px] text-muted"><Clock className="h-4 w-4" aria-hidden="true" /> Leva cerca de 5 minutos.</p>
                </div>
                <img src={images.sorrisoAberto} alt="Mulher preta sorrindo, com expressão de confiança" className="aspect-[4/5] w-full rounded-3xl object-cover" />
              </section>
            )}

            {step === 1 && (
              <section>
                <p className="eyebrow mb-3">Seus objetivos</p>
                <h1 className="text-[36px] sm:text-[46px]">O que você deseja desenvolver?</h1>
                <p className="mt-3 text-muted">Escolha até três objetivos. Eles vão orientar suas recomendações.</p>
                <p className="mt-2 text-[13px] font-semibold text-rubi" aria-live="polite">{goals.length} de 3 selecionados</p>
                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {onboardingGoals.map((g) => {
                    const active = goals.includes(g.id)
                    const disabled = !active && goals.length >= 3
                    return (
                      <button
                        key={g.id}
                        onClick={() => toggleGoal(g.id)}
                        aria-pressed={active}
                        disabled={disabled}
                        className={cn(
                          'flex items-center justify-between gap-3 rounded-xl border px-4 py-4 text-left text-[14.5px] font-medium transition-all',
                          active ? 'border-rubi bg-rubi text-white shadow-soft' : 'border-line bg-white hover:border-champagne',
                          disabled && 'opacity-45',
                        )}
                      >
                        {g.label}
                        <span className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-full border', active ? 'border-champagne bg-champagne text-onix' : 'border-line')}>
                          {active && <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </section>
            )}

            {step === 2 && (
              <section>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="eyebrow">Autopercepção · {dimensions[group].name}</p>
                  <p className="text-[12px] text-muted">{answeredCount} de {assessmentQuestions.length} respostas</p>
                </div>
                <h1 className="mt-3 text-[32px] sm:text-[40px]">Com que frequência isso acontece com você?</h1>
                <p className="mt-2 text-sm text-muted">Responda pensando nos últimos meses. Não existem respostas certas ou erradas.</p>
                <div className="mt-8 space-y-6">
                  {currentGroup.map((q, qi) => (
                    <fieldset key={q.id} className="card p-5">
                      <legend className="sr-only">Pergunta {group * 3 + qi + 1}</legend>
                      <p className="text-[15.5px] font-medium leading-snug">
                        <span className="mr-2 font-serif text-xl text-champagne-ink">{group * 3 + qi + 1}.</span>
                        {q.text}
                      </p>
                      <div className="mt-4 grid grid-cols-5 gap-1.5 sm:gap-2" role="radiogroup" aria-label={q.text}>
                        {scaleLabels.map((label, i) => {
                          const value = i + 1
                          const selected = answers[q.id] === value
                          return (
                            <button
                              key={label}
                              role="radio"
                              aria-checked={selected}
                              onClick={() => setAnswers((a) => ({ ...a, [q.id]: value }))}
                              className={cn(
                                'flex flex-col items-center gap-1.5 rounded-xl border px-1 py-2.5 text-[10.5px] font-semibold leading-tight transition-all sm:text-[12px]',
                                selected ? 'border-rubi bg-rubi text-white' : 'border-line bg-marfim hover:border-champagne',
                              )}
                            >
                              <span className={cn('font-serif text-lg', selected ? 'text-champagne' : 'text-onix')}>{value}</span>
                              {label}
                            </button>
                          )
                        })}
                      </div>
                    </fieldset>
                  ))}
                </div>
              </section>
            )}

            {step === 3 && (
              <section>
                <p className="eyebrow mb-3">Seu ritmo</p>
                <h1 className="text-[36px] sm:text-[46px]">Quanto tempo você pode dedicar por dia?</h1>
                <p className="mt-3 text-muted">Você poderá alterar isso depois. Constância vale mais que intensidade.</p>
                <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {timeOptions.map((t) => (
                    <button
                      key={t}
                      onClick={() => setMinutes(t)}
                      aria-pressed={minutes === t}
                      className={cn('flex flex-col items-center rounded-2xl border px-4 py-7 transition-all', minutes === t ? 'border-rubi bg-rubi text-white shadow-soft' : 'border-line bg-white hover:border-champagne')}
                    >
                      <span className={cn('font-serif text-[48px] font-semibold leading-none', minutes === t ? 'text-champagne' : 'text-onix')}>{t}</span>
                      <span className="mt-1 text-[13px]">minutos por dia</span>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {step === 4 && (
              <section>
                <p className="eyebrow mb-3">Seu resultado</p>
                <h1 className="text-[36px] sm:text-[46px]">{name.split(' ')[0] || 'Você'}, este é o seu Mapa da Potência inicial.</h1>
                <p className="mt-3 text-muted">Índice geral de autopercepção: <strong className="text-rubi">{averageScore(scores)}/100</strong></p>
                <div className="mt-6 grid gap-5 md:grid-cols-[1.1fr_1fr]">
                  <div className="card p-3 sm:p-5">
                    <PowerRadar current={scores} height={320} currentLabel="Sua autopercepção" />
                  </div>
                  <div className="space-y-4">
                    <div className="card p-5">
                      <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-sucesso">Seus pontos fortes</p>
                      {ranking.strongest.map((d) => (
                        <div key={d} className="mt-3">
                          <p className="font-serif text-xl font-semibold">{dimensions.find((x) => x.id === d)?.name} · {scores[d]}</p>
                          <p className="text-[13px] text-muted">{dimensionInsights[d].strong}</p>
                        </div>
                      ))}
                    </div>
                    <div className="card p-5">
                      <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-rubi">Áreas prioritárias</p>
                      <ul className="mt-2 space-y-1.5">
                        {ranking.priorities.map((d) => (
                          <li key={d} className="flex items-center justify-between text-[14px]">
                            <span>{dimensions.find((x) => x.id === d)?.name}</span>
                            <span className="font-semibold text-rubi">{scores[d]}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-5 overflow-hidden rounded-2xl bg-rubi text-marfim sm:flex">
                  <img src={journeys[0].image} alt="" className="h-44 w-full object-cover sm:h-auto sm:w-56" />
                  <div className="p-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-champagne">Jornada sugerida</p>
                    <p className="mt-1 font-serif text-3xl">{journeys[0].title}</p>
                    <p className="mt-2 text-[14px] text-marfim/75">
                      Recomendada para os seus objetivos: {goalLabels.join(', ').toLowerCase() || 'fortalecer sua voz'}. São 21 dias, com cerca de {minutes ?? 10} minutos diários.
                    </p>
                    {nextJourney && <p className="mt-2 text-[12.5px] text-champagne">Em seguida: {nextJourney.title} (em breve)</p>}
                  </div>
                </div>

                <div className="mt-5 flex gap-3 rounded-xl border border-line bg-white p-4 text-[13px] text-muted" role="note">
                  <Info className="mt-0.5 h-4 w-4 shrink-0 text-champagne-ink" aria-hidden="true" />
                  <p>Este questionário é uma ferramenta educacional de autopercepção. Ele não é um diagnóstico psicológico nem mede capacidades de forma objetiva. Os resultados ficam salvos apenas neste navegador.</p>
                </div>
              </section>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 flex items-center justify-between gap-3">
          {step > 0 ? (
            <Button variant="ghost" onClick={back}>
              <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Voltar
            </Button>
          ) : (
            <Link to="/app" className="text-[13px] font-medium text-muted hover:text-rubi">Pular e ver a demonstração</Link>
          )}
          {step < 4 ? (
            <Button onClick={next} disabled={!canNext} size="lg">
              {step === 0 ? 'Começar' : 'Continuar'} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          ) : (
            <Button onClick={finish} size="lg">
              Iniciar minha jornada <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          )}
        </div>
      </main>
    </div>
  )
}
