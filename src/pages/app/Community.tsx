import { useMemo, useState } from 'react'
import { Award, Flame, HeartHandshake, MessageCircle, Send, Sparkles, Users } from 'lucide-react'
import { Badge, Button, Card, Chip, DemoNotice, DemoTag, PageHeader, Segmented } from '@/components/ui/primitives'
import { Icon } from '@/components/ui/Icon'
import { useAppStore } from '@/store/useAppStore'
import { useContentStore } from '@/store/useContentStore'
import { communityChallenges, communityGroups, communityPosts, communityProfiles, communityReactions } from '@/mocks/community'
import { achievements } from '@/mocks/achievements'
import { relativeTime } from '@/utils/date'
import { toast } from '@/store/useToastStore'
import { cn } from '@/utils/cn'
import type { CommunityPost } from '@/types'

const EMPTY: never[] = []
const reactionIcons = { apoio: HeartHandshake, inspirou: Sparkles, forca: Flame }
const typeLabels: Record<CommunityPost['type'], string> = { reflexao: 'Reflexão', conquista: 'Conquista', pergunta: 'Pergunta', desafio: 'Desafio' }

function PostCard({ post }: { post: CommunityPost }) {
  const profile = useAppStore((s) => s.profile)
  const myReactions = useAppStore((s) => s.community.reactions[post.id] ?? EMPTY)
  const myComments = useAppStore((s) => s.community.comments[post.id] ?? EMPTY)
  const toggleReaction = useAppStore((s) => s.toggleReaction)
  const addComment = useAppStore((s) => s.addComment)
  const [showComments, setShowComments] = useState(false)
  const [comment, setComment] = useState('')

  const isMine = post.authorId === 'me'
  const author = isMine ? { name: profile.name, avatar: profile.avatar, role: profile.profession, city: profile.city } : communityProfiles.find((p) => p.id === post.authorId)
  const group = communityGroups.find((g) => g.id === post.groupId)
  const comments = [...post.comments, ...myComments]

  return (
    <Card as="article" className="p-5">
      <header className="flex items-start gap-3">
        <img src={author?.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
        <div className="min-w-0 flex-1">
          <p className="flex flex-wrap items-center gap-x-2 text-[14px] font-semibold">
            {author?.name}
            {isMine ? <Badge tone="rubi">Você</Badge> : <DemoTag label="Perfil fictício" />}
          </p>
          <p className="text-[12px] text-muted">{author?.role} · {group?.name} · {relativeTime(post.date)}</p>
        </div>
        <Badge tone={post.type === 'conquista' ? 'gold' : post.type === 'pergunta' ? 'rubi' : 'neutral'}>{typeLabels[post.type]}</Badge>
      </header>
      <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed">{post.text}</p>
      {post.image && <img src={post.image} alt="" className="mt-3 max-h-72 w-full rounded-xl object-cover" loading="lazy" />}
      <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-line pt-3">
        {communityReactions.map((r) => {
          const I = reactionIcons[r.id as keyof typeof reactionIcons]
          const mine = myReactions.includes(r.id)
          const count = (post.reactions[r.id] ?? 0) + (mine ? 1 : 0)
          return (
            <button key={r.id} onClick={() => toggleReaction(post.id, r.id)} aria-pressed={mine} className={cn('inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-medium transition-colors', mine ? 'bg-rubi-soft text-rubi' : 'text-muted hover:bg-marfim')}>
              <I className={cn('h-4 w-4', mine && 'fill-rubi/20')} aria-hidden="true" /> {r.label}{count > 0 && <span className="font-semibold">{count}</span>}
            </button>
          )
        })}
        <button onClick={() => setShowComments((v) => !v)} aria-expanded={showComments} className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] font-medium text-muted hover:bg-marfim">
          <MessageCircle className="h-4 w-4" aria-hidden="true" /> {comments.length} {comments.length === 1 ? 'comentário' : 'comentários'}
        </button>
      </div>
      {showComments && (
        <div className="mt-3 space-y-3">
          {comments.map((c) => {
            const a = c.authorId === 'me' ? { name: profile.name, avatar: profile.avatar } : communityProfiles.find((p) => p.id === c.authorId)
            return (
              <div key={c.id} className="flex gap-2.5">
                <img src={a?.avatar} alt="" className="h-8 w-8 rounded-full object-cover" />
                <div className="rounded-xl bg-marfim px-3.5 py-2 text-[13.5px]">
                  <p className="text-[12px] font-semibold">{a?.name} <span className="font-normal text-muted">· {relativeTime(c.date)}</span></p>
                  <p>{c.text}</p>
                </div>
              </div>
            )
          })}
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              if (!comment.trim()) return
              addComment(post.id, comment.trim())
              setComment('')
            }}
          >
            <label htmlFor={`c-${post.id}`} className="sr-only">Escrever comentário</label>
            <input id={`c-${post.id}`} value={comment} onChange={(e) => setComment(e.target.value)} className="input h-10 py-0" placeholder="Escreva um comentário acolhedor…" />
            <Button type="submit" size="sm" className="h-10" disabled={!comment.trim()} aria-label="Enviar comentário"><Send className="h-4 w-4" aria-hidden="true" /></Button>
          </form>
        </div>
      )}
    </Card>
  )
}

export default function Community() {
  const profile = useAppStore((s) => s.profile)
  const myPosts = useAppStore((s) => s.community.posts)
  const myGroups = useAppStore((s) => s.community.groups)
  const myChallenges = useAppStore((s) => s.community.challenges)
  const unlocked = useAppStore((s) => s.unlocked)
  const createPost = useAppStore((s) => s.createPost)
  const toggleGroup = useAppStore((s) => s.toggleGroup)
  const toggleChallenge = useAppStore((s) => s.toggleChallenge)
  const [tab, setTab] = useState<'feed' | 'grupos' | 'desafios'>('feed')
  const [filter, setFilter] = useState('todos')
  const [text, setText] = useState('')
  const [groupId, setGroupId] = useState(communityGroups[0].id)
  const [type, setType] = useState<CommunityPost['type']>('reflexao')

  const hidden = useContentStore((s) => s.hiddenPosts)
  const posts = useMemo(() => [...myPosts, ...communityPosts].filter((p) => !hidden.includes(p.id) && (filter === 'todos' || p.groupId === filter)), [myPosts, filter, hidden])
  const lastAchievement = achievements.find((a) => a.id === unlocked[unlocked.length - 1]?.id)

  const publish = () => {
    if (!text.trim()) return
    createPost(text.trim(), groupId, type)
    setText('')
    setFilter('todos')
    toast('Publicação adicionada (apenas neste navegador)', 'success')
  }

  return (
    <div>
      <PageHeader eyebrow="Círculo de Potência" title="Comunidade" description="Um espaço de troca entre mulheres em desenvolvimento." actions={<Segmented label="Seção" value={tab} onChange={setTab} options={[{ value: 'feed', label: 'Feed' }, { value: 'grupos', label: 'Grupos' }, { value: 'desafios', label: 'Desafios' }]} />} />
      <DemoNotice className="mb-6">
        Prévia demonstrativa do Clube Voz de Potência. Todos os perfis e publicações são <strong>exemplos fictícios</strong>; a comunidade ainda não está ativa. Suas interações ficam salvas apenas neste navegador.
      </DemoNotice>

      {tab === 'feed' && (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0 space-y-4">
            <Card className="p-5">
              <div className="flex gap-3">
                <img src={profile.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
                <div className="flex-1">
                  <label htmlFor="novo-post" className="sr-only">Nova publicação</label>
                  <textarea id="novo-post" rows={3} value={text} onChange={(e) => setText(e.target.value)} className="input resize-none" placeholder={`Compartilhe uma reflexão, pergunta ou conquista, ${profile.firstName}…`} />
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <label htmlFor="grupo" className="sr-only">Grupo</label>
                    <select id="grupo" value={groupId} onChange={(e) => setGroupId(e.target.value)} className="input h-9 w-auto py-0 text-[13px]">
                      {communityGroups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                    <label htmlFor="tipo" className="sr-only">Tipo</label>
                    <select id="tipo" value={type} onChange={(e) => setType(e.target.value as CommunityPost['type'])} className="input h-9 w-auto py-0 text-[13px]">
                      {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                    {lastAchievement && (
                      <Button variant="ghost" size="sm" onClick={() => { setType('conquista'); setText(`Conquistei a medalha “${lastAchievement.title}” na Voz de Potência! ${lastAchievement.description}`) }}>
                        <Award className="h-4 w-4" aria-hidden="true" /> Compartilhar conquista
                      </Button>
                    )}
                    <Button size="sm" className="ml-auto" disabled={!text.trim()} onClick={publish}>Publicar</Button>
                  </div>
                </div>
              </div>
            </Card>
            <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:px-0">
              <Chip active={filter === 'todos'} onClick={() => setFilter('todos')}>Todos</Chip>
              {communityGroups.map((g) => <Chip key={g.id} active={filter === g.id} onClick={() => setFilter(g.id)}>{g.name}</Chip>)}
            </div>
            {posts.map((p) => <PostCard key={p.id} post={p} />)}
          </div>
          <aside className="space-y-4">
            <Card className="p-5">
              <p className="text-[13px] font-semibold">Meus grupos</p>
              <ul className="mt-3 space-y-2">
                {communityGroups.filter((g) => myGroups.includes(g.id)).map((g) => (
                  <li key={g.id} className="flex items-center gap-2.5 text-[13.5px]"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-champagne-soft text-champagne-ink"><Icon name={g.icon} className="h-4 w-4" /></span>{g.name}</li>
                ))}
                {myGroups.length === 0 && <li className="text-[13px] text-muted">Você ainda não entrou em grupos.</li>}
              </ul>
              <Button variant="ghost" size="sm" className="mt-2 -ml-2" onClick={() => setTab('grupos')}>Explorar grupos</Button>
            </Card>
            <Card className="bg-rubi p-5 text-marfim">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-champagne">Desafio em destaque</p>
              <p className="mt-1 font-serif text-2xl">{communityChallenges[0].title}</p>
              <p className="mt-1 text-[13px] text-marfim/75">{communityChallenges[0].description}</p>
              <Button variant="gold" size="sm" className="mt-4" onClick={() => setTab('desafios')}>Ver desafios</Button>
            </Card>
            <Card className="p-5 text-[12.5px] text-muted">
              <p className="mb-1 font-semibold text-onix">Combinados do Círculo</p>
              Acolhimento, respeito e confidencialidade. A moderação da comunidade real será implementada em uma próxima etapa.
            </Card>
          </aside>
        </div>
      )}

      {tab === 'grupos' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {communityGroups.map((g) => {
            const joined = myGroups.includes(g.id)
            return (
              <Card key={g.id} className="flex flex-col p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-rubi-soft text-rubi"><Icon name={g.icon} className="h-5 w-5" /></span>
                <p className="mt-4 font-serif text-[22px] font-semibold">{g.name}</p>
                <p className="mt-1 flex-1 text-[13.5px] text-muted">{g.description}</p>
                <div className="mt-4 flex items-center gap-2">
                  <Button variant={joined ? 'secondary' : 'primary'} size="sm" onClick={() => toggleGroup(g.id)}>{joined ? 'Participando' : 'Participar'}</Button>
                  <Button variant="ghost" size="sm" onClick={() => { setFilter(g.id); setTab('feed') }}><Users className="h-4 w-4" aria-hidden="true" /> Ver publicações</Button>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {tab === 'desafios' && (
        <div className="grid gap-4 md:grid-cols-3">
          {communityChallenges.map((c) => {
            const joined = myChallenges.includes(c.id)
            return (
              <Card key={c.id} className="flex flex-col p-6">
                <Flame className="h-7 w-7 text-rubi" aria-hidden="true" />
                <p className="mt-3 font-serif text-[24px] font-semibold leading-tight">{c.title}</p>
                <p className="mt-1 flex-1 text-[14px] text-muted">{c.description}</p>
                <p className="mt-3 text-[12px] font-semibold text-champagne-ink">{c.days} dias</p>
                <Button className="mt-4" variant={joined ? 'secondary' : 'primary'} onClick={() => { toggleChallenge(c.id); toast(joined ? 'Você saiu do desafio' : 'Desafio aceito! Boa jornada.', 'success') }}>{joined ? 'Participando' : 'Aceitar desafio'}</Button>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
