import type { JournalEntry, ResponseCard } from '@/types'
import { formatLong } from '@/utils/date'

export const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export const downloadText = (text: string, filename: string, type = 'text/plain;charset=utf-8') =>
  downloadBlob(new Blob([text], { type }), filename)

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      ta.remove()
      return ok
    } catch {
      return false
    }
  }
}

export const journalToMarkdown = (entries: JournalEntry[], moodLabel: (m: string) => string): string => {
  const lines = ['# Meu Diário · Voz de Potência', '', '_Exportado da versão demonstrativa._', '']
  for (const e of entries) {
    lines.push(`## ${e.title}`, `${formatLong(e.date)} · Sentimento: ${moodLabel(e.mood)}${e.categories.length ? ` · ${e.categories.join(', ')}` : ''}`, '', e.content, '', '---', '')
  }
  return lines.join('\n')
}

// ── Exportação de card como imagem (Canvas) ──

const wrap = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
  const words = text.split(' ')
  const lines: string[] = []
  let line = ''
  for (const w of words) {
    const test = line ? `${line} ${w}` : w
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = w
    } else line = test
  }
  if (line) lines.push(line)
  return lines
}

export const renderCardImage = async (card: ResponseCard): Promise<Blob | null> => {
  const W = 1080
  const H = 1350
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) return null
  try {
    await document.fonts.ready
  } catch {
    /* noop */
  }
  // Fundo
  const g = ctx.createLinearGradient(0, 0, W, H)
  g.addColorStop(0, '#650F1D')
  g.addColorStop(1, '#420911')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, W, H)
  // Moldura
  ctx.strokeStyle = 'rgba(197,165,114,0.55)'
  ctx.lineWidth = 2
  ctx.strokeRect(48, 48, W - 96, H - 96)
  // Monograma
  ctx.beginPath()
  ctx.arc(W / 2, 160, 52, 0, Math.PI * 2)
  ctx.stroke()
  ctx.fillStyle = '#C5A572'
  ctx.textAlign = 'center'
  ctx.font = '600 46px "Cormorant Garamond", Georgia, serif'
  ctx.fillText('VP', W / 2, 176)
  // Categoria
  ctx.font = '600 22px Montserrat, sans-serif'
  ctx.fillStyle = '#C5A572'
  ctx.fillText(card.category.toUpperCase(), W / 2, 280)
  // Situação
  ctx.fillStyle = 'rgba(250,247,240,0.78)'
  ctx.font = '400 30px Montserrat, sans-serif'
  let y = 360
  for (const l of wrap(ctx, card.situation, W - 240)) {
    ctx.fillText(l, W / 2, y)
    y += 44
  }
  // Resposta
  y += 50
  ctx.fillStyle = '#FAF7F0'
  ctx.font = 'italic 600 58px "Cormorant Garamond", Georgia, serif'
  for (const l of wrap(ctx, `“${card.response}”`, W - 220)) {
    ctx.fillText(l, W / 2, y)
    y += 70
  }
  // Explicação
  y += 40
  ctx.fillStyle = 'rgba(250,247,240,0.7)'
  ctx.font = '400 26px Montserrat, sans-serif'
  for (const l of wrap(ctx, card.explanation, W - 280)) {
    ctx.fillText(l, W / 2, y)
    y += 40
  }
  // Rodapé
  ctx.fillStyle = '#C5A572'
  ctx.font = '600 24px Montserrat, sans-serif'
  ctx.fillText('VOZ DE POTÊNCIA', W / 2, H - 130)
  ctx.fillStyle = 'rgba(250,247,240,0.6)'
  ctx.font = 'italic 400 30px "Cormorant Garamond", Georgia, serif'
  ctx.fillText('Sua voz. Sua essência. Sua potência.', W / 2, H - 88)
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), 'image/png'))
}
