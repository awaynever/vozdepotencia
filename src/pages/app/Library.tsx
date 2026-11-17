import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, CheckCircle2, Clock, Search } from 'lucide-react'
import { Badge, Chip, EmptyState, FavoriteButton, PageHeader, PremiumLock, Segmented } from '@/components/ui/primitives'
import { useContentStore } from '@/store/useContentStore'
import { useAppStore } from '@/store/useAppStore'
import { useAccess } from '@/hooks/useProgress'
import { libraryCategories, libraryFormats } from '@/mocks/library'
import { cn } from '@/utils/cn'
import type { LibraryItem } from '@/types'

const coverTones: Record<LibraryItem['cover'], string> = {
  rubi: 'bg-gradient-to-br from-rubi to-rubi-deep text-marfim',
  champagne: 'bg-gradient-to-br from-[#e0cba5] to-champagne text-onix',
  onix: 'bg-gradient-to-br from-onix to-[#3b272b] text-marfim',
  bege: 'bg-gradient-to-br from-bege to-[#dfd3bf] text-onix',
  marfim: 'bg-white text-onix border-b border-line',
}

export function LibraryCover({ item, size = 'md' }: { item: LibraryItem; size?: 'md' | 'lg' }) {
  return (
    <div className={cn('relative flex h-full w-full flex-col justify-between overflow-hidden p-5', coverTones[item.cover])}>
      {item.image && <img src={item.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-25 mix-blend-luminosity" loading="lazy" />}
      <div className="relative flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] opacity-80">{item.format}</span>
        <span className="font-serif text-[13px] font-semibold opacity-70">VP</span>
      </div>
      <div className="relative">
        <span className="mb-2 block h-px w-10 bg-champagne" aria-hidden="true" />
        <p className={cn('font-serif font-semibold leading-[1.05]', size === 'lg' ? 'text-[34px]' : 'text-[24px]')}>{item.title}</p>
      </div>
    </div>
  )
}

export default function Library() {
  const items = useContentStore((s) => s.library).filter((i) => i.published)
  const favorites = useAppStore((s) => s.favorites.library)
  const read = useAppStore((s) => s.libraryRead)
  const toggleFavorite = useAppStore((s) => s.toggleFavorite)
  const { can } = useAccess()
  const [query, setQuery] = useState('')
  const [format, setFormat] = useState('Todos')
  const [category, setCategory] = useState('Todas')
  const [view, setView] = useState<'all' | 'fav'>('all')

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return items.filter((i) => (format === 'Todos' || i.format === format) && (category === 'Todas' || i.category === category) && (view === 'all' || favorites.includes(i.id)) && (!q || `${i.title} ${i.description}`.toLowerCase().includes(q)))
  }, [items, query, format, category, view, favorites])

  const featured = items.filter((i) => i.featured).slice(0, 3)

  return (
    <div>
      <PageHeader eyebrow="Conteúdos" title="Biblioteca" description="E-books, guias, artigos, exercícios, planners e checklists originais, com leitor interno." />

      {featured.length > 0 && view === 'all' && !query && format === 'Todos' && category === 'Todas' && (
        <section className="mb-10 grid gap-4 md:grid-cols-3">
          {featured.map((i) => (
            <Link key={i.id} to={`/app/biblioteca/${i.id}`} className="group overflow-hidden rounded-2xl shadow-soft transition-transform hover:-translate-y-0.5">
              <div className="aspect-[4/3]"><LibraryCover item={i} size="lg" /></div>
            </Link>
          ))}
        </section>
      )}

      <div className="mb-6 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar conteúdo" className="input h-10 py-0 pl-9" aria-label="Buscar na biblioteca" />
          </div>
          <label htmlFor="lib-cat" className="sr-only">Categoria</label>
          <select id="lib-cat" value={category} onChange={(e) => setCategory(e.target.value)} className="input h-10 w-auto py-0">
            <option>Todas</option>
            {libraryCategories.map((c) => <option key={c}>{c}</option>)}
          </select>
          <Segmented label="Exibição" value={view} onChange={setView} options={[{ value: 'all', label: 'Todos' }, { value: 'fav', label: 'Favoritos' }]} />
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none sm:mx-0 sm:flex-wrap sm:px-0">
          {['Todos', ...libraryFormats].map((f) => <Chip key={f} active={format === f} onClick={() => setFormat(f)}>{f}</Chip>)}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<BookOpen className="h-8 w-8" />} title="Nenhum conteúdo encontrado" description="Tente outro filtro ou termo de busca." />
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {filtered.map((i) => {
            const locked = !can('library', i.id)
            return (
              <Link key={i.id} to={`/app/biblioteca/${i.id}`} className="group card flex flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lift">
                <div className="relative aspect-[3/4]">
                  <LibraryCover item={i} />
                  <FavoriteButton active={favorites.includes(i.id)} onToggle={() => toggleFavorite('library', i.id)} light className="absolute right-3 top-10" />
                  {locked && <PremiumLock compact className="absolute bottom-3 left-3" />}
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-champagne-ink">{i.category}</p>
                  <p className="mt-1 line-clamp-2 text-[13px] text-muted">{i.description}</p>
                  <div className="mt-auto flex items-center gap-2 pt-3 text-[11.5px] text-muted">
                    <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" aria-hidden="true" /> {i.minutes} min</span>
                    {read.includes(i.id) && <Badge tone="success" className="ml-auto"><CheckCircle2 className="h-3 w-3" aria-hidden="true" /> Lido</Badge>}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
