import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Check, CheckCircle2, Clock, Download, Lock, Minus, Plus } from 'lucide-react'
import { Badge, Button, FavoriteButton, ProgressBar } from '@/components/ui/primitives'
import { AudioPlayerDemo } from '@/components/AudioPlayerDemo'
import { useContentStore } from '@/store/useContentStore'
import { useAppStore } from '@/store/useAppStore'
import { useAccess } from '@/hooks/useProgress'
import { downloadText } from '@/services/exportService'
import { LibraryCover } from './Library'
import NotFound from '../NotFound'

export default function LibraryReader() {
  const { id } = useParams()
  const item = useContentStore((s) => s.library.find((i) => i.id === id))
  const all = useContentStore((s) => s.library)
  const favorites = useAppStore((s) => s.favorites.library)
  const toggleFavorite = useAppStore((s) => s.toggleFavorite)
  const read = useAppStore((s) => s.libraryRead)
  const markRead = useAppStore((s) => s.markLibraryRead)
  const { can } = useAccess()
  const [fontSize, setFontSize] = useState(16)
  const [progress, setProgress] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const total = el.scrollHeight - window.innerHeight
      setProgress(total <= 0 ? 100 : Math.min(100, Math.max(0, (-rect.top / total) * 100)))
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!item) return <NotFound inApp />
  const isRead = read.includes(item.id)
  const related = all.filter((i) => i.id !== item.id && i.category === item.category && i.published).slice(0, 3)

  if (!can('library', item.id)) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <Lock className="mx-auto h-10 w-10 text-champagne-ink" aria-hidden="true" />
        <h1 className="mt-4 text-[34px]">{item.title}</h1>
        <p className="mt-2 text-muted">Este conteúdo faz parte da Biblioteca completa do plano Experience.</p>
        <Button to="/app/planos" className="mt-6">Conhecer os planos</Button>
      </div>
    )
  }

  const exportText = () => {
    const txt = [`${item.title}`, `${item.format} · ${item.category}`, '', item.description, '', ...item.sections.flatMap((s) => [`## ${s.heading}`, ...(s.paragraphs ?? []), ...(s.list ?? []).map((l) => `- ${l}`), ''])].join('\n')
    downloadText(txt, `${item.id}.md`, 'text/markdown;charset=utf-8')
  }

  return (
    <div ref={ref}>
      <div className="sticky top-16 z-20 -mx-4 mb-6 bg-marfim/95 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6 lg:top-0 lg:-mx-10 lg:px-10">
        <div className="flex items-center justify-between gap-3">
          <Link to="/app/biblioteca" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted hover:text-rubi"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> Biblioteca</Link>
          <div className="flex items-center gap-1">
            <button onClick={() => setFontSize((f) => Math.max(14, f - 1))} className="rounded-lg p-2 hover:bg-bege" aria-label="Diminuir fonte"><Minus className="h-4 w-4" aria-hidden="true" /></button>
            <span className="text-[12px] text-muted">Aa</span>
            <button onClick={() => setFontSize((f) => Math.min(22, f + 1))} className="rounded-lg p-2 hover:bg-bege" aria-label="Aumentar fonte"><Plus className="h-4 w-4" aria-hidden="true" /></button>
            <FavoriteButton active={favorites.includes(item.id)} onToggle={() => toggleFavorite('library', item.id)} className="ml-1" />
          </div>
        </div>
        <ProgressBar value={progress} className="mt-2 h-1" label="Progresso de leitura" />
      </div>

      <article className="mx-auto max-w-2xl">
        <div className="mb-8 grid gap-6 sm:grid-cols-[180px_1fr] sm:items-end">
          <div className="aspect-[3/4] overflow-hidden rounded-xl shadow-lift"><LibraryCover item={item} /></div>
          <div>
            <div className="flex flex-wrap gap-2">
              <Badge tone="rubi">{item.format}</Badge>
              <Badge tone="gold">{item.category}</Badge>
              <span className="inline-flex items-center gap-1 text-[12px] text-muted"><Clock className="h-3.5 w-3.5" aria-hidden="true" /> {item.minutes} min</span>
            </div>
            <h1 className="mt-3 text-[38px] leading-[1.05] sm:text-[46px]">{item.title}</h1>
            <p className="mt-2 text-[15px] text-muted">{item.description}</p>
          </div>
        </div>

        {item.format === 'Áudio' && <div className="mb-8"><AudioPlayerDemo title={item.title} subtitle="Áudio guiado · transcrição abaixo" durationSec={item.minutes * 60} dark /></div>}

        <div className="prose-vp" style={{ fontSize }}>
          {item.sections.map((s) => (
            <section key={s.heading}>
              <h3>{s.heading}</h3>
              {s.paragraphs?.map((p, i) => <p key={i} style={{ fontSize: '1em' }}>{p}</p>)}
              {s.list && (
                <ul style={{ fontSize: '0.97em' }}>
                  {s.list.map((l) => <li key={l}>{l}</li>)}
                </ul>
              )}
            </section>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-line bg-white p-6 text-center">
          {isRead ? (
            <p className="inline-flex items-center gap-2 font-serif text-2xl font-semibold text-sucesso"><CheckCircle2 className="h-6 w-6" aria-hidden="true" /> Leitura concluída</p>
          ) : (
            <>
              <p className="font-serif text-2xl font-semibold">Terminou a leitura?</p>
              <Button onClick={() => markRead(item.id, item.title)}><Check className="h-4 w-4" aria-hidden="true" /> Marcar como lido</Button>
            </>
          )}
          <Button variant="ghost" size="sm" onClick={exportText}><Download className="h-4 w-4" aria-hidden="true" /> Baixar texto (.md)</Button>
        </div>

        {related.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-4 text-[26px]">Leia também</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {related.map((r) => (
                <Link key={r.id} to={`/app/biblioteca/${r.id}`} className="aspect-[3/4] overflow-hidden rounded-xl shadow-soft transition-transform hover:-translate-y-0.5"><LibraryCover item={r} /></Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  )
}
