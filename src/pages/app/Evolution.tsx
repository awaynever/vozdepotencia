import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Award, BookOpen, CalendarCheck, Clock, Flame, FlaskConical, Lock, Mic, NotebookPen, Route, Sparkles, Trophy } from 'lucide-react'
import { Badge, Card, DemoNotice, PageHeader, ProgressBar, Segmented, SectionHeader, Stat } from '@/components/ui/primitives'
import { Icon } from '@/components/ui/Icon'
import { Donut, Lines, SimpleBars, StackedBars } from '@/components/charts/charts'
import { palette } from '@/components/charts/palette'
import { useAppStore } from '@/store/useAppStore'
import { useAccess, useJourney, useStats } from '@/hooks/useProgress'
import { computeStats, filterLog, averageScore, type RangeFilter } from '@/services/progressService'
import { achievements } from '@/mocks/achievements'
import { dimensions } from '@/mocks/assessments'
import { weeklyRetrospective } from '@/mocks/analytics'
import { daysAgo, diffDays, formatShort, today, weekdayShort, formatMinutesLong } from '@/utils/date'
import { cn } from '@/utils/cn'

const typeLabels: Record<string, string> = { atividade: 'Jornada', missao: 'Missões', oratoria: 'Oratória', simulacao: 'Simulações', ritual: 'Rituais', leitura: 'Leituras', diario: 'Diário' }

export default function Evolution() {
  const log = useAppStore((s) => s.activityLog)
  const journal = useAppStore((s) => s.journal)
  const unlocked = useAppStore((s) => s.unlocked)
  const assessments = useAppStore((s) => s.assessments)
  const allStats = useStats()
  const { journey, completedDays } = useJourney()
  const { premium } = useAccess()
  const [range, setRange] = useState<RangeFilter>('30')

  const filtered = useMemo(() => filterLog(log, range), [log, range])
  const stats = useMemo(() => computeStats(filtered), [filtered])

  const span = range === '7' ? 7 : range === '30' ? 30 : Math.max(7, ...log.map((e) => diffDays(today(), e.date) + 1))

  const perDay = useMemo(() => {
    const days = Math.min(span, 30)
    return Array.from({ length: days }).map((_, i) => {
      const date = daysAgo(days - 1 - i)
      const row: Record<string, string | number> = { dia: days <= 7 ? weekdayShort(date) : formatShort(date) }
      for (const t of ['atividade', 'missao', 'oratoria', 'simulacao', 'ritual', 'leitura']) row[t] = log.filter((e) => e.date === date && e.type === t).length
      return row
    })
  }, [log, span])

  const perWeek = useMemo(() => {
    const weeks = Math.max(1, Math.ceil(span / 7))
    return Array.from({ length: weeks }).map((_, i) => {
      const end = (weeks - 1 - i) * 7
      const minutes = log.filter((e) => {
        const d = diffDays(today(), e.date)
        return d >= end && d < end + 7
      }).reduce((a, e) => a + e.minutes, 0)
      return { semana: i === weeks - 1 ? 'Esta semana' : `Sem. ${i + 1}`, minutos: minutes }
    })
  }, [log, span])

  const skills = useMemo(() => {
    const m = new Map<string, number>()
    for (const e of filtered) if (e.skill) m.set(e.skill, (m.get(e.skill) ?? 0) + 1)
    return [...m.entries()].map(([id, value]) => ({ name: dimensions.find((d) => d.id === id)?.short ?? id, value })).sort((a, b) => b.value - a.value)
  }, [filtered])

  const perception = assessments.map((a) => ({ data: formatShort(a.date), 'Média geral': averageScore(a.scores), Comunicação: a.scores.comunicacao, Liderança: a.scores.lideranca }))
  const missions = [...filtered].filter((e) => e.type === 'missao').reverse()
  const journalCount = range === 'all' ? journal.length : journal.filter((j) => diffDays(today(), j.date) < Number(range)).length

  return (
    <div>
      <PageHeader
        eyebrow="Painel comportamental"
        title="Minha Evolução"
        description="Acompanhe sua dedicação, suas práticas e a evolução da sua autopercepção."
        actions={<Segmented label="Período" value={range} onChange={setRange} options={[{ value: '7', label: 'Últimos 7 dias' }, { value: '30', label: 'Últimos 30 dias' }, { value: 'all', label: 'Todo o período' }]} />}
      />
      {!premium && <DemoNotice className="mb-6">No plano Gratuito, o painel completo fica disponível como prévia. Ele faz parte do plano Experience.</DemoNotice>}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Dias de jornada concluídos" value={completedDays.length} hint={`de ${journey.totalDays} dias`} icon={<Route className="h-4 w-4" />} />
        <Stat label="Atividades realizadas" value={stats.activitiesCompleted} hint="jornada, rituais e leituras" icon={<Sparkles className="h-4 w-4" />} />
        <Stat label="Missões concluídas" value={stats.missionsCompleted} icon={<Flame className="h-4 w-4" />} />
        <Stat label="Exercícios de oratória" value={stats.voiceExercises} icon={<Mic className="h-4 w-4" />} />
        <Stat label="Simulações comportamentais" value={stats.simulations} icon={<FlaskConical className="h-4 w-4" />} />
        <Stat label="Registros no diário" value={journalCount} icon={<NotebookPen className="h-4 w-4" />} />
        <Stat label="Minutos de dedicação" value={stats.minutesDedicated} hint={formatMinutesLong(stats.minutesDedicated)} icon={<Clock className="h-4 w-4" />} />
        <Stat label="Pontos de evolução" value={stats.points} hint={range === 'all' ? `sequência atual: ${allStats.streak} dias` : `total: ${allStats.points}`} icon={<Trophy className="h-4 w-4" />} className="bg-rubi text-marfim [&_p]:text-marfim [&_p:first-child]:text-marfim/70" />
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <Card className="p-5 sm:p-6">
          <h2 className="text-[22px]">Atividades por dia</h2>
          <StackedBars data={perDay} xKey="dia" keys={Object.keys(typeLabels).filter((k) => k !== 'diario').map((k) => ({ key: k, label: typeLabels[k] }))} height={260} />
        </Card>
        <Card className="p-5 sm:p-6">
          <h2 className="text-[22px]">Tempo dedicado por semana</h2>
          <SimpleBars data={perWeek} xKey="semana" dataKey="minutos" unit="min" height={260} highlightLast />
        </Card>
        <Card className="p-5 sm:p-6">
          <h2 className="text-[22px]">Evolução da autopercepção</h2>
          <Lines data={perception} xKey="data" domain={[0, 100]} keys={[{ key: 'Média geral', label: 'Média geral' }, { key: 'Comunicação', label: 'Comunicação' }, { key: 'Liderança', label: 'Liderança' }]} height={260} />
        </Card>
        <Card className="p-5 sm:p-6">
          <h2 className="text-[22px]">Habilidades praticadas</h2>
          {skills.length ? (
            <div className="grid items-center gap-4 sm:grid-cols-[1fr_1fr]">
              <Donut data={skills} height={220} />
              <ul className="space-y-1.5 text-[13px]">
                {skills.map((s, i) => (
                  <li key={s.name} className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: palette[i % palette.length] }} />
                    <span className="flex-1">{s.name}</span>
                    <span className="font-semibold">{s.value}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="py-10 text-center text-sm text-muted">Sem práticas no período.</p>
          )}
        </Card>
        <Card className="p-5 sm:p-6">
          <h2 className="text-[22px]">Progresso por jornada</h2>
          <div className="mt-4 space-y-4">
            {journey.phases.map((ph) => {
              const ds = journey.days.filter((d) => d.phase === ph.id)
              const done = ds.filter((d) => completedDays.includes(d.day)).length
              return (
                <div key={ph.id}>
                  <div className="mb-1 flex justify-between text-[13px]"><span className="font-semibold">Fase {ph.id} · {ph.name}</span><span className="text-muted">{done}/{ds.length}</span></div>
                  <ProgressBar value={(done / ds.length) * 100} label={`Fase ${ph.name}`} />
                </div>
              )
            })}
            <div className="flex items-center justify-between rounded-xl bg-marfim p-3 text-[13px]">
              <span>{journey.title}</span>
              <span className="font-semibold text-rubi">{Math.round((completedDays.length / journey.totalDays) * 100)}%</span>
            </div>
          </div>
        </Card>
        <Card className="p-5 sm:p-6">
          <h2 className="text-[22px]">Histórico de missões</h2>
          {missions.length ? (
            <ul className="mt-3 max-h-72 divide-y divide-line overflow-y-auto pr-1">
              {missions.map((m) => (
                <li key={m.id} className="flex items-center justify-between gap-3 py-2.5 text-[13.5px]">
                  <span className="flex items-center gap-2"><CalendarCheck className="h-4 w-4 shrink-0 text-champagne-ink" aria-hidden="true" />{m.label.replace('Missão: ', '')}</span>
                  <span className="shrink-0 text-[12px] text-muted">{formatShort(m.date)}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="py-10 text-center text-sm text-muted">Nenhuma missão no período.</p>
          )}
        </Card>
      </div>

      <section className="mt-10">
        <SectionHeader eyebrow="Gamificação" title="Conquistas" description="Medalhas que reconhecem sua dedicação. Sem rankings, sem comparações e sem punição por dias sem acesso." />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {achievements.map((a, i) => {
            const u = unlocked.find((x) => x.id === a.id)
            return (
              <motion.div key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className={cn('card flex flex-col items-center p-5 text-center', !u && 'bg-marfim')}>
                <span className={cn('relative flex h-16 w-16 items-center justify-center rounded-full', u ? 'bg-gradient-to-br from-rubi to-rubi-deep text-champagne shadow-soft' : 'border border-dashed border-line text-muted')}>
                  {u && <span className="absolute inset-1 rounded-full border border-champagne/50" aria-hidden="true" />}
                  {u ? <Icon name={a.icon} className="h-6 w-6" /> : <Lock className="h-5 w-5" aria-hidden="true" />}
                </span>
                <p className={cn('mt-3 font-serif text-[19px] font-semibold leading-tight', !u && 'text-onix/60')}>{a.title}</p>
                <p className="mt-1 text-[12px] text-muted">{u ? `Conquistada em ${formatShort(u.date)}` : a.criteria}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      <section className="mt-10">
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-[1fr_1.4fr]">
            <div className="bg-onix p-6 text-marfim sm:p-8">
              <Award className="h-7 w-7 text-champagne" aria-hidden="true" />
              <h2 className="mt-3 text-[30px] text-marfim">{weeklyRetrospective.title}</h2>
              <Badge className="mt-2 border border-champagne/40 bg-transparent text-champagne">Retrospectiva demonstrativa</Badge>
            </div>
            <div className="p-6 sm:p-8">
              <ul className="space-y-3">
                {weeklyRetrospective.highlights.map((h) => (
                  <li key={h} className="flex gap-3 text-[14.5px]"><Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-champagne-ink" aria-hidden="true" />{h}</li>
                ))}
              </ul>
              <p className="mt-5 rounded-xl bg-marfim p-4 text-[14px]"><BookOpen className="mr-2 inline h-4 w-4 text-rubi" aria-hidden="true" />{weeklyRetrospective.focus}</p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}
