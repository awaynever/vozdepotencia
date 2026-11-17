import { useEffect, useRef, useState } from 'react'
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react'
import { cn } from '@/utils/cn'

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`
const speeds = [0.75, 1, 1.25, 1.5]

interface Props {
  title: string
  subtitle?: string
  durationSec: number
  dark?: boolean
  onComplete?: () => void
}

// Player demonstrativo: simula reprodução (não há arquivo de áudio real cadastrado).
export function AudioPlayerDemo({ title, subtitle, durationSec, dark, onComplete }: Props) {
  const [playing, setPlaying] = useState(false)
  const [pos, setPos] = useState(0)
  const [speed, setSpeed] = useState(1)
  const completed = useRef(false)

  useEffect(() => {
    if (!playing) return
    const t = setInterval(() => {
      setPos((p) => {
        const n = p + 0.25 * speed
        if (n >= durationSec) {
          setPlaying(false)
          if (!completed.current) {
            completed.current = true
            onComplete?.()
          }
          return durationSec
        }
        return n
      })
    }, 250)
    return () => clearInterval(t)
  }, [playing, speed, durationSec, onComplete])

  const pct = (pos / durationSec) * 100
  const bars = 48

  return (
    <div className={cn('rounded-2xl p-5', dark ? 'bg-onix text-marfim' : 'border border-line bg-white')}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className={cn('text-[10.5px] font-semibold uppercase tracking-[0.16em]', dark ? 'text-champagne' : 'text-champagne-ink')}>Player demonstrativo</p>
          <p className="mt-0.5 truncate font-serif text-xl font-semibold">{title}</p>
          {subtitle && <p className={cn('text-[12.5px]', dark ? 'text-marfim/60' : 'text-muted')}>{subtitle}</p>}
        </div>
        <button
          onClick={() => setSpeed(speeds[(speeds.indexOf(speed) + 1) % speeds.length])}
          className={cn('shrink-0 rounded-full border px-2.5 py-1 text-[12px] font-semibold', dark ? 'border-white/20 text-marfim' : 'border-line')}
          aria-label={`Velocidade de reprodução: ${speed}x. Alterar`}
        >
          {speed}x
        </button>
      </div>

      <div className="mt-4 flex h-10 items-center gap-[3px]" aria-hidden="true">
        {Array.from({ length: bars }).map((_, i) => {
          const h = 20 + Math.abs(Math.sin(i * 1.7) * 60) + (i % 5) * 4
          const active = (i / bars) * 100 <= pct
          return <span key={i} className={cn('flex-1 rounded-full transition-colors', active ? (dark ? 'bg-champagne' : 'bg-rubi') : dark ? 'bg-white/15' : 'bg-bege')} style={{ height: `${Math.min(100, h)}%` }} />
        })}
      </div>
      <input
        type="range"
        min={0}
        max={durationSec}
        step={1}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        className="mt-2 w-full accent-[#650F1D]"
        aria-label="Posição da reprodução"
      />
      <div className={cn('mt-1 flex justify-between text-[11.5px] tabular-nums', dark ? 'text-marfim/60' : 'text-muted')}>
        <span>{fmt(pos)}</span>
        <span>{fmt(durationSec)}</span>
      </div>
      <div className="mt-3 flex items-center justify-center gap-4">
        <button onClick={() => setPos((p) => Math.max(0, p - 15))} className="rounded-full p-2 hover:bg-black/5" aria-label="Voltar 15 segundos">
          <SkipBack className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          onClick={() => {
            if (pos >= durationSec) setPos(0)
            setPlaying((p) => !p)
          }}
          className={cn('flex h-14 w-14 items-center justify-center rounded-full shadow-soft transition-transform active:scale-95', dark ? 'bg-champagne text-onix' : 'bg-rubi text-white')}
          aria-label={playing ? 'Pausar' : 'Reproduzir'}
        >
          {playing ? <Pause className="h-6 w-6" aria-hidden="true" /> : pos >= durationSec ? <RotateCcw className="h-6 w-6" aria-hidden="true" /> : <Play className="ml-0.5 h-6 w-6" aria-hidden="true" />}
        </button>
        <button onClick={() => setPos((p) => Math.min(durationSec, p + 15))} className="rounded-full p-2 hover:bg-black/5" aria-label="Avançar 15 segundos">
          <SkipForward className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
