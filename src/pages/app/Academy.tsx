import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Clock, Mic, Timer } from 'lucide-react'
import { Badge, Button, Card, DemoNotice, PageHeader, PremiumLock, SectionHeader } from '@/components/ui/primitives'
import { Modal } from '@/components/ui/Modal'
import { Icon } from '@/components/ui/Icon'
import { voiceExercises, voiceModules, sampleVoiceAnalysis } from '@/mocks/voiceExercises'
import { images } from '@/mocks/images'
import { useAppStore } from '@/store/useAppStore'
import { useAccess } from '@/hooks/useProgress'
import type { VoiceModule } from '@/types'

export default function Academy() {
  const voiceDone = useAppStore((s) => s.voiceDone)
  const { can } = useAccess()
  const [module, setModule] = useState<VoiceModule | null>(null)
  const locked = !can('academia')
  const a = sampleVoiceAnalysis

  return (
    <div>
      <PageHeader
        eyebrow="Comunicação e oratória"
        title="Academia da Voz"
        description="Doze módulos e sete exercícios práticos para treinar sua voz com intenção. Seu sotaque e suas características naturais são parte de quem você é."
      />

      <div className="relative mb-10 overflow-hidden rounded-3xl bg-onix text-marfim">
        <img src={images.palcoMicrofone} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" />
        <div className="relative grid gap-6 p-6 sm:p-9 md:grid-cols-[1.3fr_1fr] md:items-center">
          <div>
            <Badge className="bg-champagne/20 text-champagne">{voiceDone.length} de {voiceExercises.length} exercícios realizados</Badge>
            <h2 className="mt-3 text-[34px] text-marfim sm:text-[42px]">Grave-se, ouça-se, evolua.</h2>
            <p className="mt-2 max-w-md text-[14.5px] text-marfim/75">As gravações são feitas no seu navegador, ficam salvas apenas neste dispositivo e nunca são enviadas para serviços externos.</p>
            <Button to={`/app/academia/${voiceExercises.find((e) => !voiceDone.includes(e.id))?.id ?? voiceExercises[0].id}`} variant="gold" className="mt-6">
              <Mic className="h-4 w-4" aria-hidden="true" /> Praticar agora
            </Button>
          </div>
          <div className="rounded-2xl border border-white/10 bg-onix/60 p-5 backdrop-blur">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-champagne">Gravação de exemplo · análise demonstrativa</p>
            <div className="mt-3 grid grid-cols-2 gap-3 text-center">
              {[['Duração', a.duration], ['Ritmo', `${a.wpm} ppm`], ['Preenchimentos', a.fillerWords], ['Pausas', a.pauses]].map(([l, v]) => (
                <div key={l as string} className="rounded-xl bg-white/[0.05] p-3">
                  <p className="font-serif text-2xl text-champagne">{v}</p>
                  <p className="text-[11px] text-marfim/60">{l}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[12px] text-marfim/60">Estrutura: {a.structure.join(', ').toLowerCase()}.</p>
          </div>
        </div>
      </div>

      <section className="mb-12">
        <SectionHeader eyebrow="Exercícios" title="Pratique em voz alta" action={locked ? <PremiumLock /> : undefined} />
        <div className="grid gap-3 md:grid-cols-2">
          {voiceExercises.map((e) => {
            const done = voiceDone.includes(e.id)
            return (
              <Link key={e.id} to={`/app/academia/${e.id}`} className="group card flex items-center gap-4 p-4 transition-all hover:border-champagne hover:shadow-soft sm:p-5">
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${done ? 'bg-sucesso-soft text-sucesso' : 'bg-rubi-soft text-rubi'}`}>
                  {done ? <CheckCircle2 className="h-5 w-5" aria-hidden="true" /> : <Mic className="h-5 w-5" aria-hidden="true" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-serif text-[20px] font-semibold leading-tight group-hover:text-rubi">{e.title}</p>
                  <p className="text-[13px] text-muted">{e.description}</p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 text-[12px] text-muted"><Timer className="h-3.5 w-3.5" aria-hidden="true" />{e.seconds}s</span>
                <ArrowRight className="h-4 w-4 shrink-0 text-rubi" aria-hidden="true" />
              </Link>
            )
          })}
        </div>
      </section>

      <section>
        <SectionHeader eyebrow="Módulos" title="Doze fundamentos da comunicação" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
          {voiceModules.map((m) => (
            <button key={m.id} onClick={() => setModule(m)} className="card group p-5 text-left transition-all hover:-translate-y-0.5 hover:border-champagne hover:shadow-soft">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-champagne-soft text-champagne-ink group-hover:bg-rubi group-hover:text-champagne">
                <Icon name={m.icon} className="h-5 w-5" />
              </span>
              <p className="mt-4 font-serif text-[21px] font-semibold">{m.name}</p>
              <p className="mt-1 line-clamp-2 text-[12.5px] text-muted">{m.description}</p>
              <p className="mt-3 inline-flex items-center gap-1 text-[11.5px] text-muted"><Clock className="h-3 w-3" aria-hidden="true" /> {m.minutes} min</p>
            </button>
          ))}
        </div>
      </section>

      <DemoNotice className="mt-10">A análise automática de voz utiliza dados de exemplo nesta versão. Nenhum áudio é processado por inteligência artificial ou enviado para fora do seu navegador.</DemoNotice>

      <Modal open={!!module} onOpenChange={(o) => !o && setModule(null)} title={module?.name ?? ''} description={module?.description}>
        {module && (
          <div className="space-y-5">
            <div>
              <p className="mb-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-champagne-ink">Fundamentos</p>
              <ul className="space-y-2">
                {module.tips.map((t) => <li key={t} className="flex gap-2.5 text-[14.5px]"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rubi" />{t}</li>)}
              </ul>
            </div>
            <Card className="bg-marfim p-4">
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-rubi">Prática</p>
              <p className="mt-1 text-[14.5px]">{module.practice}</p>
            </Card>
            <div>
              <p className="mb-2 text-[13px] font-semibold">Exercícios relacionados</p>
              <div className="flex flex-wrap gap-2">
                {voiceExercises.filter((e) => e.moduleIds.includes(module.id)).map((e) => (
                  <Button key={e.id} to={`/app/academia/${e.id}`} variant="outline" size="sm">{e.title}</Button>
                ))}
                {voiceExercises.filter((e) => e.moduleIds.includes(module.id)).length === 0 && <Button to={`/app/academia/${voiceExercises[0].id}`} variant="outline" size="sm">{voiceExercises[0].title}</Button>}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
