import { useMemo, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Download, Lock, NotebookPen, Pencil, Plus, Search, Star, Trash2 } from 'lucide-react'
import { Badge, Button, Chip, DemoNotice, EmptyState, Field, PageHeader, Segmented } from '@/components/ui/primitives'
import { Modal } from '@/components/ui/Modal'
import { useAppStore } from '@/store/useAppStore'
import { useAccess } from '@/hooks/useProgress'
import { journalCategories, journalPrompts, moods } from '@/mocks/journal'
import { downloadText, journalToMarkdown } from '@/services/exportService'
import { formatLong, today } from '@/utils/date'
import { toast } from '@/store/useToastStore'
import { cn } from '@/utils/cn'
import type { JournalEntry, Mood } from '@/types'

const schema = z.object({
  title: z.string().trim().min(2, 'Dê um título com pelo menos 2 caracteres').max(120, 'Use até 120 caracteres'),
  date: z.string().min(10, 'Selecione uma data'),
  mood: z.enum(['confiante', 'motivada', 'tranquila', 'insegura', 'cansada', 'sobrecarregada']),
  categories: z.array(z.string()),
  content: z.string().trim().min(3, 'Escreva pelo menos algumas palavras'),
  favorite: z.boolean(),
})
type FormValues = z.infer<typeof schema>

const moodLabel = (m: string) => moods.find((x) => x.id === m)?.label ?? m

function EntryForm({ entry, prompt, onDone }: { entry?: JournalEntry; prompt?: string; onDone: () => void }) {
  const saveJournal = useAppStore((s) => s.saveJournal)
  const { register, handleSubmit, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: entry
      ? { title: entry.title, date: entry.date, mood: entry.mood, categories: entry.categories, content: entry.content, favorite: entry.favorite }
      : { title: prompt ?? '', date: today(), mood: 'tranquila', categories: prompt ? ['Reflexões'] : [], content: '', favorite: false },
  })
  const submit = (v: FormValues) => {
    saveJournal({ ...v, id: entry?.id })
    toast(entry ? 'Registro atualizado' : 'Registro salvo no Diário', 'success')
    onDone()
  }
  return (
    <form id="journal-form" onSubmit={handleSubmit(submit)} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-[1fr_170px]">
        <Field label="Título" htmlFor="j-title" error={errors.title?.message}>
          <input id="j-title" className="input" {...register('title')} />
        </Field>
        <Field label="Data" htmlFor="j-date" error={errors.date?.message}>
          <input id="j-date" type="date" className="input" max={today()} {...register('date')} />
        </Field>
      </div>
      <Field label="Como você se sentiu?">
        <Controller
          control={control}
          name="mood"
          render={({ field }) => (
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Sentimento">
              {moods.map((m) => (
                <Chip key={m.id} role="radio" aria-checked={field.value === m.id} active={field.value === m.id} onClick={() => field.onChange(m.id as Mood)}>{m.label}</Chip>
              ))}
            </div>
          )}
        />
      </Field>
      <Field label="Categorias">
        <Controller
          control={control}
          name="categories"
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {journalCategories.map((c) => {
                const on = field.value.includes(c)
                return <Chip key={c} active={on} onClick={() => field.onChange(on ? field.value.filter((x) => x !== c) : [...field.value, c])}>{c}</Chip>
              })}
            </div>
          )}
        />
      </Field>
      <Field label="Registro" htmlFor="j-content" error={errors.content?.message}>
        <textarea id="j-content" rows={8} className="input resize-y leading-relaxed" placeholder={prompt ?? 'Escreva livremente…'} {...register('content')} />
      </Field>
      <label className="flex items-center gap-2 text-[13.5px]">
        <input type="checkbox" className="h-4 w-4 accent-[#650F1D]" {...register('favorite')} /> Marcar como favorito
      </label>
    </form>
  )
}

export default function Journal() {
  const journal = useAppStore((s) => s.journal)
  const deleteJournal = useAppStore((s) => s.deleteJournal)
  const toggleFav = useAppStore((s) => s.toggleJournalFavorite)
  const { can } = useAccess()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Todas')
  const [view, setView] = useState<'all' | 'fav'>('all')
  const [editing, setEditing] = useState<{ entry?: JournalEntry; prompt?: string } | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<JournalEntry | null>(null)
  const [selected, setSelected] = useState<string | null>(null)

  const entries = useMemo(() => {
    const q = query.toLowerCase()
    return [...journal]
      .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))
      .filter((e) => (category === 'Todas' || e.categories.includes(category)) && (view === 'all' || e.favorite) && (!q || `${e.title} ${e.content}`.toLowerCase().includes(q)))
  }, [journal, query, category, view])

  const open = journal.find((e) => e.id === selected) ?? null

  if (!can('diario')) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <Lock className="mx-auto h-10 w-10 text-champagne-ink" aria-hidden="true" />
        <h1 className="mt-4 text-[36px]">Meu Diário</h1>
        <p className="mt-2 text-muted">O Diário faz parte do plano Experience.</p>
        <Button to="/app/planos" className="mt-6">Conhecer os planos</Button>
      </div>
    )
  }

  const exportAll = (format: 'md' | 'json') => {
    const list = entries.length ? entries : journal
    if (format === 'md') downloadText(journalToMarkdown(list, moodLabel), 'meu-diario-voz-de-potencia.md', 'text/markdown;charset=utf-8')
    else downloadText(JSON.stringify(list, null, 2), 'meu-diario-voz-de-potencia.json', 'application/json')
    toast(`${list.length} registros exportados`, 'success')
  }

  return (
    <div>
      <PageHeader
        eyebrow="Espaço privado"
        title="Meu Diário"
        description="Registre conquistas, decisões, aprendizados e desafios. Escrever ajuda a organizar o que você sente e o que deseja comunicar."
        actions={
          <>
            <Button variant="outline" onClick={() => exportAll('md')}><Download className="h-4 w-4" aria-hidden="true" /> Exportar</Button>
            <Button onClick={() => setEditing({})}><Plus className="h-4 w-4" aria-hidden="true" /> Novo registro</Button>
          </>
        }
      />
      <DemoNotice className="mb-6">Demonstração com armazenamento no navegador. Não utilize para guardar informações confidenciais reais.</DemoNotice>

      <section className="mb-8">
        <p className="mb-3 text-[13px] font-semibold">Perguntas sugeridas</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {journalPrompts.map((p) => (
            <button key={p} onClick={() => setEditing({ prompt: p })} className="card p-4 text-left font-serif text-[18px] italic leading-snug transition-colors hover:border-champagne hover:bg-white">
              {p}
              <span className="mt-2 flex items-center gap-1 font-sans text-[12px] font-semibold not-italic text-rubi"><Pencil className="h-3 w-3" aria-hidden="true" /> Escrever</span>
            </button>
          ))}
        </div>
      </section>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Pesquisar no diário" className="input h-10 py-0 pl-9" aria-label="Pesquisar no diário" />
        </div>
        <label htmlFor="cat" className="sr-only">Categoria</label>
        <select id="cat" value={category} onChange={(e) => setCategory(e.target.value)} className="input h-10 w-auto py-0">
          <option>Todas</option>
          {journalCategories.map((c) => <option key={c}>{c}</option>)}
        </select>
        <Segmented label="Exibição" value={view} onChange={setView} options={[{ value: 'all', label: 'Todos' }, { value: 'fav', label: 'Favoritos' }]} />
        <Button variant="ghost" size="sm" onClick={() => exportAll('json')}>JSON</Button>
      </div>

      {entries.length === 0 ? (
        <EmptyState icon={<NotebookPen className="h-8 w-8" />} title="Nenhum registro encontrado" description="Comece com uma das perguntas sugeridas acima." action={<Button onClick={() => setEditing({})}>Novo registro</Button>} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {entries.map((e) => {
            const m = moods.find((x) => x.id === e.mood)
            return (
              <article key={e.id} className="card group flex flex-col p-5 transition-shadow hover:shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[12px] text-muted">{formatLong(e.date)}</p>
                    <button onClick={() => setSelected(e.id)} className="mt-0.5 text-left font-serif text-[23px] font-semibold leading-snug hover:text-rubi">{e.title}</button>
                  </div>
                  <button onClick={() => toggleFav(e.id)} aria-pressed={e.favorite} aria-label={e.favorite ? 'Remover dos favoritos' : 'Favoritar registro'} className="rounded-full p-1.5 hover:bg-marfim">
                    <Star className={cn('h-5 w-5', e.favorite ? 'fill-champagne text-champagne' : 'text-muted')} aria-hidden="true" />
                  </button>
                </div>
                <p className="mt-2 line-clamp-3 flex-1 text-[14px] text-onix/80">{e.content}</p>
                <div className="mt-4 flex flex-wrap items-center gap-1.5">
                  {m && <Badge tone="rubi">{m.label}</Badge>}
                  {e.categories.map((c) => <Badge key={c}>{c}</Badge>)}
                  <span className="ml-auto flex gap-1">
                    <button onClick={() => setEditing({ entry: e })} className="rounded-lg p-2 text-muted hover:bg-marfim hover:text-onix" aria-label={`Editar ${e.title}`}><Pencil className="h-4 w-4" aria-hidden="true" /></button>
                    <button onClick={() => setConfirmDelete(e)} className="rounded-lg p-2 text-muted hover:bg-rubi-soft hover:text-rubi" aria-label={`Excluir ${e.title}`}><Trash2 className="h-4 w-4" aria-hidden="true" /></button>
                  </span>
                </div>
              </article>
            )
          })}
        </div>
      )}

      <Modal
        open={!!editing}
        onOpenChange={(o) => !o && setEditing(null)}
        size="lg"
        title={editing?.entry ? 'Editar registro' : 'Novo registro'}
        description={editing?.prompt}
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancelar</Button>
            <Button type="submit" form="journal-form">Salvar</Button>
          </>
        }
      >
        {editing && <EntryForm entry={editing.entry} prompt={editing.prompt} onDone={() => setEditing(null)} />}
      </Modal>

      <Modal open={!!open} onOpenChange={(o) => !o && setSelected(null)} size="lg" title={open?.title ?? ''} description={open ? `${formatLong(open.date)} · ${moodLabel(open.mood)}` : ''}
        footer={open && <><Button variant="ghost" onClick={() => { setSelected(null); setConfirmDelete(open) }}>Excluir</Button><Button onClick={() => { setSelected(null); setEditing({ entry: open }) }}>Editar</Button></>}>
        {open && <p className="whitespace-pre-line text-[15.5px] leading-relaxed">{open.content}</p>}
      </Modal>

      <Modal open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)} size="sm" title="Excluir registro?" description="Esta ação não pode ser desfeita."
        footer={<><Button variant="ghost" onClick={() => setConfirmDelete(null)}>Cancelar</Button><Button onClick={() => { if (confirmDelete) deleteJournal(confirmDelete.id); setConfirmDelete(null); toast('Registro excluído') }}>Excluir</Button></>}>
        <p className="text-[14.5px]">“{confirmDelete?.title}”</p>
      </Modal>
    </div>
  )
}
