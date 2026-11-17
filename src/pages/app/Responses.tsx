import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Copy, Download, FlaskConical, Info, Layers, Search, Share2, Shuffle } from 'lucide-react'
import { Chip, EmptyState, FavoriteButton, PageHeader, PremiumLock, Segmented } from '@/components/ui/primitives'
import { useContentStore } from '@/store/useContentStore'
import { useAppStore } from '@/store/useAppStore'
import { useAccess } from '@/hooks/useProgress'
import { responseCategories } from '@/mocks/responseCards'
import { copyToClipboard, downloadBlob, renderCardImage } from '@/services/exportService'
import { toast } from '@/store/useToastStore'
import { cn } from '@/utils/cn'
import type { ResponseCard } from '@/types'

function CardItem({ card, locked, highlight }: { card: ResponseCard; locked: boolean; highlight: boolean }) {
  const favorites = useAppStore((s) => s.favorites.cards)
  const toggleFavorite = useAppStore((s) => s.toggleFavorite)
  const [panel, setPanel] = useState<'none' | 'variations' | 'explanation'>('none')
  const fav = favorites.includes(card.id)

  const share = async () => {
    const text = `${card.response}\n\n— Voz de Potência`
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Resposta poderosa · Voz de Potência', text })
        return
      } catch {
        /* cancelado */
      }
    }
    const ok = await copyToClipboard(text)
    toast(ok ? 'Texto pronto para compartilhar copiado' : 'Não foi possível compartilhar', ok ? 'success' : 'error')
  }

  const exportImage = async () => {
    const blob = await renderCardImage(card)
    if (blob) {
      downloadBlob(blob, `voz-de-potencia-${card.id}.png`)
      toast('Imagem do card exportada', 'success')
    } else toast('Não foi possível gerar a imagem', 'error')
  }

  return (
    <motion.article
      layout
      id={card.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('relative flex flex-col overflow-hidden rounded-2xl border bg-white shadow-soft', highlight ? 'border-rubi ring-2 ring-rubi/20' : 'border-line')}
    >
      <div className="relative bg-gradient-to-br from-rubi to-rubi-deep p-5 text-marfim">
        <div className="pointer-events-none absolute right-4 top-4 h-14 w-14 rounded-full border border-champagne/30" aria-hidden="true" />
        <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-champagne">{card.category}</p>
        <p className="mt-2 pr-10 text-[13px] text-marfim/75">{card.situation}</p>
        <p className={cn('mt-3 font-serif text-[22px] font-medium italic leading-snug', locked && 'select-none blur-[5px]')}>“{card.response}”</p>
        <FavoriteButton active={fav} onToggle={() => toggleFavorite('cards', card.id)} light className="absolute right-[22px] top-[22px] h-10 w-10" />
      </div>
      {locked ? (
        <div className="flex flex-1 items-center justify-center p-5"><PremiumLock /></div>
      ) : (
        <div className="flex flex-1 flex-col p-4">
          <AnimatePresence initial={false}>
            {panel !== 'none' && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                {panel === 'explanation' && <p className="mb-3 rounded-xl bg-marfim p-3 text-[13.5px]">{card.explanation}</p>}
                {panel === 'variations' && (
                  <ul className="mb-3 space-y-2">
                    {card.variations.map((v) => (
                      <li key={v} className="flex items-start justify-between gap-2 rounded-xl bg-marfim p-3 text-[13.5px]">
                        <span>“{v}”</span>
                        <button onClick={async () => toast((await copyToClipboard(v)) ? 'Variação copiada' : 'Falha ao copiar')} className="shrink-0 rounded p-1 text-muted hover:text-rubi" aria-label="Copiar variação"><Copy className="h-3.5 w-3.5" aria-hidden="true" /></button>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="mt-auto flex flex-wrap gap-1.5">
            <button onClick={() => setPanel(panel === 'explanation' ? 'none' : 'explanation')} aria-expanded={panel === 'explanation'} className={cn('chip px-2.5 py-1 text-[12px]', panel === 'explanation' && 'chip-active')}><Info className="h-3.5 w-3.5" aria-hidden="true" /> Explicação</button>
            <button onClick={() => setPanel(panel === 'variations' ? 'none' : 'variations')} aria-expanded={panel === 'variations'} className={cn('chip px-2.5 py-1 text-[12px]', panel === 'variations' && 'chip-active')}><Shuffle className="h-3.5 w-3.5" aria-hidden="true" /> Variações</button>
            {card.simulationId && <Link to={`/app/laboratorio/${card.simulationId}`} className="chip px-2.5 py-1 text-[12px]"><FlaskConical className="h-3.5 w-3.5" aria-hidden="true" /> Simulação</Link>}
          </div>
          <div className="mt-3 flex items-center gap-1 border-t border-line pt-3">
            <button onClick={async () => toast((await copyToClipboard(card.response)) ? 'Resposta copiada' : 'Falha ao copiar', 'success')} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-[12.5px] font-semibold hover:bg-marfim"><Copy className="h-4 w-4" aria-hidden="true" /> Copiar</button>
            <button onClick={share} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-[12.5px] font-semibold hover:bg-marfim"><Share2 className="h-4 w-4" aria-hidden="true" /> Compartilhar</button>
            <button onClick={exportImage} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-[12.5px] font-semibold hover:bg-marfim"><Download className="h-4 w-4" aria-hidden="true" /> Imagem</button>
          </div>
        </div>
      )}
    </motion.article>
  )
}

export default function Responses() {
  const [params, setParams] = useSearchParams()
  const cards = useContentStore((s) => s.responseCards).filter((c) => c.published)
  const favorites = useAppStore((s) => s.favorites.cards)
  const { can } = useAccess()
  const [query, setQuery] = useState('')
  const [view, setView] = useState<'all' | 'fav'>('all')
  const category = params.get('categoria') ?? 'Todas'
  const highlight = params.get('card')

  useEffect(() => {
    if (highlight) setTimeout(() => document.getElementById(highlight)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 250)
  }, [highlight])

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return cards.filter((c) => {
      if (category !== 'Todas' && c.category !== category) return false
      if (view === 'fav' && !favorites.includes(c.id)) return false
      if (q && !`${c.situation} ${c.response} ${c.explanation} ${c.variations.join(' ')}`.toLowerCase().includes(q)) return false
      return true
    })
  }, [cards, category, view, favorites, query])

  return (
    <div>
      <PageHeader
        eyebrow="Baralho"
        title="Respostas Poderosas"
        description={`${cards.length} cards com respostas claras para situações do dia a dia. Copie, adapte, favorite e compartilhe.`}
      />

      <div className="mb-6 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por situação ou palavra" className="input h-11 pl-9" aria-label="Buscar cards" />
          </div>
          <Segmented label="Exibição" value={view} onChange={setView} options={[{ value: 'all', label: 'Todos' }, { value: 'fav', label: `Favoritos (${favorites.length})` }]} />
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:flex-wrap sm:px-0">
          {['Todas', ...responseCategories].map((c) => (
            <Chip key={c} active={category === c} onClick={() => setParams(c === 'Todas' ? {} : { categoria: c })}>{c}</Chip>
          ))}
        </div>
        <p className="text-[12.5px] text-muted" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'card encontrado' : 'cards encontrados'}</p>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Layers className="h-8 w-8" />} title="Nenhum card encontrado" description={view === 'fav' ? 'Você ainda não favoritou cards nesta categoria.' : 'Tente outra busca ou categoria.'} />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((c) => (
            <CardItem key={c.id} card={c} locked={!can('cards', cards.indexOf(c))} highlight={highlight === c.id} />
          ))}
        </div>
      )}
    </div>
  )
}
