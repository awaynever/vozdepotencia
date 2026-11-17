import { useMemo, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Info, RotateCcw } from 'lucide-react'
import { Badge, Button, Card, PageHeader, ProgressBar, SectionHeader } from '@/components/ui/primitives'
import { Modal } from '@/components/ui/Modal'
import { Icon } from '@/components/ui/Icon'
import { PowerRadar } from '@/components/charts/PowerRadar'
import { Lines } from '@/components/charts/charts'
import { useAppStore } from '@/store/useAppStore'
import { assessmentQuestions, dimensionInsights, dimensions, scaleLabels } from '@/mocks/assessments'
import { averageScore, computeAssessmentScores, rankDimensions, scoreBand } from '@/services/progressService'
import { formatShort } from '@/utils/date'
import { toast } from '@/store/useToastStore'
import { cn } from '@/utils/cn'
import type { DimensionId } from '@/types'

const recommendationLinks: Record<DimensionId, { label: string; to: string }> = {
  comunicacao: { label: 'Academia da Voz', to: '/app/academia' },
  autoconfianca: { label: 'Dia 3 · Inseguranças', to: '/app/jornada/3' },
  'inteligencia-emocional': { label: 'Ritual: Redirecione sua atenção', to: '/app/rituais/rit-atencao' },
  autonomia: { label: 'Guia de negociação feminina', to: '/app/biblioteca/lib-negociacao' },
  disciplina: { label: 'Ritual: Planejamento semanal', to: '/app/rituais/rit-semana' },
  lideranca: { label: 'Simulações de Liderança', to: '/app/laboratorio?categoria=Lideran%C3%A7a' },
  limites: { label: 'Cards: Como dizer não', to: '/app/respostas?categoria=Como%20dizer%20n%C3%A3o' },
  energia: { label: 'Ritual: Descanse sem culpa', to: '/app/rituais/rit-descanso' },
}

export default function PowerMap() {
  const assessments = useAppStore((s) => s.assessments)
  const saveAssessment = useAppStore((s) => s.saveAssessment)
  const log = useAppStore((s) => s.activityLog)
  const [open, setOpen] = useState(false)
  const [answers, setAnswers] = useState<Record<string, number>>({})

  const initial = assessments[0]
  const current = assessments[assessments.length - 1]
  const ranking = rankDimensions(current.scores)
  const complete = assessmentQuestions.every((q) => answers[q.id])

  const history = useMemo(
    () => assessments.map((a) => ({ data: formatShort(a.date), Comunicação: a.scores.comunicacao, Autoconfiança: a.scores.autoconfianca, Limites: a.scores.limites, Média: averageScore(a.scores) })),
    [assessments],
  )

  const practiced = useMemo(() => {
    const counts = new Map<DimensionId, number>()
    for (const e of log) if (e.skill) counts.set(e.skill, (counts.get(e.skill) ?? 0) + 1)
    const max = Math.max(1, ...counts.values())
    return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([id, n]) => ({ id, n, pct: (n / max) * 100 }))
  }, [log])

  const submit = () => {
    const scores = computeAssessmentScores(answers)
    saveAssessment(scores, `Reavaliação ${assessments.length}`)
    setOpen(false)
    setAnswers({})
    toast('Seu Mapa da Potência foi atualizado', 'success')
  }

  return (
    <div>
      <PageHeader
        eyebrow="Autopercepção em oito dimensões"
        title="Mapa da Potência"
        description="Compare sua avaliação inicial com o momento atual e descubra onde concentrar sua energia."
        actions={<Button onClick={() => setOpen(true)}><RotateCcw className="h-4 w-4" aria-hidden="true" /> Refazer avaliação</Button>}
      />

      <div className="grid gap-5 lg:grid-cols-[1.25fr_1fr]">
        <Card className="p-4 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-[24px]">Inicial × Atual</h2>
            <span className="text-[12px] text-muted">{formatShort(initial.date)} → {formatShort(current.date)}</span>
          </div>
          <PowerRadar current={current.scores} initial={assessments.length > 1 ? initial.scores : undefined} height={380} />
        </Card>
        <div className="space-y-5">
          <Card className="bg-rubi p-6 text-marfim">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-champagne">Índice geral de autopercepção</p>
            <div className="mt-2 flex items-end gap-3">
              <p className="font-serif text-[64px] font-semibold leading-none">{averageScore(current.scores)}</p>
              {assessments.length > 1 && (
                <p className="mb-2 inline-flex items-center gap-1 text-[14px] font-semibold text-champagne">
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" /> {averageScore(current.scores) - averageScore(initial.scores)} pontos desde o início
                </p>
              )}
            </div>
          </Card>
          <Card className="p-5">
            <p className="mb-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-rubi">Áreas prioritárias</p>
            <ul className="space-y-3">
              {ranking.priorities.map((d) => {
                const dim = dimensions.find((x) => x.id === d)!
                return (
                  <li key={d} className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rubi-soft text-rubi"><Icon name={dim.icon} className="h-4 w-4" /></span>
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold">{dim.name} <span className="text-rubi">· {current.scores[d]}</span></p>
                      <p className="text-[12.5px] text-muted">{dimensionInsights[d].growth}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </Card>
        </div>
      </div>

      <section className="mt-10">
        <SectionHeader eyebrow="Indicadores" title="Cada dimensão" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {dimensions.map((d) => {
            const now = current.scores[d.id]
            const delta = now - initial.scores[d.id]
            return (
              <Card key={d.id} className="p-4">
                <div className="flex items-center justify-between">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-champagne-soft text-champagne-ink"><Icon name={d.icon} className="h-4 w-4" /></span>
                  {assessments.length > 1 && delta !== 0 && (
                    <span className={cn('inline-flex items-center text-[12px] font-semibold', delta > 0 ? 'text-sucesso' : 'text-alerta')}>
                      {delta > 0 ? <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" /> : <ArrowDownRight className="h-3.5 w-3.5" aria-hidden="true" />}
                      {delta > 0 ? '+' : ''}{delta}
                    </span>
                  )}
                </div>
                <p className="mt-3 text-[13.5px] font-semibold">{d.name}</p>
                <p className="font-serif text-[34px] font-semibold leading-none">{now}</p>
                <ProgressBar value={now} className="mt-2" label={`${d.name}: ${now} de 100`} />
                <p className="mt-1.5 text-[11.5px] text-muted">{scoreBand(now)}</p>
              </Card>
            )
          })}
        </div>
      </section>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <h2 className="text-[24px]">Histórico de avaliações</h2>
          <Lines data={history} xKey="data" domain={[0, 100]} keys={[{ key: 'Média', label: 'Média geral' }, { key: 'Comunicação', label: 'Comunicação' }, { key: 'Autoconfiança', label: 'Autoconfiança' }, { key: 'Limites', label: 'Limites' }]} height={240} />
          <ul className="mt-3 divide-y divide-line text-[13px]">
            {[...assessments].reverse().map((a) => (
              <li key={a.id} className="flex items-center justify-between py-2">
                <span>{a.label}</span>
                <span className="text-muted">{formatShort(a.date)} · média {averageScore(a.scores)}</span>
              </li>
            ))}
          </ul>
        </Card>
        <div className="space-y-5">
          <Card className="p-5 sm:p-6">
            <h2 className="text-[24px]">Habilidades mais praticadas</h2>
            <ul className="mt-4 space-y-3">
              {practiced.map(({ id, n, pct }) => (
                <li key={id}>
                  <div className="mb-1 flex justify-between text-[13px]"><span className="font-medium">{dimensions.find((d) => d.id === id)?.name}</span><span className="text-muted">{n} práticas</span></div>
                  <ProgressBar value={pct} tone="gold" label={`${n} práticas`} />
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-5 sm:p-6">
            <h2 className="text-[24px]">Recomendações para você</h2>
            <ul className="mt-3 space-y-3">
              {ranking.priorities.map((d) => (
                <li key={d} className="rounded-xl bg-marfim p-3.5">
                  <p className="text-[13.5px]">{dimensionInsights[d].next}</p>
                  <Button to={recommendationLinks[d].to} variant="ghost" size="sm" className="-ml-2 mt-1 text-rubi">{recommendationLinks[d].label} →</Button>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <div className="mt-8 flex gap-3 rounded-xl border border-line bg-white p-4 text-[13px] text-muted" role="note">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-champagne-ink" aria-hidden="true" />
        <p>Os valores representam exclusivamente a sua autopercepção, registrada em questionários educacionais. Não são medidas clínicas nem avaliações objetivas de capacidade.</p>
      </div>

      <Modal
        open={open}
        onOpenChange={setOpen}
        size="lg"
        title="Refazer avaliação"
        description="24 perguntas de autopercepção. Os novos valores substituirão o seu mapa atual."
        footer={
          <>
            <span className="mr-auto self-center text-[12.5px] text-muted">{Object.keys(answers).length} de {assessmentQuestions.length}</span>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={submit} disabled={!complete}>Calcular meu mapa</Button>
          </>
        }
      >
        <div className="space-y-5">
          {dimensions.map((d) => (
            <fieldset key={d.id}>
              <legend className="mb-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-champagne-ink">{d.name}</legend>
              <div className="space-y-3">
                {assessmentQuestions.filter((q) => q.dimension === d.id).map((q) => (
                  <div key={q.id} className="rounded-xl border border-line bg-white p-3.5">
                    <p className="text-[14px] font-medium">{q.text}</p>
                    <div className="mt-2.5 grid grid-cols-5 gap-1" role="radiogroup" aria-label={q.text}>
                      {scaleLabels.map((l, i) => (
                        <button
                          key={l}
                          role="radio"
                          aria-checked={answers[q.id] === i + 1}
                          onClick={() => setAnswers((a) => ({ ...a, [q.id]: i + 1 }))}
                          className={cn('rounded-lg border px-1 py-1.5 text-[10.5px] font-semibold leading-tight sm:text-[11.5px]', answers[q.id] === i + 1 ? 'border-rubi bg-rubi text-white' : 'border-line hover:border-champagne')}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </fieldset>
          ))}
          <Badge tone="gold">Ferramenta educacional · não é diagnóstico</Badge>
        </div>
      </Modal>
    </div>
  )
}
