import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Lightbulb, MessageCircle, RotateCcw, Send, Theater } from 'lucide-react'
import { DemoNotice, DemoTag, Segmented } from '@/components/ui/primitives'
import { auroraPersonas, auroraSuggestions, auroraTopics } from '@/mocks/aurora'
import { auroraProvider } from '@/services/auroraService'
import { useAppStore } from '@/store/useAppStore'
import { uid } from '@/services/storage'
import { cn } from '@/utils/cn'
import type { AuroraPersona, ChatMessage } from '@/types'

function Orb({ size = 56, speaking }: { size?: number; speaking?: boolean }) {
  return (
    <span className="relative inline-flex shrink-0" style={{ width: size, height: size }} aria-hidden="true">
      {speaking && <span className="absolute inset-0 rounded-full border border-champagne/70 animate-pulse-ring" />}
      <span className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_35%_30%,#f6ead2,#C5A572_45%,#7a5f30_85%)] shadow-[0_8px_30px_rgba(197,165,114,0.35)] animate-float" />
      <span className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle_at_40%_35%,rgba(255,255,255,0.65),transparent_60%)]" />
    </span>
  )
}

interface FollowUp { label: string; action: () => void }

export default function Aurora() {
  const firstName = useAppStore((s) => s.profile.firstName)
  const [mode, setMode] = useState<'chat' | 'simular'>('chat')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [typing, setTyping] = useState(false)
  const [input, setInput] = useState('')
  const [followUps, setFollowUps] = useState<FollowUp[]>([])
  const [persona, setPersona] = useState<AuroraPersona | null>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, typing, followUps])

  const push = (m: Omit<ChatMessage, 'id'>) => setMessages((list) => [...list, { ...m, id: uid('msg') }])

  const showTopicFollowUps = (topicId: string, turnIndex: number) => {
    const topic = auroraTopics.find((t) => t.id === topicId)
    const turn = topic?.turns[turnIndex]
    if (!topic || !turn) return
    const base: FollowUp[] = turn.followUps.map((f) => ({ label: f.label, action: () => continueTopic(topicId, f.next, f.label) }))
    if (base.length === 0) base.push(...auroraSuggestions.filter((s) => s !== topic.title).slice(0, 3).map((s) => ({ label: s, action: () => send(s) })))
    setFollowUps(base)
  }

  const continueTopic = async (topicId: string, next: number, label: string) => {
    setFollowUps([])
    push({ from: 'user', text: label })
    setTyping(true)
    const r = await auroraProvider.continueTopic(topicId, next)
    setTyping(false)
    push({ from: 'aurora', text: r.text })
    showTopicFollowUps(topicId, next)
  }

  const send = async (text: string) => {
    const t = text.trim()
    if (!t) return
    setInput('')
    setFollowUps([])
    push({ from: 'user', text: t })
    setTyping(true)
    const r = await auroraProvider.reply(t)
    setTyping(false)
    push({ from: 'aurora', text: r.text, meta: r.kind })
    if (r.kind === 'topic' && r.topicId) showTopicFollowUps(r.topicId, 0)
    else setFollowUps([...auroraSuggestions.map((s): FollowUp => ({ label: s, action: () => void send(s) })), { label: 'Simular uma conversa', action: () => switchMode('simular') }])
  }

  // ── Simulação com personagem ──
  const personaStep = (p: AuroraPersona, index: number) => {
    const step = p.replies[index]
    setTyping(true)
    window.setTimeout(() => {
      setTyping(false)
      push({ from: 'persona', text: step.aurora, meta: `${p.name} · ${p.role}` })
      if (step.options.length) {
        setFollowUps(step.options.map((o) => ({
          label: o.label,
          action: () => {
            setFollowUps([])
            push({ from: 'user', text: o.label })
            if (o.tip) push({ from: 'aurora', text: o.tip, meta: 'tip' })
            personaStep(p, o.next)
          },
        })))
      } else {
        push({ from: 'aurora', text: 'Simulação concluída. Que tal repetir escolhendo outras respostas, ou praticar com outro personagem?' })
        setFollowUps([{ label: 'Repetir esta simulação', action: () => startPersona(p) }, { label: 'Escolher outro personagem', action: () => resetPersona() }])
      }
    }, 900)
  }

  const startPersona = (p: AuroraPersona) => {
    setPersona(p)
    setMessages([{ id: uid('msg'), from: 'aurora', text: `Vamos praticar. Cenário: ${p.scenario} Eu vou interpretar ${p.name}, ${p.role.toLowerCase()}. Escolha suas respostas e eu comento cada uma.` }])
    setFollowUps([])
    personaStep(p, 0)
  }

  const resetPersona = () => {
    setPersona(null)
    setMessages([])
    setFollowUps([])
  }

  const switchMode = (m: 'chat' | 'simular') => {
    setMode(m)
    setMessages([])
    setFollowUps([])
    setPersona(null)
    setTyping(false)
  }

  const empty = messages.length === 0

  return (
    <div className="-my-6 flex min-h-[calc(100dvh-4rem)] flex-col sm:-my-8 lg:-my-10 lg:min-h-dvh">
      <div className="flex items-center justify-between gap-3 border-b border-line py-4">
        <div className="flex items-center gap-3">
          <Link to="/app" className="rounded-full p-1.5 text-muted hover:bg-bege lg:hidden" aria-label="Voltar"><ArrowLeft className="h-5 w-5" aria-hidden="true" /></Link>
          <Orb size={40} speaking={typing} />
          <div>
            <h1 className="font-serif text-[26px] leading-none">Aurora</h1>
            <p className="text-[12px] text-muted">Mentora digital de comunicação</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DemoTag label="Respostas predefinidas" className="hidden sm:inline-flex" />
          {!empty && (
            <button onClick={() => switchMode(mode)} className="rounded-full p-2 text-muted hover:bg-bege" aria-label="Reiniciar conversa"><RotateCcw className="h-4 w-4" aria-hidden="true" /></button>
          )}
        </div>
      </div>

      <div className="flex justify-center py-3">
        <Segmented label="Modo" value={mode} onChange={switchMode} options={[{ value: 'chat', label: 'Conversar' }, { value: 'simular', label: 'Simular com personagem' }]} />
      </div>

      <div className="flex-1 space-y-4 py-4" aria-live="polite">
        {empty && mode === 'chat' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl py-6 text-center">
            <div className="flex justify-center"><Orb size={96} /></div>
            <h2 className="mt-6 text-[34px]">Olá, {firstName}. Sobre o que vamos conversar?</h2>
            <p className="mt-2 text-muted">Pergunte como lidar com uma situação de comunicação ou escolha um tema abaixo.</p>
            <div className="mt-7 grid gap-2 text-left sm:grid-cols-2">
              {auroraSuggestions.map((s) => (
                <button key={s} onClick={() => send(s)} className="flex items-center gap-2.5 rounded-xl border border-line bg-white px-4 py-3 text-[14px] font-medium transition-colors hover:border-champagne">
                  <MessageCircle className="h-4 w-4 shrink-0 text-champagne-ink" aria-hidden="true" /> {s}
                </button>
              ))}
            </div>
            <DemoNotice className="mt-6 text-left">Esta é uma demonstração com respostas predefinidas. A Aurora não oferece atendimento psicológico, diagnóstico ou orientação jurídica. Recurso previsto para o Clube Voz de Potência.</DemoNotice>
          </motion.div>
        )}

        {empty && mode === 'simular' && !persona && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl py-4">
            <div className="text-center">
              <Theater className="mx-auto h-8 w-8 text-champagne-ink" aria-hidden="true" />
              <h2 className="mt-3 text-[32px]">Escolha um personagem</h2>
              <p className="mt-1 text-muted">A Aurora interpreta o personagem e comenta suas escolhas.</p>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {auroraPersonas.map((p) => (
                <button key={p.id} onClick={() => startPersona(p)} className="card p-5 text-left transition-all hover:-translate-y-0.5 hover:border-champagne hover:shadow-soft">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-champagne-ink">{p.role}</span>
                  <p className="mt-1 font-serif text-[22px] font-semibold">{p.name}</p>
                  <p className="mt-1 text-[13px] text-muted">{p.description}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <div className="mx-auto max-w-3xl space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={cn('flex gap-3', m.from === 'user' && 'justify-end')}>
                {m.from === 'aurora' && m.meta !== 'tip' && <Orb size={30} />}
                {m.from === 'persona' && <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-onix text-[12px] font-bold text-champagne" aria-hidden="true">{persona?.name[0]}</span>}
                {m.meta === 'tip' ? (
                  <div className="ml-[42px] flex max-w-[85%] items-start gap-2 rounded-xl border border-champagne/40 bg-champagne-soft/60 px-3.5 py-2.5 text-[13px] text-champagne-ink">
                    <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> <span><strong>Aurora:</strong> {m.text}</span>
                  </div>
                ) : (
                  <div className={cn('max-w-[85%] rounded-2xl px-4 py-3 text-[14.5px] leading-relaxed', m.from === 'user' ? 'rounded-br-md bg-rubi text-white' : m.from === 'persona' ? 'rounded-bl-md bg-onix text-marfim' : 'rounded-bl-md border border-line bg-white', m.meta === 'safety' && 'border-rubi/30 bg-rubi-soft')}>
                    {m.from === 'persona' && <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-champagne">{m.meta}</p>}
                    {m.text}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {typing && (
            <div className="flex items-center gap-3" role="status" aria-label="Aurora está digitando">
              <Orb size={30} speaking />
              <div className="flex gap-1 rounded-2xl rounded-bl-md border border-line bg-white px-4 py-3.5">
                {[0, 1, 2].map((i) => (
                  <motion.span key={i} className="h-2 w-2 rounded-full bg-champagne" animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }} transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }} />
                ))}
              </div>
            </div>
          )}
          {followUps.length > 0 && !typing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={cn('flex flex-col gap-2', persona ? 'items-end' : 'items-start pl-[42px]')}>
              {followUps.map((f) => (
                <button key={f.label} onClick={f.action} className="max-w-[90%] rounded-xl border border-rubi/30 bg-white px-4 py-2.5 text-left text-[13.5px] font-medium text-rubi transition-colors hover:bg-rubi-soft">
                  {f.label}
                </button>
              ))}
            </motion.div>
          )}
          <div ref={endRef} />
        </div>
      </div>

      {mode === 'chat' && (
        <form
          className="sticky bottom-0 -mx-4 border-t border-line bg-marfim/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10"
          onSubmit={(e) => {
            e.preventDefault()
            void send(input)
          }}
        >
          <div className="mx-auto flex max-w-3xl items-center gap-2">
            <label htmlFor="aurora-input" className="sr-only">Mensagem para a Aurora</label>
            <input id="aurora-input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Escreva sua pergunta…" className="input h-12 rounded-full px-5" autoComplete="off" disabled={typing} />
            <button type="submit" disabled={!input.trim() || typing} className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-rubi text-white transition-colors hover:bg-rubi-deep disabled:opacity-40" aria-label="Enviar">
              <Send className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <p className="mx-auto mt-2 max-w-3xl text-center text-[11px] text-muted">Versão demonstrativa com situações limitadas. Não substitui apoio profissional.</p>
        </form>
      )}
    </div>
  )
}
