import { useMemo } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { useContentStore } from '@/store/useContentStore'
import { computeStats } from '@/services/progressService'
import { journeys } from '@/mocks/journeys'
import { freeAccess } from '@/mocks/plans'
import type { JourneyDay } from '@/types'

export const useStats = () => {
  const log = useAppStore((s) => s.activityLog)
  return useMemo(() => computeStats(log), [log])
}

export const useJourney = () => {
  const titles = useContentStore((s) => s.journeyTitles)
  const completedDays = useAppStore((s) => s.completedDays)
  const currentDay = useAppStore((s) => s.currentDay)
  return useMemo(() => {
    const journey = journeys[0]
    const days: JourneyDay[] = journey.days.map((d) => (titles[d.day] ? { ...d, title: titles[d.day] } : d))
    const percent = Math.round((completedDays.length / journey.totalDays) * 100)
    return { journey: { ...journey, days }, days, completedDays, currentDay, percent }
  }, [titles, completedDays, currentDay])
}

export type Feature = 'journeyDay' | 'simulation' | 'library' | 'ritual' | 'academia' | 'diario' | 'cards' | 'evolucao'

export const useAccess = () => {
  const plan = useAppStore((s) => s.profile.plan)
  const premium = plan !== 'free'
  const can = (feature: Feature, id?: string | number): boolean => {
    if (premium) return true
    switch (feature) {
      case 'journeyDay':
        return freeAccess.journeyDays.includes(Number(id))
      case 'simulation':
        return freeAccess.simulationIds.includes(String(id))
      case 'library':
        return freeAccess.libraryIds.includes(String(id))
      case 'ritual':
        return freeAccess.ritualIds.includes(String(id))
      case 'cards':
        return Number(id) < freeAccess.cardsLimit
      case 'academia':
      case 'diario':
      case 'evolucao':
        return false
      default:
        return true
    }
  }
  return { plan, premium, can }
}
