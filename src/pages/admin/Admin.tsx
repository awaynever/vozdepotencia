import { Link, NavLink, useParams } from 'react-router-dom'
import {
  ArrowLeft, Bell, BookOpen, FlaskConical, Image, Layers, LayoutDashboard, ListChecks, MessagesSquare, Route, Settings, Sun, Target, Users, CreditCard, Eye, EyeOff,
} from 'lucide-react'
import { Badge, Button, Card, DemoNotice, Field, Toggle } from '@/components/ui/primitives'
import { Logo } from '@/components/ui/Logo'
import { SimpleBars, StackedBars } from '@/components/charts/charts'
import { useContentStore } from '@/store/useContentStore'
import { useAppStore } from '@/store/useAppStore'
import { adminKpis, adminSignupsSeries } from '@/mocks/analytics'
import { journeys } from '@/mocks/journeys'
import { images } from '@/mocks/images'
import { simulationCategories } from '@/mocks/simulations'
import { responseCategories } from '@/mocks/responseCards'
import { libraryCategories, libraryFormats } from '@/mocks/library'
import { ritualCategories } from '@/mocks/rituals'
import { communityPosts, communityProfiles } from '@/mocks/community'
import { uid } from '@/services/storage'
import { formatShort, relativeTime } from '@/utils/date'
import { toast } from '@/store/useToastStore'
import { cn } from '@/utils/cn'
import { CrudTable } from './CrudTable'
import type { AdminUser, Banner, DailyMission, LibraryItem, Notification, Plan, ResponseCard, Ritual, Simulation, PillarId } from '@/types'

const nav = [
  { id: '', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'usuarias', label: 'Usuárias', icon: Users },
  { id: 'jornadas', label: 'Jornadas', icon: Route },
  { id: 'atividades', label: 'Atividades', icon: ListChecks },
  { id: 'missoes', label: 'Missões', icon: Target },
  { id: 'simulacoes', label: 'Simulações', icon: FlaskConical },
  { id: 'cards', label: 'Cards de respostas', icon: Layers },
  { id: 'biblioteca', label: 'Biblioteca', icon: BookOpen },
  { id: 'rituais', label: 'Rituais', icon: Sun },
  { id: 'banners', label: 'Banners', icon: Image },
  { id: 'planos', label: 'Planos', icon: CreditCard },
  { id: 'notificacoes', label: 'Notificações', icon: Bell },
  { id: 'comunidade', label: 'Comunidade', icon: MessagesSquare },
  { id: 'configuracoes', label: 'Configurações', icon: Settings },
]

const imageOptions = Object.values(images)
const truncate = (s: string, n = 60) => (s.length > n ? `${s.slice(0, n)}…` : s)

// ── Adaptadores para conteúdos aninhados ──
type SimRow = Simulation & { optionA: string; optionB: string; optionC: string }
const toSimRow = (s: Simulation): SimRow => ({ ...s, optionA: s.options[0]?.text ?? '', optionB: s.options[1]?.text ?? '', optionC: s.options[2]?.text ?? '' })
const fromSimRow = (r: SimRow): Simulation => {
  const { optionA, optionB, optionC, ...rest } = r
  const texts = [optionA, optionB, optionC]
  return { ...rest, minutes: Number(rest.minutes) || 4, options: rest.options.map((o, i) => ({ ...o, text: texts[i] || o.text })) }
}
const newSimulation = (): SimRow =>
  toSimRow({
    id: uid('sim'), title: '', category: 'Trabalho', difficulty: 'Iniciante', minutes: 4, image: images.equipeReuniao, description: '', situation: '', question: 'Como você responderia?', published: false,
    context: 'Avalie o contexto e a sua segurança antes de responder.', idealExample: '',
    options: [
      { id: 'a', text: '', style: 'passiva', consequences: 'Sua necessidade pode ficar sem espaço.', clarity: 2, assertiveness: 1, respect: 4, suggestion: 'Você pode se posicionar mantendo a calma.' },
      { id: 'b', text: '', style: 'assertiva', consequences: 'Você comunica com clareza e respeito.', clarity: 5, assertiveness: 5, respect: 5, suggestion: 'Combine a frase com um pedido concreto.' },
      { id: 'c', text: '', style: 'reativa', consequences: 'A conversa pode virar disputa.', clarity: 3, assertiveness: 4, respect: 2, suggestion: 'Firmeza não depende de volume.' },
    ],
  })

type LibRow = LibraryItem & { body: string }
const toLibRow = (l: LibraryItem): LibRow => ({ ...l, body: l.sections.map((s) => [`## ${s.heading}`, ...(s.paragraphs ?? []), ...(s.list ?? []).map((x) => `- ${x}`)].join('\n')).join('\n\n') })
const fromLibRow = (r: LibRow): LibraryItem => {
  const { body, ...rest } = r
  const sections: LibraryItem['sections'] = []
  for (const block of body.split(/\n(?=## )/)) {
    const lines = block.split('\n').map((l) => l.trim()).filter(Boolean)
    if (!lines.length) continue
    const heading = lines[0].startsWith('## ') ? lines.shift()!.slice(3) : 'Conteúdo'
    const list = lines.filter((l) => l.startsWith('- ')).map((l) => l.slice(2))
    const paragraphs = lines.filter((l) => !l.startsWith('- '))
    sections.push({ heading, paragraphs: paragraphs.length ? paragraphs : undefined, list: list.length ? list : undefined })
  }
  return { ...rest, minutes: Number(rest.minutes) || 5, sections: sections.length ? sections : [{ heading: 'Conteúdo', paragraphs: [rest.description] }] }
}

type RitRow = Ritual & { stepsText: string }
const toRitRow = (r: Ritual): RitRow => ({ ...r, stepsText: r.steps.map((s) => `${s.title} | ${s.text} | ${s.seconds}`).join('\n') })
const fromRitRow = (r: RitRow): Ritual => {
  const { stepsText, ...rest } = r
  const steps = stepsText.split('\n').map((l) => l.split('|').map((x) => x.trim())).filter((p) => p[0]).map(([title, text, sec]) => ({ title, text: text ?? '', seconds: Number(sec) || 60 }))
  return { ...rest, minutes: Number(rest.minutes) || 5, steps: steps.length ? steps : [{ title: 'Etapa', text: rest.description, seconds: 60 }] }
}

function Dashboard() {
  const c = useContentStore()
  const counts = [
    { label: 'Simulações', value: c.simulations.length, to: 'simulacoes' },
    { label: 'Cards', value: c.responseCards.length, to: 'cards' },
    { label: 'Biblioteca', value: c.library.length, to: 'biblioteca' },
    { label: 'Rituais', value: c.rituals.length, to: 'rituais' },
    { label: 'Missões', value: c.missions.length, to: 'missoes' },
    { label: 'Banners ativos', value: c.banners.filter((b) => b.active).length, to: 'banners' },
  ]
  const byCategory = simulationCategories.map((cat) => ({ categoria: cat.split(' ')[0], publicadas: c.simulations.filter((s) => s.category === cat && s.published).length, rascunhos: c.simulations.filter((s) => s.category === cat && !s.published).length }))
  return (
    <div>
      <h1 className="text-[34px]">Dashboard</h1>
      <DemoNotice className="mt-3">Todos os indicadores comerciais abaixo são <strong>dados fictícios de demonstração</strong> e não representam clientes reais.</DemoNotice>
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
        {adminKpis.map((k) => (
          <Card key={k.label} className="p-4">
            <p className="text-[12px] text-muted">{k.label}</p>
            <p className="mt-1 font-serif text-[32px] font-semibold leading-none">{k.value}</p>
            <Badge tone="gold" className="mt-2">Fictício</Badge>
          </Card>
        ))}
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card className="p-5">
          <p className="font-serif text-xl font-semibold">Cadastros por mês <span className="text-[12px] font-normal text-muted">(simulado)</span></p>
          <StackedBars data={adminSignupsSeries} xKey="mes" keys={[{ key: 'cadastros', label: 'Cadastros' }, { key: 'premium', label: 'Premium' }]} height={240} />
        </Card>
        <Card className="p-5">
          <p className="font-serif text-xl font-semibold">Simulações por categoria</p>
          <StackedBars data={byCategory} xKey="categoria" keys={[{ key: 'publicadas', label: 'Publicadas' }, { key: 'rascunhos', label: 'Rascunhos' }]} height={240} />
        </Card>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-6">
        {counts.map((x) => (
          <Link key={x.label} to={`/admin/${x.to}`} className="card p-4 transition-colors hover:border-champagne">
            <p className="font-serif text-[28px] font-semibold leading-none">{x.value}</p>
            <p className="mt-1 text-[12px] text-muted">{x.label}</p>
          </Link>
        ))}
      </div>
      <Card className="mt-5 p-5">
        <p className="font-serif text-xl font-semibold">Conclusão por dia da jornada <span className="text-[12px] font-normal text-muted">(simulado)</span></p>
        <SimpleBars data={Array.from({ length: 21 }).map((_, i) => ({ dia: `${i + 1}`, usuarias: Math.round(326 * Math.pow(0.93, i)) }))} xKey="dia" dataKey="usuarias" height={200} />
      </Card>
    </div>
  )
}

function JourneysAdmin({ editTitles }: { editTitles: boolean }) {
  const titles = useContentStore((s) => s.journeyTitles)
  const setTitle = useContentStore((s) => s.setJourneyTitle)
  if (!editTitles) {
    return (
      <div>
        <h1 className="text-[34px]">Jornadas</h1>
        <p className="mt-1 text-[13.5px] text-muted">Jornadas cadastradas na plataforma.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {journeys.map((j) => (
            <Card key={j.id} className="overflow-hidden">
              <img src={j.image} alt="" className="h-32 w-full object-cover" />
              <div className="p-4">
                <Badge tone={j.status === 'disponivel' ? 'success' : 'gold'}>{j.status === 'disponivel' ? 'Publicada' : 'Em breve'}</Badge>
                <p className="mt-2 font-serif text-xl font-semibold">{j.title}</p>
                <p className="text-[12.5px] text-muted">{j.totalDays} dias · {j.phases.length || '—'} fases</p>
                {j.status === 'disponivel' && <Button to="/admin/atividades" variant="ghost" size="sm" className="-ml-2 mt-2">Editar atividades</Button>}
              </div>
            </Card>
          ))}
        </div>
      </div>
    )
  }
  return (
    <div>
      <h1 className="text-[34px]">Atividades da jornada</h1>
      <p className="mt-1 text-[13.5px] text-muted">Edite os títulos das 21 atividades de “Despertar minha voz”. As alterações aparecem imediatamente na plataforma.</p>
      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white">
        {journeys[0].days.map((d) => (
          <div key={d.day} className="grid items-center gap-3 border-b border-line px-4 py-3 last:border-0 sm:grid-cols-[80px_1fr_120px]">
            <span className="text-[12px] font-semibold text-muted">Dia {d.day} · F{d.phase}</span>
            <label className="sr-only" htmlFor={`t-${d.day}`}>Título do dia {d.day}</label>
            <input id={`t-${d.day}`} className="input h-10 py-0" defaultValue={titles[d.day] ?? d.title} onBlur={(e) => { if (e.target.value.trim() && e.target.value !== (titles[d.day] ?? d.title)) { setTitle(d.day, e.target.value.trim()); toast(`Dia ${d.day} atualizado`, 'success') } }} />
            <Link to={`/app/jornada/${d.day}`} className="text-[12.5px] font-semibold text-rubi hover:underline">Visualizar</Link>
          </div>
        ))}
      </div>
    </div>
  )
}

function CommunityAdmin() {
  const hidden = useContentStore((s) => s.hiddenPosts)
  const toggle = useContentStore((s) => s.togglePostHidden)
  const userPosts = useAppStore((s) => s.community.posts)
  const all = [...userPosts, ...communityPosts]
  return (
    <div>
      <h1 className="text-[34px]">Comunidade</h1>
      <DemoNotice className="mt-3">Demonstração de moderação. Perfis e publicações são fictícios. A estrutura de comunidade real e moderação será implementada posteriormente.</DemoNotice>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full min-w-[640px] text-left text-[13.5px]">
          <thead className="border-b border-line bg-marfim text-[11.5px] uppercase tracking-[0.08em] text-muted">
            <tr><th className="px-4 py-3">Autora</th><th className="px-4 py-3">Publicação</th><th className="px-4 py-3">Data</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Ação</th></tr>
          </thead>
          <tbody className="divide-y divide-line">
            {all.map((p) => {
              const isHidden = hidden.includes(p.id)
              const author = p.authorId === 'me' ? 'Usuária demo' : communityProfiles.find((x) => x.id === p.authorId)?.name
              return (
                <tr key={p.id}>
                  <td className="px-4 py-3 align-top font-medium">{author}</td>
                  <td className="px-4 py-3 align-top text-muted">{truncate(p.text, 90)}</td>
                  <td className="whitespace-nowrap px-4 py-3 align-top text-muted">{relativeTime(p.date)}</td>
                  <td className="px-4 py-3 align-top"><Badge tone={isHidden ? 'neutral' : 'success'}>{isHidden ? 'Oculta' : 'Visível'}</Badge></td>
                  <td className="px-4 py-3 text-right align-top">
                    <Button variant="outline" size="sm" onClick={() => { toggle(p.id); toast(isHidden ? 'Publicação reexibida' : 'Publicação ocultada') }}>
                      {isHidden ? <Eye className="h-4 w-4" aria-hidden="true" /> : <EyeOff className="h-4 w-4" aria-hidden="true" />} {isHidden ? 'Exibir' : 'Ocultar'}
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function PlatformSettings() {
  const platform = useContentStore((s) => s.platform)
  const update = useContentStore((s) => s.updatePlatform)
  const resetContent = useContentStore((s) => s.resetContent)
  return (
    <div className="max-w-2xl">
      <h1 className="text-[34px]">Configurações da plataforma</h1>
      <Card className="mt-6 space-y-4 p-6">
        <Field label="Slogan" htmlFor="slogan"><input id="slogan" className="input" value={platform.slogan} onChange={(e) => update({ slogan: e.target.value })} /></Field>
        <Field label="E-mail de suporte (fictício)" htmlFor="sup"><input id="sup" className="input" value={platform.supportEmail} onChange={(e) => update({ supportEmail: e.target.value })} /></Field>
        <Toggle label="Modo de manutenção (demonstrativo)" description="Apenas ilustra a configuração; não bloqueia o acesso." checked={platform.maintenance} onChange={(v) => update({ maintenance: v })} />
      </Card>
      <Card className="mt-5 p-6">
        <p className="font-serif text-xl font-semibold">Restaurar conteúdos</p>
        <p className="mt-1 text-[13.5px] text-muted">Desfaz todas as criações, edições e exclusões feitas neste painel.</p>
        <Button variant="outline" className="mt-4" onClick={() => { resetContent(); toast('Conteúdos restaurados', 'success') }}>Restaurar conteúdos originais</Button>
      </Card>
    </div>
  )
}

function Section({ id }: { id: string }) {
  const c = useContentStore()
  switch (id) {
    case '':
      return <Dashboard />
    case 'usuarias':
      return (
        <CrudTable<AdminUser>
          title="Usuárias fictícias"
          description="Cadastros de demonstração. Nenhum dado real."
          items={c.adminUsers}
          searchText={(u) => `${u.name} ${u.email}`}
          columns={[{ label: 'Nome', render: (u) => <span className="font-medium">{u.name}</span> }, { label: 'E-mail', render: (u) => <span className="text-muted">{u.email}</span> }, { label: 'Plano', render: (u) => <Badge tone={u.plan === 'free' ? 'neutral' : 'rubi'}>{u.plan === 'free' ? 'Gratuito' : u.plan === 'experience' ? 'Experience' : 'Clube'}</Badge> }, { label: 'Dia', render: (u) => u.journeyDay }, { label: 'Situação', render: (u) => <Badge tone={u.status === 'ativa' ? 'success' : 'neutral'}>{u.status}</Badge> }, { label: 'Cadastro', render: (u) => formatShort(u.joined) }]}
          fields={[{ key: 'name', label: 'Nome', type: 'text', required: true }, { key: 'email', label: 'E-mail', type: 'text', required: true }, { key: 'plan', label: 'Plano', type: 'select', options: ['free', 'experience', 'club'] }, { key: 'journeyDay', label: 'Dia da jornada', type: 'number' }, { key: 'status', label: 'Situação', type: 'select', options: ['ativa', 'inativa'] }]}
          createNew={() => ({ id: uid('au'), name: '', email: '', plan: 'free', journeyDay: 0, status: 'ativa', joined: new Date().toISOString().slice(0, 10) })}
          onSave={(u) => c.upsert('adminUsers', u)}
          onDelete={(id) => c.remove('adminUsers', id)}
        />
      )
    case 'jornadas':
      return <JourneysAdmin editTitles={false} />
    case 'atividades':
      return <JourneysAdmin editTitles />
    case 'missoes':
      return (
        <CrudTable<DailyMission>
          title="Missões de coragem"
          description="A primeira missão da lista aparece como “Missão de coragem do dia” na home."
          items={c.missions}
          searchText={(m) => m.title}
          columns={[{ label: 'Título', render: (m) => <span className="font-medium">{m.title}</span> }, { label: 'Descrição', render: (m) => <span className="text-muted">{truncate(m.description)}</span> }, { label: 'Tempo', render: (m) => `${m.minutes} min` }, { label: 'Pilar', render: (m) => m.pillar }]}
          fields={[{ key: 'title', label: 'Título', type: 'text', required: true, wide: true }, { key: 'description', label: 'Descrição', type: 'textarea', required: true }, { key: 'minutes', label: 'Tempo (min)', type: 'number' }, { key: 'pillar', label: 'Pilar', type: 'select', options: ['P', 'O', 'T', 'E', 'N', 'C', 'I', 'A'] }, { key: 'steps', label: 'Passos', type: 'lines', required: true }]}
          createNew={() => ({ id: uid('m'), title: '', description: '', minutes: 5, steps: [], pillar: 'C' as PillarId })}
          onSave={(m) => c.upsert('missions', { ...m, minutes: Number(m.minutes) || 5 })}
          onDelete={(id) => c.remove('missions', id)}
        />
      )
    case 'simulacoes':
      return (
        <CrudTable<SimRow>
          title="Simulações"
          description="Situações do Laboratório Comportamental. O feedback detalhado das alternativas é mantido ao editar os textos."
          items={c.simulations.map(toSimRow)}
          searchText={(s) => `${s.title} ${s.category}`}
          publishKey="published"
          columns={[{ label: 'Título', render: (s) => <span className="font-medium">{s.title || '(sem título)'}</span> }, { label: 'Categoria', render: (s) => s.category }, { label: 'Nível', render: (s) => s.difficulty }, { label: 'Min', render: (s) => s.minutes }]}
          fields={[
            { key: 'title', label: 'Título', type: 'text', required: true, wide: true },
            { key: 'category', label: 'Categoria', type: 'select', options: simulationCategories },
            { key: 'difficulty', label: 'Dificuldade', type: 'select', options: ['Iniciante', 'Intermediário', 'Avançado'] },
            { key: 'minutes', label: 'Duração (min)', type: 'number' },
            { key: 'image', label: 'Imagem', type: 'select', options: imageOptions },
            { key: 'description', label: 'Descrição curta', type: 'textarea', required: true },
            { key: 'situation', label: 'Situação', type: 'textarea', required: true },
            { key: 'optionA', label: 'Alternativa A (passiva)', type: 'textarea', required: true },
            { key: 'optionB', label: 'Alternativa B (assertiva)', type: 'textarea', required: true },
            { key: 'optionC', label: 'Alternativa C (reativa)', type: 'textarea', required: true },
            { key: 'context', label: 'Contexto e segurança', type: 'textarea' },
            { key: 'idealExample', label: 'Exemplo de resposta', type: 'textarea' },
            { key: 'published', label: 'Publicado', type: 'boolean' },
          ]}
          createNew={newSimulation}
          onSave={(r) => c.upsert('simulations', fromSimRow(r))}
          onDelete={(id) => c.remove('simulations', id)}
        />
      )
    case 'cards':
      return (
        <CrudTable<ResponseCard>
          title="Cards de respostas"
          items={c.responseCards}
          searchText={(x) => `${x.situation} ${x.response} ${x.category}`}
          publishKey="published"
          columns={[{ label: 'Categoria', render: (x) => <span className="whitespace-nowrap">{x.category}</span> }, { label: 'Resposta', render: (x) => <span className="text-muted">{truncate(x.response, 70)}</span> }]}
          fields={[
            { key: 'category', label: 'Categoria', type: 'select', options: responseCategories, wide: true },
            { key: 'situation', label: 'Situação', type: 'textarea', required: true },
            { key: 'response', label: 'Resposta sugerida', type: 'textarea', required: true },
            { key: 'explanation', label: 'Explicação', type: 'textarea', required: true },
            { key: 'variations', label: 'Variações', type: 'lines' },
            { key: 'published', label: 'Publicado', type: 'boolean' },
          ]}
          createNew={() => ({ id: uid('card'), category: responseCategories[0], situation: '', response: '', explanation: '', variations: [], published: false })}
          onSave={(x) => c.upsert('responseCards', x)}
          onDelete={(id) => c.remove('responseCards', id)}
        />
      )
    case 'biblioteca':
      return (
        <CrudTable<LibRow>
          title="Biblioteca"
          description="Use “## Título” para criar seções e “- item” para listas no conteúdo."
          items={c.library.map(toLibRow)}
          searchText={(x) => `${x.title} ${x.category} ${x.format}`}
          publishKey="published"
          columns={[{ label: 'Título', render: (x) => <span className="font-medium">{x.title || '(sem título)'}</span> }, { label: 'Formato', render: (x) => x.format }, { label: 'Categoria', render: (x) => x.category }, { label: 'Min', render: (x) => x.minutes }]}
          fields={[
            { key: 'title', label: 'Título', type: 'text', required: true, wide: true },
            { key: 'format', label: 'Formato', type: 'select', options: libraryFormats },
            { key: 'category', label: 'Categoria', type: 'select', options: libraryCategories },
            { key: 'minutes', label: 'Tempo de leitura (min)', type: 'number' },
            { key: 'cover', label: 'Capa', type: 'select', options: ['rubi', 'champagne', 'onix', 'bege', 'marfim'] },
            { key: 'description', label: 'Descrição', type: 'textarea', required: true },
            { key: 'body', label: 'Conteúdo', type: 'textarea', required: true },
            { key: 'published', label: 'Publicado', type: 'boolean' },
          ]}
          createNew={() => toLibRow({ id: uid('lib'), title: '', description: '', format: 'Artigo', category: libraryCategories[0], minutes: 5, cover: 'rubi', sections: [], published: false })}
          onSave={(r) => c.upsert('library', fromLibRow(r))}
          onDelete={(id) => c.remove('library', id)}
        />
      )
    case 'rituais':
      return (
        <CrudTable<RitRow>
          title="Rituais"
          description="Etapas no formato: Título | Texto guiado | segundos (uma por linha)."
          items={c.rituals.map(toRitRow)}
          searchText={(x) => `${x.title} ${x.category}`}
          publishKey="published"
          columns={[{ label: 'Título', render: (x) => <span className="font-medium">{x.title || '(sem título)'}</span> }, { label: 'Categoria', render: (x) => x.category }, { label: 'Min', render: (x) => x.minutes }, { label: 'Etapas', render: (x) => x.steps.length }]}
          fields={[
            { key: 'title', label: 'Título', type: 'text', required: true, wide: true },
            { key: 'category', label: 'Categoria', type: 'select', options: ritualCategories },
            { key: 'minutes', label: 'Duração (min)', type: 'number' },
            { key: 'coverTone', label: 'Capa', type: 'select', options: ['photo', 'rubi', 'champagne', 'onix', 'bege'] },
            { key: 'cover', label: 'Foto da capa (quando “photo”)', type: 'select', options: ['', ...imageOptions] },
            { key: 'description', label: 'Descrição', type: 'textarea', required: true },
            { key: 'stepsText', label: 'Etapas', type: 'textarea', required: true },
            { key: 'published', label: 'Publicado', type: 'boolean' },
          ]}
          createNew={() => toRitRow({ id: uid('rit'), title: '', category: ritualCategories[0], minutes: 5, description: '', cover: '', coverTone: 'rubi', steps: [], published: false })}
          onSave={(r) => c.upsert('rituals', fromRitRow(r))}
          onDelete={(id) => c.remove('rituals', id)}
        />
      )
    case 'banners':
      return (
        <CrudTable<Banner>
          title="Banners"
          description="Banners ativos aparecem na home da plataforma."
          items={c.banners}
          searchText={(b) => b.title}
          publishKey="active"
          columns={[{ label: 'Imagem', render: (b) => <img src={b.image} alt="" className="h-10 w-16 rounded object-cover" /> }, { label: 'Título', render: (b) => <span className="font-medium">{b.title}</span> }, { label: 'Link', render: (b) => <span className="text-muted">{b.link}</span> }]}
          fields={[
            { key: 'title', label: 'Título', type: 'text', required: true, wide: true },
            { key: 'subtitle', label: 'Subtítulo', type: 'textarea' },
            { key: 'cta', label: 'Texto do botão', type: 'text', required: true },
            { key: 'link', label: 'Link interno', type: 'select', options: ['/app/jornada/8', '/app/laboratorio', '/app/academia', '/app/rituais', '/app/biblioteca', '/app/planos', '/app/mapa', '/app/respostas'] },
            { key: 'image', label: 'Imagem', type: 'select', options: imageOptions, wide: true },
            { key: 'active', label: 'Ativo', type: 'boolean' },
          ]}
          createNew={() => ({ id: uid('b'), title: '', subtitle: '', image: images.liderReuniao, cta: 'Saiba mais', link: '/app/laboratorio', active: false })}
          onSave={(b) => c.upsert('banners', b)}
          onDelete={(id) => c.remove('banners', id)}
        />
      )
    case 'planos':
      return (
        <CrudTable<Plan>
          title="Planos"
          description="Valores e benefícios exibidos na plataforma. Não há integração com pagamentos."
          items={c.plans}
          allowCreate={false}
          searchText={(p) => p.name}
          columns={[{ label: 'Plano', render: (p) => <span className="font-medium">{p.name}</span> }, { label: 'Preço', render: (p) => `${p.price} · ${p.priceNote}` }, { label: 'Benefícios', render: (p) => p.features.length }]}
          fields={[
            { key: 'name', label: 'Nome', type: 'text', required: true, wide: true },
            { key: 'price', label: 'Preço', type: 'text', required: true },
            { key: 'priceNote', label: 'Observação do preço', type: 'text' },
            { key: 'description', label: 'Descrição', type: 'textarea' },
            { key: 'features', label: 'Benefícios', type: 'lines', required: true },
          ]}
          onSave={(p) => c.upsert('plans', p)}
        />
      )
    case 'notificacoes':
      return (
        <CrudTable<Notification>
          title="Notificações"
          description="Notificações exibidas no sino da plataforma."
          items={c.notifications}
          searchText={(n) => `${n.title} ${n.text}`}
          columns={[{ label: 'Título', render: (n) => <span className="font-medium">{n.title}</span> }, { label: 'Mensagem', render: (n) => <span className="text-muted">{truncate(n.text)}</span> }, { label: 'Data', render: (n) => relativeTime(n.date) }]}
          fields={[{ key: 'title', label: 'Título', type: 'text', required: true, wide: true }, { key: 'text', label: 'Mensagem', type: 'textarea', required: true }, { key: 'link', label: 'Link interno', type: 'select', options: ['/app', '/app/jornada/8', '/app/evolucao', '/app/laboratorio', '/app/rituais', '/app/planos'] }]}
          createNew={() => ({ id: uid('n'), title: '', text: '', date: new Date().toISOString(), read: false, link: '/app' })}
          onSave={(n) => c.upsert('notifications', { ...n, date: n.date || new Date().toISOString() })}
          onDelete={(id) => c.remove('notifications', id)}
        />
      )
    case 'comunidade':
      return <CommunityAdmin />
    case 'configuracoes':
      return <PlatformSettings />
    default:
      return <p>Seção não encontrada.</p>
  }
}

export default function Admin() {
  const { section = '' } = useParams()
  return (
    <div className="min-h-dvh bg-marfim">
      <header className="sticky top-0 z-30 border-b border-line bg-onix text-marfim">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Logo light compact />
            <Badge className="hidden bg-champagne/20 text-champagne sm:inline-flex">Painel administrativo · demonstração</Badge>
          </div>
          <Link to="/app" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-marfim/80 hover:text-champagne"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> Voltar à plataforma</Link>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-2 scrollbar-none lg:hidden" aria-label="Seções do painel">
          {nav.map((n) => (
            <NavLink key={n.id} to={`/admin${n.id ? `/${n.id}` : ''}`} end className={({ isActive }) => cn('whitespace-nowrap rounded-lg px-3 py-1.5 text-[12.5px] font-medium', isActive ? 'bg-rubi text-white' : 'text-marfim/70')}>{n.label}</NavLink>
          ))}
        </nav>
      </header>
      <div className="flex">
        <aside className="sticky top-16 hidden h-[calc(100dvh-4rem)] w-60 shrink-0 overflow-y-auto border-r border-line p-3 lg:block">
          <nav aria-label="Seções do painel" className="space-y-0.5">
            {nav.map(({ id, label, icon: I }) => (
              <NavLink key={id} to={`/admin${id ? `/${id}` : ''}`} end className={({ isActive }) => cn('flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] font-medium', isActive ? 'bg-rubi text-white' : 'text-onix/80 hover:bg-bege/60')}>
                <I className="h-4 w-4" aria-hidden="true" /> {label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-8">
          <Section id={section} />
        </main>
      </div>
    </div>
  )
}
