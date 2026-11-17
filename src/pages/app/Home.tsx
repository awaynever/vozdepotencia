import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, BookOpen, Bot, Check, Clock, Copy, Flame, FlaskConical, Layers, Mic, NotebookPen, Sparkles, Sun, Target, Trophy } from 'lucide-react'
import { Badge, Button, Card, FavoriteButton, ProgressBar, SectionHeader } from '@/components/ui/primitives'
import { AudioPlayerDemo } from '@/components/AudioPlayerDemo'
import { MissionModal } from '@/components/MissionModal'
import { SimpleBars } from '@/components/charts/charts'
import { NotificationsButton } from '@/layouts/AppLayout'
import { useAppStore } from '@/store/useAppStore'
import { useContentStore } from '@/store/useContentStore'
import { useJourney, useStats } from '@/hooks/useProgress'
import { moods } from '@/mocks/journal'
import { reflections } from '@/mocks/journeys'
import { images } from '@/mocks/images'
import { copyToClipboard } from '@/services/exportService'
import { toast } from '@/store/useToastStore'
import { daysAgo, greeting, today, weekdayShort, formatMinutes } from '@/utils/date'
import { cn } from '@/utils/cn'

const exploreCards = [
  { to: '/app/academia', title: 'Academia da Voz', text: 'Oratória e comunicação com gravações.', icon: Mic, image: images.microfone },
  { to: '/app/laboratorio', title: 'Laboratório Comportamental', text: '30 conversas difíceis para praticar.', icon: FlaskConical, image: images.duasNegrasReuniao },
  { to: '/app/aurora', title: 'Aurora IA', text: 'Sua mentora digital de comunicação.', icon: Bot, image: '' },
  { to: '/app/diario', title: 'Meu Diário', text: 'Registros privados e reflexões.', icon: NotebookPen, image: images.diario },
  { to: '/app/rituais', title: 'Rituais de Energia', text: 'Experiências guiadas de foco e descanso.', icon: Sun, image: images.meditacao },
  { to: '/app/respostas', title: 'Respostas Poderosas', text: '60 cards para situações do dia a dia.', icon: Layers, image: '' },
  { to: '/app/biblioteca', title: 'Biblioteca', text: 'E-books, guias, artigos e planners.', icon: BookOpen, image: images.laptopSofa },
]

export default function Home() {
  const profile = useAppStore((s) => s.profile)
  const checkins = useAppStore((s) => s.checkins)
  const checkIn = useAppStore((s) => s.checkIn)
  const favorites = useAppStore((s) => s.favorites.reflections)
  const toggleFavorite = useAppStore((s) => s.toggleFavorite)
  const log = useAppStore((s) => s.activityLog)
  const missionsDone = useAppStore((s) => s.missionsDone)
  const banners = useContentStore((s) => s.banners)
  const missions = useContentStore((s) => s.missions)
  const stats = useStats()
  const { journey, currentDay, percent, completedDays } = useJourney()
  const [missionOpen, setMissionOpen] = useState(false)
  const [now] = useState(() => new Date())

  const todayCheckin = checkins.find((c) => c.date === today())
  const selectedMood = moods.find((m) => m.id === todayCheckin?.mood)
  const mission = missions[0]
  const missionDone = mission ? missionsDone.some((m) => m.id === mission.id && m.date === today()) : false
  const reflection = reflections[now.getDate() % reflections.length]
  const isFavReflection = favorites.includes(reflection.id)
  const activeBanners = banners.filter((b) => b.active)
  const banner = activeBanners[1] ?? activeBanners[0]
  const day = journey.days.find((d) => d.day === currentDay)

  const week = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const date = daysAgo(6 - i)
      const entries = log.filter((e) => e.date === date && e.type !== 'checkin')
      return { dia: weekdayShort(date), atividades: entries.length, minutos: entries.reduce((a, e) => a + e.minutes, 0) }
    })
  }, [log])
  const weekActivities = week.reduce((a, d) => a + d.atividades, 0)

  return (
    <div className="space-y-10">
      {/* Cabeçalho */}
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">{now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
          <h1 className="text-[36px] leading-[1.05] sm:text-[46px]">
            {greeting()}, {profile.firstName}.
          </h1>
          <p className="mt-2 text-[15px] text-muted">Hoje é uma nova oportunidade de fortalecer sua potência.</p>
        </div>
        <div className="hidden items-center gap-3 lg:flex">
          <NotificationsButton />
          <Link to="/app/configuracoes" aria-label="Meu perfil">
            <img src={profile.avatar} alt="" className="h-11 w-11 rounded-full object-cover ring-2 ring-champagne/40 ring-offset-2 ring-offset-marfim" />
          </Link>
        </div>
      </header>

      {/* Banner principal */}
      <section className="relative overflow-hidden rounded-3xl bg-rubi-deep text-marfim shadow-lift">
        <img src={journey.image} alt="Mulher preta conduzindo uma reunião com colegas" className="absolute inset-0 h-full w-full object-cover object-[center_30%] opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-r from-rubi-deep via-rubi-deep/85 to-rubi-deep/20" />
        <div className="relative grid gap-6 p-6 sm:p-9 md:grid-cols-[1.4fr_1fr] md:items-end">
          <div>
            <Badge className="bg-champagne/20 text-champagne">Jornada atual · Fase {day?.phase ?? 2}</Badge>
            <h2 className="mt-3 text-[34px] text-marfim sm:text-[46px]">{journey.title}</h2>
            <p className="mt-2 max-w-md text-[14.5px] text-marfim/75">
              Dia {currentDay}: {day?.title}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button to={`/app/jornada/${currentDay}`} variant="gold" size="lg">
                Continuar minha jornada <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Link to="/app/jornada" className="text-[13px] font-semibold text-marfim/80 hover:text-champagne">Ver todos os dias</Link>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-onix/30 p-5 backdrop-blur-sm">
            <div className="flex items-baseline justify-between">
              <p className="font-serif text-[40px] font-semibold leading-none">Dia {currentDay}<span className="text-xl text-marfim/60"> de {journey.totalDays}</span></p>
              <p className="text-2xl font-semibold text-champagne">{percent}%</p>
            </div>
            <ProgressBar value={percent} tone="light" className="mt-4" label="Progresso da jornada" />
            <p className="mt-2 text-[12px] text-marfim/60">{completedDays.length} dias concluídos · no seu ritmo, sem penalidades</p>
          </div>
        </div>
      </section>

      {/* Check-in + Missão */}
      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="p-6">
          <p className="eyebrow mb-1.5">Check-in diário</p>
          <h2 className="text-[26px]">Como você está se sentindo hoje?</h2>
          <div className="mt-5 grid grid-cols-3 gap-2" role="radiogroup" aria-label="Como você está se sentindo hoje?">
            {moods.map((m) => (
              <button
                key={m.id}
                role="radio"
                aria-checked={todayCheckin?.mood === m.id}
                onClick={() => checkIn(m.id)}
                className={cn(
                  'flex min-w-0 flex-col items-center gap-1 rounded-xl border px-1 py-3 text-[12px] font-semibold transition-all sm:text-[13px]',
                  todayCheckin?.mood === m.id ? 'border-rubi bg-rubi text-white' : 'border-line bg-marfim hover:border-champagne',
                )}
              >
                <span className={cn('font-serif text-xl leading-none', todayCheckin?.mood === m.id ? 'text-champagne' : 'text-champagne-ink')} aria-hidden="true">{m.emoji}</span>
                {m.label}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            {selectedMood && (
              <motion.div key={selectedMood.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 rounded-xl bg-champagne-soft/70 p-4">
                <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-champagne-ink">Sugestão para você</p>
                <p className="mt-1 font-serif text-xl font-semibold">{selectedMood.suggestion.title}</p>
                <p className="text-[13.5px] text-onix/80">{selectedMood.suggestion.text}</p>
                <Link to={selectedMood.suggestion.link} className="mt-2 inline-flex items-center gap-1 text-[13px] font-semibold text-rubi hover:underline">
                  {selectedMood.suggestion.cta} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {mission && (
          <Card className="relative overflow-hidden p-6">
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-rubi-soft" aria-hidden="true" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <p className="eyebrow">Missão de coragem do dia</p>
                <Flame className="h-5 w-5 text-rubi" aria-hidden="true" />
              </div>
              <h2 className="mt-2 text-[32px]">{mission.title}</h2>
              <p className="mt-2 text-[15px] text-onix/80">{mission.description}</p>
              <p className="mt-4 inline-flex items-center gap-1.5 text-[13px] text-muted"><Clock className="h-4 w-4" aria-hidden="true" /> Tempo estimado: {mission.minutes} minutos</p>
              <div className="mt-6">
                {missionDone ? (
                  <Button variant="secondary" onClick={() => setMissionOpen(true)}><Check className="h-4 w-4" aria-hidden="true" /> Missão concluída hoje</Button>
                ) : (
                  <Button onClick={() => setMissionOpen(true)}>Iniciar missão</Button>
                )}
              </div>
            </div>
            <MissionModal mission={mission} open={missionOpen} onOpenChange={setMissionOpen} />
          </Card>
        )}
      </div>

      {/* Áudio + Evolução */}
      <div className="grid gap-5 lg:grid-cols-[1fr_1.3fr]">
        <section>
          <SectionHeader eyebrow="Áudio do dia" title="A coragem de ocupar espaços" />
          <AudioPlayerDemo title="A coragem de ocupar espaços" subtitle="7 minutos · áudio guiado" durationSec={420} dark />
          <p className="mt-2 text-[12px] text-muted">
            Áudio demonstrativo, sem arquivo de som nesta versão. <Link to="/app/biblioteca/lib-audio-coragem" className="font-semibold text-rubi hover:underline">Ler a transcrição</Link>
          </p>
        </section>
        <section>
          <SectionHeader eyebrow="Minha evolução" title="Sua semana" action={<Link to="/app/evolucao" className="text-[13px] font-semibold text-rubi hover:underline">Ver painel completo</Link>} />
          <Card className="p-5">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Atividades na semana', value: weekActivities, icon: Target },
                { label: 'Progresso da jornada', value: `${percent}%`, icon: Sparkles },
                { label: 'Pontos de evolução', value: stats.points, icon: Trophy },
                { label: 'Missões concluídas', value: stats.missionsCompleted, icon: Flame },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="rounded-xl bg-marfim p-3">
                  <Icon className="h-4 w-4 text-champagne-ink" aria-hidden="true" />
                  <p className="mt-2 font-serif text-[28px] font-semibold leading-none">{value}</p>
                  <p className="mt-1 text-[11.5px] leading-tight text-muted">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-5">
              <div className="mb-1 flex items-center justify-between text-[12px] text-muted">
                <span>Minutos dedicados por dia</span>
                <span>{formatMinutes(week.reduce((a, d) => a + d.minutos, 0))} na semana · sequência de {stats.streak} dias</span>
              </div>
              <SimpleBars data={week} dataKey="minutos" xKey="dia" unit="min" height={170} highlightLast />
            </div>
          </Card>
        </section>
      </div>

      {/* Explore */}
      <section>
        <SectionHeader eyebrow="Explore sua potência" title="Para praticar hoje" />
        <div className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 scrollbar-none sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {exploreCards.map(({ to, title, text, icon: Icon, image }, i) => (
            <Link
              key={to}
              to={to}
              className={cn('group relative flex min-h-[200px] w-[240px] shrink-0 snap-start flex-col justify-end overflow-hidden rounded-2xl p-5 text-marfim shadow-soft transition-transform hover:-translate-y-0.5 sm:w-auto', i === 0 && 'lg:col-span-2')}
            >
              {image ? (
                <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
              ) : (
                <div className={cn('absolute inset-0', i % 2 ? 'bg-gradient-to-br from-onix to-rubi-deep' : 'bg-gradient-to-br from-rubi to-rubi-deep')}>
                  {to === '/app/aurora' && <span className="absolute right-6 top-6 h-20 w-20 rounded-full bg-[radial-gradient(circle_at_35%_30%,#f3e3c3,#C5A572_45%,#7a5f30)] opacity-90 animate-float" aria-hidden="true" />}
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-onix/95 via-onix/55 to-onix/5" />
              <div className="relative">
                <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white/15 backdrop-blur"><Icon className="h-[18px] w-[18px] text-champagne" aria-hidden="true" /></span>
                <p className="font-serif text-2xl font-semibold leading-tight">{title}</p>
                <p className="mt-0.5 text-[12.5px] text-marfim/75">{text}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Banner secundário + Reflexão */}
      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <Card className="flex flex-col justify-between bg-white p-7">
          <div>
            <p className="eyebrow mb-3">Reflexão do dia</p>
            <blockquote className="font-serif text-[30px] font-medium italic leading-snug text-onix sm:text-[34px]">“{reflection.quote}”</blockquote>
            <p className="mt-4 text-[15px] text-muted">{reflection.question}</p>
          </div>
          <div className="mt-6 flex items-center gap-2">
            <FavoriteButton active={isFavReflection} onToggle={() => toggleFavorite('reflections', reflection.id)} label="Favoritar reflexão" />
            <Button
              variant="outline"
              size="sm"
              onClick={async () => {
                const ok = await copyToClipboard(`“${reflection.quote}”\n${reflection.question}\n— Voz de Potência`)
                toast(ok ? 'Reflexão copiada' : 'Não foi possível copiar', ok ? 'success' : 'error')
              }}
            >
              <Copy className="h-4 w-4" aria-hidden="true" /> Copiar
            </Button>
            <Button to="/app/diario" variant="ghost" size="sm">Escrever no diário</Button>
          </div>
        </Card>
        {banner && (
          <Link to={banner.link} className="group relative flex min-h-[240px] flex-col justify-end overflow-hidden rounded-2xl p-6 text-marfim">
            <img src={banner.image} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-rubi-deep/95 via-rubi-deep/40 to-transparent" />
            <div className="relative">
              <p className="font-serif text-[28px] font-semibold leading-tight">{banner.title}</p>
              <p className="mt-1 text-[13px] text-marfim/80">{banner.subtitle}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-champagne">
                {banner.cta} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </div>
          </Link>
        )}
      </div>
    </div>
  )
}
