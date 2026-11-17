import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, Check, ChevronDown, Mic, Play, Shield, Sparkles, Target, TrendingUp, HeartHandshake, MessageCircle, Lock,
} from 'lucide-react'
import { Logo, Monogram } from '@/components/ui/Logo'
import { Badge, Button, DemoTag } from '@/components/ui/primitives'
import { PowerRadar } from '@/components/charts/PowerRadar'
import { images } from '@/mocks/images'
import { pillars } from '@/mocks/method'
import { faq, plans } from '@/mocks/plans'
import { simulations } from '@/mocks/simulations'
import { journeys } from '@/mocks/journeys'
import { currentAssessmentScores, initialAssessmentScores } from '@/mocks/assessments'
import { sampleVoiceAnalysis } from '@/mocks/voiceExercises'
import { cn } from '@/utils/cn'

const CURRENT_YEAR = new Date().getFullYear()

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
}

const problems = [
  { icon: MessageCircle, title: 'Ser interrompida em reuniões', text: 'E sair com a sensação de que sua ideia não foi ouvida.' },
  { icon: Shield, title: 'Dizer sim quando queria dizer não', text: 'E ver sua agenda e sua energia tomadas por compromissos que não escolheu.' },
  { icon: TrendingUp, title: 'Cobrar menos do que vale', text: 'Por medo de parecer cara ou de perder a oportunidade.' },
  { icon: Mic, title: 'Travar ao falar em público', text: 'Mesmo dominando o assunto e tendo se preparado.' },
  { icon: HeartHandshake, title: 'Adiar conversas difíceis', text: 'Com a família, a equipe, clientes ou sócias.' },
  { icon: Target, title: 'Duvidar das próprias conquistas', text: 'E esperar a confiança chegar para só então agir.' },
]

const benefits = [
  'Prática guiada em situações reais, não apenas teoria',
  'Atividades de 5 a 20 minutos que cabem na sua rotina',
  'Acompanhamento visual da sua evolução',
  'Sem punição por ausências: você retoma de onde parou',
  'Conteúdos originais, criados para mulheres brasileiras',
  'Ambiente acolhedor, discreto e sofisticado',
]

function Nav() {
  const [open, setOpen] = useState(false)
  const links = [
    ['#metodo', 'Método'],
    ['#laboratorio', 'Laboratório'],
    ['#jornada', 'Jornada'],
    ['#planos', 'Planos'],
    ['#faq', 'Dúvidas'],
  ]
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-rubi-deep/80 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link to="/" aria-label="Voz de Potência">
          <Logo light compact />
        </Link>
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Seções">
          {links.map(([href, label]) => (
            <a key={href} href={href} className="text-[13px] font-medium text-marfim/80 transition-colors hover:text-champagne">
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/app" className="hidden rounded-lg px-3 py-2 text-[12.5px] font-medium text-marfim/70 hover:text-marfim sm:inline-flex">
            Acessar demonstração
          </Link>
          <Button to="/onboarding" variant="gold" size="sm" className="hidden sm:inline-flex">
            Descubra sua potência
          </Button>
          <button className="inline-flex h-10 w-10 items-center justify-center rounded-full text-marfim lg:hidden" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-label="Abrir menu">
            <ChevronDown className={cn('h-5 w-5 transition-transform', open && 'rotate-180')} aria-hidden="true" />
          </button>
        </div>
      </div>
      {open && (
        <div className="border-t border-white/10 bg-rubi-deep px-5 pb-5 lg:hidden">
          {links.map(([href, label]) => (
            <a key={href} href={href} onClick={() => setOpen(false)} className="block border-b border-white/5 py-3 text-sm text-marfim/85">
              {label}
            </a>
          ))}
          <div className="mt-4 flex flex-col gap-2">
            <Button to="/onboarding" variant="gold">Descubra sua potência</Button>
            <Button to="/app" variant="ghost" className="text-marfim hover:bg-white/10">Acessar demonstração</Button>
          </div>
        </div>
      )}
    </header>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-rubi-deep pt-18 text-marfim">
      <div className="pointer-events-none absolute inset-0 opacity-60" style={{ background: 'radial-gradient(1200px 600px at 85% 10%, rgba(197,165,114,0.18), transparent 60%), radial-gradient(900px 500px at 0% 100%, rgba(101,15,29,0.9), transparent 60%)' }} />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-champagne/30 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-champagne">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> Desenvolvimento comportamental feminino
          </p>
          <h1 className="text-[46px] leading-[0.98] text-marfim sm:text-[64px] lg:text-[76px]">
            O mundo precisa ouvir <em className="font-serif italic text-champagne">a sua voz.</em>
          </h1>
          <p className="mt-6 max-w-xl text-[16.5px] leading-relaxed text-marfim/75">
            Uma experiência de desenvolvimento comportamental criada para mulheres que desejam fortalecer sua confiança, transformar sua comunicação e construir novas possibilidades.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button to="/onboarding" variant="gold" size="lg">
              Descubra sua potência <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <a href="#experiencia" className="inline-flex h-13 items-center justify-center gap-2 rounded-xl border border-marfim/25 px-7 text-[15px] font-semibold text-marfim transition-colors hover:border-champagne hover:text-champagne">
              Explore a experiência
            </a>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-[13px] text-marfim/65">
            {['Jornada de 21 dias', '30 simulações práticas', '5 a 20 minutos por dia'].map((t) => (
              <span key={t} className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 text-champagne" aria-hidden="true" /> {t}
              </span>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.1 }} className="relative">
          <div className="absolute -inset-4 rounded-[28px] border border-champagne/25" aria-hidden="true" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl sm:aspect-[5/5] lg:aspect-[4/5]">
            <img src={images.heroDuo} alt="Duas mulheres, uma preta e uma branca, conversando com confiança diante de uma janela ampla em um escritório" className="h-full w-full object-cover object-[30%_center]" />
            <div className="absolute inset-0 bg-gradient-to-t from-rubi-deep/70 via-transparent to-transparent" />
          </div>
          <div className="absolute -bottom-6 left-4 right-4 rounded-2xl border border-white/10 bg-onix/80 p-4 backdrop-blur-md sm:left-auto sm:right-[-12px] sm:w-72">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.18em] text-champagne">Missão de coragem</p>
            <p className="mt-1 font-serif text-xl leading-snug text-marfim">Sua opinião merece espaço.</p>
            <p className="mt-1 text-[12.5px] text-marfim/65">Expresse uma ideia sem se desculpar antes. 5 min.</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Presentation() {
  return (
    <section id="experiencia" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <motion.div {...fadeUp}>
          <p className="eyebrow mb-3">A Voz de Potência</p>
          <h2 className="text-[38px] sm:text-[50px]">Não é um curso. É um espaço para você praticar quem quer ser.</h2>
          <p className="mt-6 text-[16px] leading-relaxed text-muted">
            Aqui você aprende, pratica conversas reais, estabelece objetivos e acompanha sua evolução. Cada dia traz uma atividade curta, uma missão no mundo real e um momento de reflexão.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4">
            {[
              ['Aprender', 'Conteúdos originais e objetivos'],
              ['Praticar', 'Simulações, gravações e missões'],
              ['Refletir', 'Diário e rituais guiados'],
              ['Evoluir', 'Mapa e painel de progresso'],
            ].map(([t, d]) => (
              <div key={t} className="border-l-2 border-champagne pl-4">
                <p className="font-serif text-2xl font-semibold">{t}</p>
                <p className="text-[13px] text-muted">{d}</p>
              </div>
            ))}
          </div>
        </motion.div>
        <motion.div {...fadeUp} className="grid grid-cols-2 gap-4">
          <img src={images.profissionalTrancas} alt="Mulher preta profissional sorrindo, em pé, em um escritório iluminado" className="aspect-[3/4] w-full rounded-2xl object-cover" loading="lazy" />
          <div className="mt-12 space-y-4">
            <img src={images.maduraEscritorio} alt="Mulher madura em um escritório, sorrindo" className="aspect-square w-full rounded-2xl object-cover" loading="lazy" />
            <img src={images.asiaticaOculos} alt="Jovem profissional de óculos em ambiente de trabalho" className="aspect-[4/3] w-full rounded-2xl object-cover" loading="lazy" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function MethodSection() {
  const [active, setActive] = useState(0)
  const p = pillars[active]
  return (
    <section id="metodo" className="bg-onix py-24 text-marfim">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div {...fadeUp} className="max-w-2xl">
          <p className="eyebrow mb-3 text-champagne">Conheça o método</p>
          <h2 className="text-[40px] text-marfim sm:text-[54px]">Método POTÊNCIA</h2>
          <p className="mt-4 text-marfim/70">Oito pilares que organizam o seu desenvolvimento, do autoconhecimento à autonomia. Uma estrutura educacional autoral da Voz de Potência.</p>
        </motion.div>
        <div className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="grid grid-cols-4 gap-2 sm:gap-3" role="tablist" aria-label="Pilares do método">
            {pillars.map((pl, i) => (
              <button
                key={pl.id}
                role="tab"
                aria-selected={active === i}
                onClick={() => setActive(i)}
                className={cn(
                  'group flex aspect-square flex-col items-center justify-center rounded-2xl border transition-all',
                  active === i ? 'border-champagne bg-rubi' : 'border-white/10 bg-white/[0.03] hover:border-champagne/50',
                )}
              >
                <span className={cn('font-serif text-[44px] font-semibold leading-none sm:text-[64px]', active === i ? 'text-champagne' : 'text-marfim/85')}>{pl.letter}</span>
                <span className="mt-1 hidden px-1 text-center text-[11px] font-medium text-marfim/70 sm:block">{pl.name}</span>
              </button>
            ))}
          </div>
          <motion.div key={p.id} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
            <img src={p.image} alt="" className="h-48 w-full object-cover opacity-90" loading="lazy" />
            <div className="p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-champagne">Pilar {p.letter}</p>
              <h3 className="mt-1 text-3xl text-marfim">{p.name}</h3>
              <p className="mt-1 font-serif text-lg italic text-champagne/90">{p.tagline}</p>
              <p className="mt-3 text-[14px] leading-relaxed text-marfim/70">{p.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.skills.map((s) => (
                  <span key={s} className="rounded-full border border-white/15 px-2.5 py-1 text-[11.5px] text-marfim/80">{s}</span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function Problems() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
        <p className="eyebrow mb-3">Situações do dia a dia</p>
        <h2 className="text-[38px] sm:text-[48px]">Você se reconhece em alguma destas situações?</h2>
      </motion.div>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {problems.map(({ icon: Icon, title, text }) => (
          <motion.div key={title} {...fadeUp} className="card p-6 transition-shadow hover:shadow-lift">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-rubi-soft text-rubi">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-2xl">{title}</h3>
            <p className="mt-1.5 text-sm text-muted">{text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

function LabDemo() {
  const sim = simulations[0]
  const [choice, setChoice] = useState<string | null>(null)
  const opt = sim.options.find((o) => o.id === choice)
  return (
    <section id="laboratorio" className="bg-bege/60 py-24">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
        <motion.div {...fadeUp}>
          <p className="eyebrow mb-3">Laboratório Comportamental</p>
          <h2 className="text-[38px] sm:text-[48px]">Ensaie conversas difíceis antes que elas aconteçam.</h2>
          <p className="mt-5 text-muted">Trinta situações reais de trabalho, família, negociação, vendas e limites. Escolha uma resposta e receba um feedback sobre clareza, assertividade, respeito e contexto.</p>
          <ul className="mt-6 space-y-2 text-sm">
            {['10 categorias de situações', 'Três níveis de dificuldade', 'Feedback detalhado e sugestões de melhoria', 'Repita quantas vezes quiser'].map((t) => (
              <li key={t} className="flex items-center gap-2.5"><Check className="h-4 w-4 text-rubi" aria-hidden="true" /> {t}</li>
            ))}
          </ul>
        </motion.div>
        <motion.div {...fadeUp} className="card overflow-hidden">
          <div className="relative h-40">
            <img src={sim.image} alt="" className="h-full w-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-onix/80 to-transparent" />
            <div className="absolute bottom-4 left-5 right-5">
              <Badge tone="gold" className="bg-champagne text-onix">{sim.category}</Badge>
              <p className="mt-1.5 font-serif text-2xl font-semibold text-white">{sim.title}</p>
            </div>
          </div>
          <div className="p-5 sm:p-6">
            <p className="text-sm text-onix/85">{sim.situation}</p>
            <p className="mt-4 text-[13px] font-semibold">Como você responderia?</p>
            <div className="mt-3 space-y-2">
              {sim.options.map((o, i) => (
                <button
                  key={o.id}
                  onClick={() => setChoice(o.id)}
                  className={cn('flex w-full items-start gap-3 rounded-xl border p-3 text-left text-[13.5px] transition-colors', choice === o.id ? 'border-rubi bg-rubi-soft' : 'border-line bg-white hover:border-champagne')}
                >
                  <span className={cn('flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold', choice === o.id ? 'bg-rubi text-white' : 'bg-bege')}>{String.fromCharCode(65 + i)}</span>
                  {o.text}
                </button>
              ))}
            </div>
            {opt && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-xl bg-marfim p-4">
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[['Clareza', opt.clarity], ['Assertividade', opt.assertiveness], ['Respeito', opt.respect]].map(([l, v]) => (
                    <div key={l as string}>
                      <p className="font-serif text-2xl font-semibold text-rubi">{v}/5</p>
                      <p className="text-[11px] text-muted">{l}</p>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-[13px] text-onix/85">{opt.consequences}</p>
                <Link to="/app/laboratorio" className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-rubi hover:underline">
                  Ver feedback completo no Laboratório <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function AcademySection() {
  const a = sampleVoiceAnalysis
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <motion.div {...fadeUp} className="order-2 lg:order-1">
          <div className="relative overflow-hidden rounded-3xl">
            <img src={images.palcoMicrofone} alt="Microfone em destaque em um auditório" className="h-[420px] w-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-onix/90 via-onix/30 to-transparent" />
            <div className="absolute inset-x-5 bottom-5 rounded-2xl border border-white/10 bg-onix/70 p-5 text-marfim backdrop-blur-md">
              <div className="flex items-center gap-3">
                <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-rubi">
                  <span className="absolute inset-0 rounded-full border border-rubi animate-pulse-ring" />
                  <Mic className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-champagne">Gravação de exemplo</p>
                  <p className="font-serif text-xl">Apresente-se em 30 segundos</p>
                </div>
                <span className="ml-auto font-mono text-sm text-marfim/70">{a.duration}</span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div><p className="font-serif text-2xl text-champagne">{a.wpm}</p><p className="text-[11px] text-marfim/60">palavras/min</p></div>
                <div><p className="font-serif text-2xl text-champagne">{a.pauses}</p><p className="text-[11px] text-marfim/60">pausas</p></div>
                <div><p className="font-serif text-2xl text-champagne">{a.fillerWords}</p><p className="text-[11px] text-marfim/60">preenchimentos</p></div>
              </div>
            </div>
          </div>
        </motion.div>
        <motion.div {...fadeUp} className="order-1 lg:order-2">
          <p className="eyebrow mb-3">Academia da Voz</p>
          <h2 className="text-[38px] sm:text-[48px]">Sua voz, treinada com intenção.</h2>
          <p className="mt-5 text-muted">Doze módulos de comunicação e oratória, de respiração e pausas a negociação e liderança. Grave-se, ouça e evolua com exercícios práticos.</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {['Dicção', 'Ritmo', 'Pausas', 'Respiração', 'Clareza', 'Argumentação', 'Storytelling', 'Improvisação', 'Assertividade', 'Apresentações', 'Negociação', 'Liderança'].map((m) => (
              <span key={m} className="rounded-full border border-line bg-white px-3 py-1 text-[12.5px]">{m}</span>
            ))}
          </div>
          <p className="mt-5 text-[12.5px] text-muted">Sotaques e características naturais da voz são respeitados. As gravações ficam apenas no seu dispositivo.</p>
        </motion.div>
      </div>
    </section>
  )
}

function JourneySection() {
  const j = journeys[0]
  return (
    <section id="jornada" className="bg-rubi py-24 text-marfim">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div {...fadeUp} className="max-w-2xl">
          <p className="eyebrow mb-3 text-champagne">Jornada de 21 dias</p>
          <h2 className="text-[38px] text-marfim sm:text-[50px]">Despertar. Expressar. Expandir.</h2>
          <p className="mt-4 text-marfim/75">Três fases, sete dias cada. Conteúdo, exercício, missão prática e reflexão em cada etapa, no seu ritmo.</p>
        </motion.div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {j.phases.map((ph) => (
            <motion.div key={ph.id} {...fadeUp} className="rounded-2xl border border-white/15 bg-rubi-deep/50 p-6">
              <div className="flex items-baseline justify-between">
                <p className="font-serif text-[56px] font-semibold leading-none text-champagne">0{ph.id}</p>
                <span className="text-[12px] text-marfim/60">{ph.subtitle}</span>
              </div>
              <h3 className="mt-3 text-3xl text-marfim">{ph.name}</h3>
              <p className="mt-1 text-sm text-marfim/70">{ph.description}</p>
              <ul className="mt-5 space-y-2 border-t border-white/10 pt-4">
                {j.days.filter((d) => d.phase === ph.id).slice(0, 4).map((d) => (
                  <li key={d.day} className="flex gap-3 text-[13px] text-marfim/80">
                    <span className="w-6 shrink-0 font-semibold text-champagne">{d.day}</span>
                    {d.title}
                  </li>
                ))}
                <li className="pl-9 text-[12px] text-marfim/50">e mais 3 dias…</li>
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function MapSection() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <motion.div {...fadeUp}>
          <p className="eyebrow mb-3">Mapa da Potência</p>
          <h2 className="text-[38px] sm:text-[48px]">Veja sua evolução em oito dimensões.</h2>
          <p className="mt-5 text-muted">Comunicação, autoconfiança, inteligência emocional, autonomia, disciplina, liderança, limites pessoais e energia. Um retrato da sua autopercepção, que você pode refazer sempre que quiser.</p>
          <p className="mt-4 text-[12.5px] text-muted">O Mapa é uma ferramenta educacional de autopercepção e não constitui diagnóstico psicológico.</p>
        </motion.div>
        <motion.div {...fadeUp} className="card p-4 sm:p-6">
          <div className="mb-2 flex items-center justify-between">
            <p className="font-serif text-xl font-semibold">Exemplo de mapa</p>
            <DemoTag label="Dados ilustrativos" />
          </div>
          <PowerRadar current={currentAssessmentScores} initial={initialAssessmentScores} height={340} />
        </motion.div>
      </div>
    </section>
  )
}

function AuroraSection() {
  return (
    <section className="bg-onix py-24 text-marfim">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
        <motion.div {...fadeUp}>
          <p className="eyebrow mb-3 text-champagne">Assistente Aurora</p>
          <h2 className="text-[38px] text-marfim sm:text-[48px]">Uma mentora digital para ensaiar o que você precisa dizer.</h2>
          <p className="mt-5 text-marfim/70">Converse sobre como pedir um aumento, responder a interrupções ou se preparar para uma entrevista. Simule diálogos com gestores, clientes e familiares.</p>
          <p className="mt-4 text-[12.5px] text-marfim/50">Recurso do Clube Voz de Potência (lançamento futuro). Na demonstração, a Aurora utiliza respostas predefinidas.</p>
        </motion.div>
        <motion.div {...fadeUp} className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
          <div className="flex items-center gap-3">
            <span className="relative h-12 w-12 rounded-full bg-[radial-gradient(circle_at_35%_30%,#f3e3c3,#C5A572_45%,#7a5f30)] animate-float" aria-hidden="true" />
            <div>
              <p className="font-serif text-2xl">Aurora</p>
              <p className="text-[12px] text-marfim/60">Mentora de comunicação</p>
            </div>
          </div>
          <div className="mt-6 space-y-3 text-[14px]">
            <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-rubi px-4 py-2.5">Como dizer não sem culpa?</div>
            <div className="max-w-[90%] rounded-2xl rounded-bl-md bg-white/[0.07] px-4 py-3 text-marfim/90">
              A culpa costuma aparecer quando aprendemos que recusar é falta de gentileza. Mas cada "sim" contra a sua vontade é um "não" para algo importante para você. Um "não" curto é completo.
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Benefits() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <motion.div {...fadeUp} className="relative">
          <img src={images.risoReuniao} alt="Mulheres sorrindo durante uma reunião de trabalho" className="aspect-[4/3] w-full rounded-3xl object-cover" loading="lazy" />
        </motion.div>
        <motion.div {...fadeUp}>
          <p className="eyebrow mb-3">Benefícios</p>
          <h2 className="text-[38px] sm:text-[48px]">Feita para a sua vida real.</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {benefits.map((b) => (
              <li key={b} className="flex gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-champagne-soft text-champagne-ink"><Check className="h-3.5 w-3.5" aria-hidden="true" /></span>
                <span className="text-[14.5px]">{b}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  )
}

function PlansSection() {
  return (
    <section id="planos" className="bg-bege/60 py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-3">Planos de acesso</p>
          <h2 className="text-[38px] sm:text-[48px]">Escolha como começar.</h2>
        </motion.div>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {plans.map((p) => (
            <motion.div key={p.id} {...fadeUp} className={cn('relative flex flex-col rounded-2xl border p-7', p.highlight ? 'border-rubi bg-rubi text-marfim shadow-lift' : 'border-line bg-white')}>
              {p.highlight && <span className="absolute -top-3 left-7 rounded-full bg-champagne px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-onix">Mais completo</span>}
              {p.comingSoon && <span className="absolute -top-3 left-7 rounded-full bg-onix px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-champagne">Lançamento futuro</span>}
              <h3 className={cn('text-[28px]', p.highlight && 'text-marfim')}>{p.name}</h3>
              <p className={cn('mt-1 text-sm', p.highlight ? 'text-marfim/70' : 'text-muted')}>{p.description}</p>
              <p className="mt-6 font-serif text-[46px] font-semibold leading-none">{p.price}</p>
              <p className={cn('mt-1 text-[13px]', p.highlight ? 'text-champagne' : 'text-muted')}>{p.priceNote}</p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2.5 text-[14px]">
                    <Check className={cn('mt-0.5 h-4 w-4 shrink-0', p.highlight ? 'text-champagne' : 'text-rubi')} aria-hidden="true" /> {f}
                  </li>
                ))}
              </ul>
              <Button
                to={p.comingSoon ? undefined : '/onboarding'}
                disabled={p.comingSoon}
                variant={p.highlight ? 'gold' : 'outline'}
                className="mt-8 w-full"
              >
                {p.comingSoon ? (<><Lock className="h-4 w-4" aria-hidden="true" /> Em breve</>) : p.id === 'free' ? 'Começar gratuitamente' : 'Quero a experiência completa'}
              </Button>
            </motion.div>
          ))}
        </div>
        <p className="mt-6 text-center text-[12.5px] text-muted">Protótipo demonstrativo: nenhum pagamento é processado.</p>
      </div>
    </section>
  )
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <section id="faq" className="mx-auto max-w-3xl px-5 py-24 sm:px-8">
      <div className="text-center">
        <p className="eyebrow mb-3">Perguntas frequentes</p>
        <h2 className="text-[38px] sm:text-[48px]">Dúvidas</h2>
      </div>
      <div className="mt-10 divide-y divide-line border-y border-line">
        {faq.map((f, i) => (
          <div key={f.q}>
            <h3>
              <button
                className="flex w-full items-center justify-between gap-4 py-5 text-left font-sans text-[15.5px] font-semibold"
                aria-expanded={open === i}
                aria-controls={`faq-${i}`}
                onClick={() => setOpen(open === i ? null : i)}
              >
                {f.q}
                <ChevronDown className={cn('h-5 w-5 shrink-0 text-champagne-ink transition-transform', open === i && 'rotate-180')} aria-hidden="true" />
              </button>
            </h3>
            <div id={`faq-${i}`} hidden={open !== i} className="pb-5 text-[14.5px] leading-relaxed text-muted">
              {f.a}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-rubi-deep text-marfim">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Logo light />
            <p className="mt-5 max-w-sm text-sm text-marfim/65">Experiência de desenvolvimento comportamental, pessoal e profissional para mulheres.</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-champagne">Plataforma</p>
            <ul className="mt-4 space-y-2 text-sm text-marfim/75">
              <li><a href="#metodo" className="hover:text-champagne">Método POTÊNCIA</a></li>
              <li><a href="#laboratorio" className="hover:text-champagne">Laboratório Comportamental</a></li>
              <li><a href="#jornada" className="hover:text-champagne">Jornada de 21 dias</a></li>
              <li><a href="#planos" className="hover:text-champagne">Planos</a></li>
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-champagne">Institucional</p>
            <ul className="mt-4 space-y-2 text-sm text-marfim/75">
              <li><Link to="/app/configuracoes?secao=termos" className="hover:text-champagne">Termos de uso</Link></li>
              <li><Link to="/app/configuracoes?secao=privacidade" className="hover:text-champagne">Privacidade</Link></li>
              <li><a href="#faq" className="hover:text-champagne">Perguntas frequentes</a></li>
              <li><Link to="/app" className="hover:text-champagne">Acessar demonstração</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-[12px] text-marfim/50 md:flex-row md:items-center md:justify-between">
          <p>© {CURRENT_YEAR} Voz de Potência. Sua voz. Sua essência. Sua potência.</p>
          <p>Protótipo demonstrativo · Fotografias: Unsplash (Licença Unsplash), uso ilustrativo.</p>
        </div>
      </div>
    </footer>
  )
}

function FloatingDemo() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  if (!show) return null
  return (
    <Link to="/app" className="fixed bottom-4 right-4 z-30 inline-flex items-center gap-2 rounded-full border border-line bg-white/95 py-1.5 pl-1.5 pr-3.5 text-[12px] font-semibold text-onix shadow-lift backdrop-blur hover:border-champagne">
      <Monogram size={26} /> <Play className="h-3 w-3 fill-rubi text-rubi" aria-hidden="true" /> Demonstração
    </Link>
  )
}

export default function Landing() {
  return (
    <div className="bg-marfim">
      <Nav />
      <main>
        <Hero />
        <Presentation />
        <MethodSection />
        <Problems />
        <LabDemo />
        <AcademySection />
        <JourneySection />
        <MapSection />
        <AuroraSection />
        <Benefits />
        <PlansSection />
        <FAQ />
      </main>
      <Footer />
      <FloatingDemo />
    </div>
  )
}
