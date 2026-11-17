import type { ActivityLogEntry, DimensionId, DimensionScores, UserStats } from '@/types'
import { assessmentQuestions, dimensionIds } from '@/mocks/assessments'
import { daysAgo, diffDays, today } from '@/utils/date'

// ── Estatísticas derivadas do histórico local ──

export const LEARNING_TYPES: ActivityLogEntry['type'][] = ['atividade', 'ritual', 'leitura']

export const computeStats = (log: ActivityLogEntry[]): UserStats => ({
  activitiesCompleted: log.filter((e) => LEARNING_TYPES.includes(e.type)).length,
  missionsCompleted: log.filter((e) => e.type === 'missao').length,
  voiceExercises: log.filter((e) => e.type === 'oratoria').length,
  simulations: log.filter((e) => e.type === 'simulacao').length,
  minutesDedicated: log.reduce((acc, e) => acc + e.minutes, 0),
  points: log.reduce((acc, e) => acc + e.points, 0),
  streak: computeStreak(log),
})

export const computeStreak = (log: ActivityLogEntry[]): number => {
  const dates = new Set(log.map((e) => e.date))
  let cursor = today()
  if (!dates.has(cursor)) cursor = daysAgo(1)
  let streak = 0
  let offset = diffDays(today(), cursor)
  while (dates.has(daysAgo(offset))) {
    streak += 1
    offset += 1
  }
  return streak
}

export type RangeFilter = '7' | '30' | 'all'

export const filterLog = (log: ActivityLogEntry[], range: RangeFilter): ActivityLogEntry[] => {
  if (range === 'all') return log
  const limit = Number(range)
  return log.filter((e) => diffDays(today(), e.date) < limit)
}

// ── Avaliação de autopercepção ──

// Converte respostas (1 a 5) em pontuação 0–100 por dimensão.
export const computeAssessmentScores = (answers: Record<string, number>): DimensionScores => {
  const result = {} as DimensionScores
  for (const dim of dimensionIds) {
    const qs = assessmentQuestions.filter((q) => q.dimension === dim)
    const values = qs.map((q) => {
      const raw = answers[q.id] ?? 3
      return q.reverse ? 6 - raw : raw
    })
    const avg = values.reduce((a, b) => a + b, 0) / values.length
    result[dim] = Math.round(((avg - 1) / 4) * 100)
  }
  return result
}

export const rankDimensions = (scores: DimensionScores): { strongest: DimensionId[]; priorities: DimensionId[] } => {
  const sorted = [...dimensionIds].sort((a, b) => scores[b] - scores[a])
  return { strongest: sorted.slice(0, 2), priorities: sorted.slice(-3).reverse() }
}

export const averageScore = (scores: DimensionScores): number =>
  Math.round(dimensionIds.reduce((acc, d) => acc + scores[d], 0) / dimensionIds.length)

export const scoreBand = (score: number): string => {
  if (score >= 75) return 'Ponto forte'
  if (score >= 55) return 'Em consolidação'
  if (score >= 35) return 'Em desenvolvimento'
  return 'Área prioritária'
}
