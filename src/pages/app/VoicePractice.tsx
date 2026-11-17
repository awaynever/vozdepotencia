import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, CheckCircle2, Lock, Mic, MicOff, Pause, Play, Square, Trash2, Info } from 'lucide-react'
import { Badge, Button, Card, DemoNotice, DemoTag } from '@/components/ui/primitives'
import { voiceExercises, sampleVoiceAnalysis } from '@/mocks/voiceExercises'
import { useAppStore } from '@/store/useAppStore'
import { useAccess } from '@/hooks/useProgress'
import { audioStore, type StoredRecording } from '@/services/audioStore'
import { uid } from '@/services/storage'
import { relativeTime } from '@/utils/date'
import { toast } from '@/store/useToastStore'
import { cn } from '@/utils/cn'
import NotFound from '../NotFound'

type RecState = 'idle' | 'recording' | 'paused' | 'stopped'
const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`

export default function VoicePractice() {
  const { exerciseId } = useParams()
  const exercise = voiceExercises.find((e) => e.id === exerciseId)
  const done = useAppStore((s) => (exercise ? s.voiceDone.includes(exercise.id) : false))
  const completeVoice = useAppStore((s) => s.completeVoiceExercise)
  const { can } = useAccess()

  const [state, setState] = useState<RecState>('idle')
  const [elapsed, setElapsed] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [levels, setLevels] = useState<number[]>(Array(28).fill(4))
  const [current, setCurrent] = useState<{ url: string; rec: StoredRecording } | null>(null)
  const [history, setHistory] = useState<StoredRecording[]>([])
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [showAnalysis, setShowAnalysis] = useState(false)

  const recorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const audioElRef = useRef<HTMLAudioElement | null>(null)
  const elapsedRef = useRef(0)

  const supported = typeof window !== 'undefined' && 'MediaRecorder' in window && !!navigator.mediaDevices?.getUserMedia

  const refreshHistory = useCallback(async () => {
    if (!exercise) return
    setHistory(await audioStore.list(exercise.id))
  }, [exercise])

  useEffect(() => {
    if (!exercise) return
    let alive = true
    audioStore.list(exercise.id).then((list) => alive && setHistory(list))
    return () => {
      alive = false
    }
  }, [exercise])

  const stopMeters = () => {
    if (timerRef.current) window.clearInterval(timerRef.current)
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    timerRef.current = null
    rafRef.current = null
  }

  const cleanupStream = () => {
    stopMeters()
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    void audioCtxRef.current?.close().catch(() => undefined)
    audioCtxRef.current = null
  }

  useEffect(() => () => {
    cleanupStream()
    audioElRef.current?.pause()
  }, [])

  const startTimer = () => {
    timerRef.current = window.setInterval(() => {
      elapsedRef.current += 1
      setElapsed(elapsedRef.current)
    }, 1000)
  }

  const startMeter = (stream: MediaStream) => {
    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const ctx = new Ctx()
      audioCtxRef.current = ctx
      const src = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 64
      src.connect(analyser)
      const data = new Uint8Array(analyser.frequencyBinCount)
      const tick = () => {
        analyser.getByteFrequencyData(data)
        setLevels(Array.from({ length: 28 }, (_, i) => 4 + ((data[i % data.length] ?? 0) / 255) * 96))
        rafRef.current = requestAnimationFrame(tick)
      }
      tick()
    } catch {
      /* medidor visual opcional */
    }
  }

  const start = async () => {
    setError(null)
    setShowAnalysis(false)
    if (!supported) {
      setError('Seu navegador não oferece suporte à gravação de áudio. Você ainda pode ver a análise de exemplo.')
      return
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const rec = new MediaRecorder(stream)
      chunksRef.current = []
      rec.ondataavailable = (e) => e.data.size && chunksRef.current.push(e.data)
      rec.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: rec.mimeType || 'audio/webm' })
        const stored: StoredRecording = { id: uid('rec'), exerciseId: exercise!.id, createdAt: new Date().toISOString(), durationSec: elapsedRef.current, mimeType: blob.type, blob }
        try {
          await audioStore.save(stored)
        } catch {
          toast('Não foi possível salvar a gravação neste navegador', 'error')
        }
        setCurrent({ url: URL.createObjectURL(blob), rec: stored })
        void refreshHistory()
        cleanupStream()
      }
      recorderRef.current = rec
      elapsedRef.current = 0
      setElapsed(0)
      rec.start()
      setState('recording')
      startTimer()
      startMeter(stream)
    } catch {
      setError('Não conseguimos acessar o microfone. Verifique a permissão do navegador e tente novamente.')
      cleanupStream()
    }
  }

  const pause = () => {
    recorderRef.current?.pause()
    stopMeters()
    setState('paused')
  }
  const resume = () => {
    recorderRef.current?.resume()
    startTimer()
    if (streamRef.current) startMeter(streamRef.current)
    setState('recording')
  }
  const finish = () => {
    recorderRef.current?.stop()
    setState('stopped')
    setLevels(Array(28).fill(4))
  }

  const play = (rec: StoredRecording) => {
    audioElRef.current?.pause()
    if (playingId === rec.id) {
      setPlayingId(null)
      return
    }
    const url = current?.rec.id === rec.id ? current.url : URL.createObjectURL(rec.blob)
    const el = new Audio(url)
    audioElRef.current = el
    el.onended = () => setPlayingId(null)
    void el.play().catch(() => toast('Não foi possível reproduzir este áudio', 'error'))
    setPlayingId(rec.id)
  }

  const remove = async (rec: StoredRecording) => {
    if (playingId === rec.id) audioElRef.current?.pause()
    await audioStore.remove(rec.id)
    if (current?.rec.id === rec.id) {
      URL.revokeObjectURL(current.url)
      setCurrent(null)
      setState('idle')
    }
    void refreshHistory()
    toast('Gravação excluída')
  }

  if (!exercise) return <NotFound inApp />

  if (!can('academia')) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <Lock className="mx-auto h-10 w-10 text-champagne-ink" aria-hidden="true" />
        <h1 className="mt-4 text-[34px]">{exercise.title}</h1>
        <p className="mt-2 text-muted">A Academia da Voz faz parte do plano Experience.</p>
        <Button to="/app/planos" className="mt-6">Conhecer os planos</Button>
      </div>
    )
  }

  const overLimit = elapsed > exercise.seconds

  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/app/academia" className="mb-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted hover:text-rubi">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Academia da Voz
      </Link>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Badge tone="rubi">Exercício · {exercise.seconds} segundos</Badge>
        {done && <Badge tone="success"><Check className="h-3 w-3" aria-hidden="true" /> Concluído</Badge>}
      </div>
      <h1 className="text-[36px] sm:text-[46px]">{exercise.title}</h1>
      <p className="mt-2 text-[16px] text-muted">{exercise.prompt}</p>

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Card className="overflow-hidden">
          <div className="bg-onix px-6 py-8 text-center text-marfim sm:py-10">
            <div className="relative mx-auto flex h-28 w-28 items-center justify-center">
              {state === 'recording' && <span className="absolute inset-0 rounded-full border-2 border-rubi animate-pulse-ring" aria-hidden="true" />}
              <span className={cn('flex h-24 w-24 items-center justify-center rounded-full transition-colors', state === 'recording' ? 'bg-rubi' : 'bg-white/10')}>
                {error ? <MicOff className="h-9 w-9 text-champagne" aria-hidden="true" /> : <Mic className="h-9 w-9 text-champagne" aria-hidden="true" />}
              </span>
            </div>
            <p className={cn('mt-5 font-mono text-[40px] tabular-nums', overLimit ? 'text-champagne' : 'text-marfim')} aria-live="off">{fmt(elapsed)}</p>
            <p className="text-[12px] text-marfim/60" aria-live="polite">
              {state === 'idle' && 'Pronta para gravar'}
              {state === 'recording' && (overLimit ? 'Tempo sugerido atingido. Conclua quando quiser.' : `Gravando · meta de ${exercise.seconds}s`)}
              {state === 'paused' && 'Gravação pausada'}
              {state === 'stopped' && 'Gravação finalizada'}
            </p>
            <div className="mx-auto mt-5 flex h-14 max-w-xs items-center justify-center gap-[3px]" aria-hidden="true">
              {levels.map((l, i) => (
                <span key={i} className={cn('w-1.5 rounded-full transition-[height] duration-75', state === 'recording' ? 'bg-champagne' : 'bg-white/20')} style={{ height: `${l}%` }} />
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 p-5">
            {(state === 'idle' || state === 'stopped') && (
              <Button onClick={start} size="lg"><Mic className="h-4 w-4" aria-hidden="true" /> {state === 'stopped' ? 'Gravar novamente' : 'Iniciar'}</Button>
            )}
            {state === 'recording' && <Button onClick={pause} variant="outline" size="lg"><Pause className="h-4 w-4" aria-hidden="true" /> Pausar</Button>}
            {state === 'paused' && <Button onClick={resume} variant="outline" size="lg"><Play className="h-4 w-4" aria-hidden="true" /> Retomar</Button>}
            {(state === 'recording' || state === 'paused') && <Button onClick={finish} size="lg"><Square className="h-4 w-4" aria-hidden="true" /> Finalizar</Button>}
            {current && state === 'stopped' && (
              <>
                <Button onClick={() => play(current.rec)} variant="secondary" size="lg">{playingId === current.rec.id ? <Pause className="h-4 w-4" aria-hidden="true" /> : <Play className="h-4 w-4" aria-hidden="true" />} Reproduzir</Button>
                <Button onClick={() => remove(current.rec)} variant="ghost" size="lg" aria-label="Excluir gravação"><Trash2 className="h-4 w-4" aria-hidden="true" /> Excluir</Button>
              </>
            )}
          </div>
          {error && <p className="mx-5 mb-5 rounded-xl bg-rubi-soft p-3 text-[13px] text-rubi" role="alert">{error}</p>}
          <p className="flex items-start gap-2 border-t border-line px-5 py-3 text-[12px] text-muted">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" /> A gravação fica salva apenas neste navegador (IndexedDB) e não é enviada para nenhum serviço externo.
          </p>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-champagne-ink">Roteiro sugerido</p>
            <ol className="mt-3 space-y-2">
              {exercise.guide.map((g, i) => (
                <li key={g} className="flex items-center gap-3 text-[14px]"><span className="flex h-6 w-6 items-center justify-center rounded-full bg-bege text-[12px] font-bold">{i + 1}</span>{g}</li>
              ))}
            </ol>
          </Card>
          <Card className="p-5">
            <p className="text-[13px] font-semibold">Minhas gravações</p>
            {history.length === 0 ? (
              <p className="mt-2 text-[13px] text-muted">Nenhuma gravação salva para este exercício.</p>
            ) : (
              <ul className="mt-2 divide-y divide-line">
                {history.map((r) => (
                  <li key={r.id} className="flex items-center gap-2 py-2">
                    <button onClick={() => play(r)} className="flex h-8 w-8 items-center justify-center rounded-full bg-rubi-soft text-rubi" aria-label={playingId === r.id ? 'Pausar gravação' : 'Reproduzir gravação'}>
                      {playingId === r.id ? <Pause className="h-3.5 w-3.5" aria-hidden="true" /> : <Play className="h-3.5 w-3.5" aria-hidden="true" />}
                    </button>
                    <span className="flex-1 text-[13px]">{fmt(r.durationSec)} · {relativeTime(r.createdAt)}</span>
                    <button onClick={() => remove(r)} className="rounded p-1.5 text-muted hover:bg-bege hover:text-rubi" aria-label="Excluir gravação"><Trash2 className="h-4 w-4" aria-hidden="true" /></button>
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <Button variant="outline" className="w-full" onClick={() => setShowAnalysis(true)}>Ver análise de exemplo</Button>
        </div>
      </div>

      {(showAnalysis || state === 'stopped') && (
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
          <Card className="p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-[28px]">Análise demonstrativa</h2>
              <DemoTag label="Dados de exemplo" />
            </div>
            <DemoNotice className="mt-3">Nesta versão, a análise automática utiliza dados de exemplo e não reflete a sua gravação. Sotaques regionais e características naturais da voz nunca são penalizados.</DemoNotice>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[['Duração', sampleVoiceAnalysis.duration], ['Ritmo', `${sampleVoiceAnalysis.wpm} palavras/min`], ['Palavras de preenchimento', sampleVoiceAnalysis.fillerWords], ['Pausas identificadas', sampleVoiceAnalysis.pauses]].map(([l, v]) => (
                <div key={l as string} className="rounded-xl bg-marfim p-4">
                  <p className="font-serif text-[26px] font-semibold leading-none text-rubi">{v}</p>
                  <p className="mt-1 text-[12px] text-muted">{l}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="text-[13px] font-semibold">Estrutura:</span>
              {sampleVoiceAnalysis.structure.map((s) => <Badge key={s} tone="success"><Check className="h-3 w-3" aria-hidden="true" /> {s}</Badge>)}
            </div>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <p className="mb-2 text-[13px] font-semibold">Pontos positivos</p>
                <ul className="space-y-2 text-[14px]">{sampleVoiceAnalysis.highlights.map((h) => <li key={h} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-sucesso" aria-hidden="true" />{h}</li>)}</ul>
              </div>
              <div>
                <p className="mb-2 text-[13px] font-semibold">Sugestões de melhoria</p>
                <ul className="space-y-2 text-[14px]">{sampleVoiceAnalysis.suggestions.map((h) => <li key={h} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-champagne" />{h}</li>)}</ul>
              </div>
            </div>
          </Card>
        </motion.section>
      )}

      <div className="mt-8 rounded-2xl border border-line bg-white p-6 text-center">
        {done ? (
          <p className="inline-flex items-center gap-2 font-serif text-2xl font-semibold text-sucesso"><CheckCircle2 className="h-6 w-6" aria-hidden="true" /> Exercício concluído</p>
        ) : (
          <>
            <p className="font-serif text-2xl font-semibold">Praticou em voz alta?</p>
            <p className="mt-1 text-[13.5px] text-muted">Registre o exercício e ganhe 25 pontos de evolução.</p>
            <Button className="mt-4" onClick={() => completeVoice(exercise.id, exercise.title)}><Check className="h-4 w-4" aria-hidden="true" /> Concluir exercício</Button>
          </>
        )}
      </div>
    </div>
  )
}
