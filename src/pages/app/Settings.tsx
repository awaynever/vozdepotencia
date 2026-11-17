import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Accessibility, Bell, Download, FileText, Heart, History, LogOut, Lock, RotateCcw, Shield, Sparkles, Target, User, Route } from 'lucide-react'
import { Badge, Button, Card, Chip, DemoNotice, Field, PageHeader, ProgressBar, Toggle } from '@/components/ui/primitives'
import { Modal } from '@/components/ui/Modal'
import { useAppStore } from '@/store/useAppStore'
import { useContentStore } from '@/store/useContentStore'
import { useJourney } from '@/hooks/useProgress'
import { onboardingGoals } from '@/mocks/assessments'
import { images } from '@/mocks/images'
import { reflections } from '@/mocks/journeys'
import { audioStore } from '@/services/audioStore'
import { downloadText } from '@/services/exportService'
import { formatShort } from '@/utils/date'
import { toast } from '@/store/useToastStore'
import { cn } from '@/utils/cn'

const avatarOptions = [images.retratoEbony, images.cachosEstudio, images.sorrisoAberto, images.profissionalAzul, images.blazerRosa, images.maduraCachos, images.latinaRetrato, images.asiaticaRiso, images.brancaSorriso, images.maduraSorriso]

const sections = [
  { id: 'perfil', label: 'Informações pessoais', icon: User },
  { id: 'objetivos', label: 'Objetivos e preferências', icon: Target },
  { id: 'jornada', label: 'Jornada e plano', icon: Route },
  { id: 'notificacoes', label: 'Notificações', icon: Bell },
  { id: 'favoritos', label: 'Favoritos', icon: Heart },
  { id: 'historico', label: 'Histórico', icon: History },
  { id: 'acessibilidade', label: 'Acessibilidade', icon: Accessibility },
  { id: 'privacidade', label: 'Privacidade', icon: Shield },
  { id: 'termos', label: 'Termos de uso', icon: FileText },
]

const profileSchema = z.object({
  name: z.string().trim().min(3, 'Informe seu nome'),
  firstName: z.string().trim().min(2, 'Como prefere ser chamada?'),
  email: z.string().trim().email('E-mail inválido'),
  profession: z.string().trim().min(2, 'Informe sua profissão'),
  city: z.string().trim().min(2, 'Informe sua cidade'),
  age: z.coerce.number().int().min(16, 'Idade mínima: 16').max(110, 'Idade inválida'),
  bio: z.string().max(280, 'Até 280 caracteres'),
})
type ProfileForm = z.input<typeof profileSchema>
type ProfileOut = z.output<typeof profileSchema>

export default function Settings() {
  const state = useAppStore()
  const { profile, settings, favorites, activityLog, onboarding } = state
  const content = useContentStore()
  const { journey, completedDays, percent } = useJourney()
  const navigate = useNavigate()
  const location = useLocation()
  const [confirmReset, setConfirmReset] = useState(false)
  const [goals, setGoals] = useState<string[]>(onboarding.goals)

  const { register, handleSubmit, formState: { errors, isDirty }, reset } = useForm<ProfileForm, unknown, ProfileOut>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: profile.name, firstName: profile.firstName, email: profile.email, profession: profile.profession, city: profile.city, age: profile.age, bio: profile.bio },
  })

  useEffect(() => {
    const secao = new URLSearchParams(location.search).get('secao')
    if (secao) setTimeout(() => document.getElementById(secao)?.scrollIntoView({ behavior: 'smooth' }), 200)
  }, [location.search])

  const saveProfile = (v: ProfileOut) => {
    state.updateProfile(v)
    reset(v)
    toast('Perfil atualizado', 'success')
  }

  const exportData = () => {
    const { celebrations, ...data } = useAppStore.getState()
    void celebrations
    const plain = JSON.parse(JSON.stringify(data, (_k, v) => (typeof v === 'function' ? undefined : v)))
    downloadText(JSON.stringify(plain, null, 2), 'meus-dados-voz-de-potencia.json', 'application/json')
    toast('Dados exportados', 'success')
  }

  const doReset = async () => {
    state.resetDemo()
    content.resetContent()
    await audioStore.clear()
    setConfirmReset(false)
    toast('Demonstração restaurada ao estado inicial', 'success')
    navigate('/app')
  }

  const favCards = content.responseCards.filter((c) => favorites.cards.includes(c.id))
  const favRituals = content.rituals.filter((r) => favorites.rituals.includes(r.id))
  const favLibrary = content.library.filter((l) => favorites.library.includes(l.id))
  const favReflections = reflections.filter((r) => favorites.reflections.includes(r.id))

  return (
    <div>
      <PageHeader eyebrow="Perfil" title="Configurações" description="Gerencie seus dados, preferências e a demonstração." />

      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <nav className="hidden lg:block" aria-label="Seções de configurações">
          <ul className="sticky top-6 space-y-0.5">
            {sections.map(({ id, label, icon: I }) => (
              <li key={id}><a href={`#${id}`} className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] text-onix/80 hover:bg-bege/60 hover:text-onix"><I className="h-4 w-4 text-muted" aria-hidden="true" />{label}</a></li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0 space-y-6">
          <Card id="perfil" className="scroll-mt-24 p-5 sm:p-7">
            <h2 className="text-[26px]">Informações pessoais</h2>
            <div className="mt-5">
              <p className="mb-2 text-[13px] font-semibold">Avatar</p>
              <div className="flex flex-wrap gap-2.5" role="radiogroup" aria-label="Escolher avatar">
                {avatarOptions.map((a, i) => (
                  <button key={a} role="radio" aria-checked={profile.avatar === a} aria-label={`Avatar ${i + 1}`} onClick={() => { state.updateProfile({ avatar: a }); toast('Avatar atualizado') }} className={cn('rounded-full p-0.5 transition-all', profile.avatar === a ? 'ring-2 ring-rubi ring-offset-2' : 'opacity-80 hover:opacity-100')}>
                    <img src={a} alt="" className="h-12 w-12 rounded-full object-cover" />
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[11.5px] text-muted">Imagens ilustrativas. Em produção, será possível enviar sua própria foto.</p>
            </div>
            <form onSubmit={handleSubmit(saveProfile)} className="mt-6 grid gap-4 sm:grid-cols-2" noValidate>
              <Field label="Nome completo" htmlFor="s-name" error={errors.name?.message}><input id="s-name" className="input" {...register('name')} /></Field>
              <Field label="Como prefere ser chamada" htmlFor="s-first" error={errors.firstName?.message}><input id="s-first" className="input" {...register('firstName')} /></Field>
              <Field label="E-mail" htmlFor="s-email" error={errors.email?.message}><input id="s-email" type="email" className="input" {...register('email')} /></Field>
              <Field label="Profissão" htmlFor="s-prof" error={errors.profession?.message}><input id="s-prof" className="input" {...register('profession')} /></Field>
              <Field label="Cidade" htmlFor="s-city" error={errors.city?.message}><input id="s-city" className="input" {...register('city')} /></Field>
              <Field label="Idade" htmlFor="s-age" error={errors.age?.message}><input id="s-age" type="number" className="input" {...register('age')} /></Field>
              <div className="sm:col-span-2"><Field label="Sobre mim" htmlFor="s-bio" error={errors.bio?.message}><textarea id="s-bio" rows={3} className="input" {...register('bio')} /></Field></div>
              <div className="sm:col-span-2"><Button type="submit" disabled={!isDirty}>Salvar alterações</Button></div>
            </form>
          </Card>

          <Card id="objetivos" className="scroll-mt-24 p-5 sm:p-7">
            <h2 className="text-[26px]">Objetivos e preferências</h2>
            <p className="mt-1 text-[13.5px] text-muted">Escolha até três objetivos prioritários.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {onboardingGoals.map((g) => {
                const on = goals.includes(g.id)
                return <Chip key={g.id} active={on} disabled={!on && goals.length >= 3} className="disabled:opacity-40" onClick={() => setGoals(on ? goals.filter((x) => x !== g.id) : [...goals, g.id])}>{g.label}</Chip>
              })}
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Tempo diário" htmlFor="s-min">
                <select id="s-min" className="input" value={profile.dailyMinutes} onChange={(e) => state.updateProfile({ dailyMinutes: Number(e.target.value) })}>
                  {[5, 10, 15, 20].map((m) => <option key={m} value={m}>{m} minutos por dia</option>)}
                </select>
              </Field>
              <Field label="Horário do lembrete" htmlFor="s-time">
                <input id="s-time" type="time" className="input" value={settings.reminderTime} onChange={(e) => state.updateSettings({ reminderTime: e.target.value })} />
              </Field>
            </div>
            <Button className="mt-5" variant="outline" onClick={() => { useAppStore.setState((s) => ({ onboarding: { ...s.onboarding, goals } })); toast('Objetivos salvos', 'success') }}>Salvar objetivos</Button>
          </Card>

          <Card id="jornada" className="scroll-mt-24 p-5 sm:p-7">
            <h2 className="text-[26px]">Jornada e plano</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-marfim p-4">
                <p className="text-[12px] text-muted">Jornada atual</p>
                <p className="font-serif text-xl font-semibold">{journey.title}</p>
                <ProgressBar value={percent} className="mt-2" label="Progresso" />
                <p className="mt-1 text-[12px] text-muted">{completedDays.length} de {journey.totalDays} dias · {percent}%</p>
                <Button to="/app/jornada" variant="ghost" size="sm" className="-ml-2 mt-1">Abrir jornada</Button>
              </div>
              <div className="rounded-xl bg-marfim p-4">
                <p className="text-[12px] text-muted">Plano</p>
                <p className="font-serif text-xl font-semibold">{content.plans.find((p) => p.id === profile.plan)?.name}</p>
                <p className="mt-1 text-[12.5px] text-muted">Alterne entre planos para demonstrar os estados de acesso.</p>
                <Button to="/app/planos" variant="ghost" size="sm" className="-ml-2 mt-1"><Sparkles className="h-4 w-4" aria-hidden="true" /> Gerenciar plano</Button>
              </div>
            </div>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => { state.restartOnboarding(); navigate('/onboarding') }}>Refazer onboarding</Button>
          </Card>

          <Card id="notificacoes" className="scroll-mt-24 p-5 sm:p-7">
            <h2 className="text-[26px]">Notificações</h2>
            <p className="mt-1 text-[12.5px] text-muted">Preferências salvas localmente. Nenhuma notificação real é enviada nesta versão.</p>
            <div className="mt-3 divide-y divide-line">
              <Toggle label="Lembrete diário" description={`Todos os dias às ${settings.reminderTime}`} checked={settings.notifications.daily} onChange={(v) => state.updateSettings({ notifications: { ...settings.notifications, daily: v } })} />
              <Toggle label="Novas missões" description="Quando uma nova missão de coragem estiver disponível" checked={settings.notifications.missions} onChange={(v) => state.updateSettings({ notifications: { ...settings.notifications, missions: v } })} />
              <Toggle label="Comunidade" description="Respostas e reações às suas publicações" checked={settings.notifications.community} onChange={(v) => state.updateSettings({ notifications: { ...settings.notifications, community: v } })} />
              <Toggle label="Resumo por e-mail" description="Retrospectiva semanal" checked={settings.notifications.email} onChange={(v) => state.updateSettings({ notifications: { ...settings.notifications, email: v } })} />
            </div>
          </Card>

          <Card id="favoritos" className="scroll-mt-24 p-5 sm:p-7">
            <h2 className="text-[26px]">Favoritos</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {[
                { title: 'Respostas Poderosas', items: favCards.map((c) => ({ id: c.id, label: c.response, to: `/app/respostas?card=${c.id}` })) },
                { title: 'Rituais', items: favRituals.map((r) => ({ id: r.id, label: r.title, to: `/app/rituais/${r.id}` })) },
                { title: 'Biblioteca', items: favLibrary.map((l) => ({ id: l.id, label: l.title, to: `/app/biblioteca/${l.id}` })) },
                { title: 'Reflexões', items: favReflections.map((r) => ({ id: r.id, label: r.quote, to: '/app' })) },
              ].map((g) => (
                <div key={g.title} className="rounded-xl bg-marfim p-4">
                  <p className="text-[13px] font-semibold">{g.title} <span className="font-normal text-muted">({g.items.length})</span></p>
                  {g.items.length === 0 ? <p className="mt-1 text-[12.5px] text-muted">Nenhum favorito.</p> : (
                    <ul className="mt-2 space-y-1">
                      {g.items.slice(0, 5).map((i) => <li key={i.id}><Link to={i.to} className="line-clamp-1 text-[13px] text-rubi hover:underline">{i.label}</Link></li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </Card>

          <Card id="historico" className="scroll-mt-24 p-5 sm:p-7">
            <h2 className="text-[26px]">Histórico</h2>
            <ul className="mt-3 max-h-80 divide-y divide-line overflow-y-auto pr-1">
              {[...activityLog].reverse().slice(0, 25).map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-3 py-2.5 text-[13.5px]">
                  <span className="min-w-0 truncate">{e.label}</span>
                  <span className="flex shrink-0 items-center gap-2 text-[12px] text-muted">{e.points > 0 && <Badge tone="gold">+{e.points}</Badge>}{formatShort(e.date)}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card id="acessibilidade" className="scroll-mt-24 p-5 sm:p-7">
            <h2 className="text-[26px]">Acessibilidade</h2>
            <div className="mt-3 divide-y divide-line">
              <Toggle label="Texto ampliado" description="Aumenta o tamanho base dos textos" checked={settings.largeText} onChange={(v) => state.updateSettings({ largeText: v })} />
              <Toggle label="Alto contraste" description="Reforça bordas e textos secundários" checked={settings.highContrast} onChange={(v) => state.updateSettings({ highContrast: v })} />
              <Toggle label="Reduzir animações" description="Minimiza movimentos na interface (também respeitamos a preferência do sistema)" checked={settings.reduceMotion} onChange={(v) => state.updateSettings({ reduceMotion: v })} />
            </div>
          </Card>

          <Card id="privacidade" className="scroll-mt-24 p-5 sm:p-7">
            <h2 className="text-[26px]">Privacidade</h2>
            <p className="mt-2 text-[14px] text-onix/85">Nesta demonstração, todos os dados ficam armazenados apenas no seu navegador (localStorage e IndexedDB). Nada é enviado para servidores. Não armazenamos senhas, dados de pagamento ou informações confidenciais.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="outline" onClick={exportData}><Download className="h-4 w-4" aria-hidden="true" /> Exportar meus dados</Button>
              <Button variant="outline" onClick={async () => { await audioStore.clear(); toast('Gravações de voz excluídas') }}><Lock className="h-4 w-4" aria-hidden="true" /> Excluir gravações de voz</Button>
            </div>
          </Card>

          <Card id="termos" className="scroll-mt-24 p-5 sm:p-7">
            <h2 className="text-[26px]">Termos de uso</h2>
            <div className="mt-3 space-y-3 text-[14px] text-onix/85">
              <p>A Voz de Potência é uma plataforma educacional de desenvolvimento comportamental. Seus conteúdos, questionários e simulações não constituem diagnóstico, tratamento psicológico, aconselhamento jurídico ou financeiro.</p>
              <p>O Mapa da Potência representa a autopercepção da usuária e não mede capacidades de forma objetiva. O Método POTÊNCIA é uma estrutura educacional autoral, sem alegações de validação científica específica.</p>
              <p>Esta versão é um protótipo demonstrativo: perfis, publicações, indicadores comerciais e análises automáticas utilizam dados fictícios. Fotografias de banco de imagens (Unsplash) são utilizadas para fins ilustrativos.</p>
              <p>Se você estiver em situação de risco ou sofrimento, procure apoio: CVV (188) e Central de Atendimento à Mulher (180).</p>
            </div>
          </Card>

          <Card className="border-rubi/30 p-5 sm:p-7">
            <h2 className="text-[26px]">Demonstração</h2>
            <DemoNotice className="mt-3">Restaurar a demonstração devolve todos os dados (perfil, progresso, diário, favoritos, comunidade, conteúdos editados no painel e gravações) ao estado inicial da usuária Marina.</DemoNotice>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={() => setConfirmReset(true)}><RotateCcw className="h-4 w-4" aria-hidden="true" /> Restaurar demonstração</Button>
              <Button variant="ghost" onClick={() => navigate('/')}><LogOut className="h-4 w-4" aria-hidden="true" /> Sair</Button>
            </div>
          </Card>
        </div>
      </div>

      <Modal open={confirmReset} onOpenChange={setConfirmReset} size="sm" title="Restaurar demonstração?" description="Todos os dados locais voltarão ao estado inicial."
        footer={<><Button variant="ghost" onClick={() => setConfirmReset(false)}>Cancelar</Button><Button onClick={doReset}>Restaurar</Button></>}>
        <p className="text-[14px]">Esta ação apaga o progresso, os registros do diário, as interações e as edições feitas no painel administrativo neste navegador.</p>
      </Modal>
    </div>
  )
}
