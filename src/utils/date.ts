// Utilitários de data (fuso local, formato pt-BR)

export const toISODate = (d: Date): string => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export const today = (): string => toISODate(new Date())

export const daysAgo = (n: number): string => {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return toISODate(d)
}

export const daysAgoDateTime = (n: number, time = '20:00:00'): string => `${daysAgo(n)}T${time}`

export const parseISODate = (s: string): Date => {
  const [y, m, d] = s.slice(0, 10).split('-').map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

export const diffDays = (a: string, b: string): number =>
  Math.round((parseISODate(a).getTime() - parseISODate(b).getTime()) / 86400000)

const weekdays = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb']
const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
const monthsLong = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro']

export const formatShort = (s: string): string => {
  const d = parseISODate(s)
  return `${d.getDate()} ${months[d.getMonth()]}`
}

export const formatLong = (s: string): string => {
  const d = parseISODate(s)
  return `${d.getDate()} de ${monthsLong[d.getMonth()]} de ${d.getFullYear()}`
}

export const weekdayShort = (s: string): string => weekdays[parseISODate(s).getDay()]

export const relativeTime = (iso: string): string => {
  const then = new Date(iso).getTime()
  const diff = Date.now() - then
  const min = Math.round(diff / 60000)
  if (min < 1) return 'agora'
  if (min < 60) return `há ${min} min`
  const h = Math.round(min / 60)
  if (h < 24) return `há ${h} h`
  const d = Math.round(h / 24)
  if (d === 1) return 'ontem'
  if (d < 30) return `há ${d} dias`
  return formatShort(iso)
}

export const greeting = (): string => {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

export const formatMinutes = (min: number): string => {
  const h = Math.floor(min / 60)
  const m = min % 60
  if (h === 0) return `${m} min`
  if (m === 0) return `${h} h`
  return `${h} h ${m} min`
}

export const formatMinutesLong = (min: number): string => {
  const h = Math.floor(min / 60)
  const m = min % 60
  const hs = h === 1 ? '1 hora' : `${h} horas`
  if (h === 0) return `${m} minutos`
  if (m === 0) return hs
  return `${hs} e ${m} minutos`
}
