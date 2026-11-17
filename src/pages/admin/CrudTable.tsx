import { useMemo, useState, type ReactNode } from 'react'
import { Eye, EyeOff, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { Badge, Button, Field } from '@/components/ui/primitives'
import { Modal } from '@/components/ui/Modal'
import { toast } from '@/store/useToastStore'
import { cn } from '@/utils/cn'

export type FieldType = 'text' | 'textarea' | 'number' | 'select' | 'boolean' | 'lines'

export interface FieldDef<T> {
  key: keyof T & string
  label: string
  type: FieldType
  options?: string[]
  required?: boolean
  hint?: string
  wide?: boolean
}

export interface ColumnDef<T> {
  label: string
  render: (item: T) => ReactNode
  className?: string
}

interface Props<T extends { id: string }> {
  title: string
  description?: string
  items: T[]
  columns: ColumnDef<T>[]
  fields: FieldDef<T>[]
  searchText: (item: T) => string
  onSave: (item: T) => void
  onDelete?: (id: string) => void
  createNew?: () => T
  publishKey?: keyof T & string
  allowCreate?: boolean
}

type Draft = Record<string, unknown>

export function CrudTable<T extends { id: string }>({ title, description, items, columns, fields, searchText, onSave, onDelete, createNew, publishKey, allowCreate = true }: Props<T>) {
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState<{ item: T; isNew: boolean } | null>(null)
  const [draft, setDraft] = useState<Draft>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [toDelete, setToDelete] = useState<T | null>(null)

  const filtered = useMemo(() => items.filter((i) => !query || searchText(i).toLowerCase().includes(query.toLowerCase())), [items, query, searchText])

  const open = (item: T, isNew: boolean) => {
    const d: Draft = {}
    for (const f of fields) {
      const v = (item as Record<string, unknown>)[f.key]
      d[f.key] = f.type === 'lines' ? (Array.isArray(v) ? v.join('\n') : '') : v
    }
    setDraft(d)
    setErrors({})
    setEditing({ item, isNew })
  }

  const save = () => {
    if (!editing) return
    const errs: Record<string, string> = {}
    const out: Record<string, unknown> = { ...(editing.item as Record<string, unknown>) }
    for (const f of fields) {
      let v = draft[f.key]
      if (f.type === 'number') v = Number(v)
      if (f.type === 'lines') v = String(v ?? '').split('\n').map((l) => l.trim()).filter(Boolean)
      if (f.type === 'text' || f.type === 'textarea') v = String(v ?? '').trim()
      if (f.required && (v === '' || v === undefined || (Array.isArray(v) && v.length === 0) || (f.type === 'number' && Number.isNaN(v)))) errs[f.key] = 'Campo obrigatório'
      out[f.key] = v
    }
    setErrors(errs)
    if (Object.keys(errs).length) return
    onSave(out as T)
    toast(editing.isNew ? 'Conteúdo criado' : 'Alterações salvas', 'success')
    setEditing(null)
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[34px]">{title}</h1>
          {description && <p className="mt-1 text-[13.5px] text-muted">{description}</p>}
        </div>
        {allowCreate && createNew && (
          <Button onClick={() => open(createNew(), true)}><Plus className="h-4 w-4" aria-hidden="true" /> Novo</Button>
        )}
      </div>
      <div className="relative mb-4 max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} className="input h-10 py-0 pl-9" placeholder="Buscar" aria-label={`Buscar em ${title}`} />
      </div>
      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full min-w-[640px] text-left text-[13.5px]">
          <thead className="border-b border-line bg-marfim text-[11.5px] uppercase tracking-[0.08em] text-muted">
            <tr>
              {columns.map((c) => <th key={c.label} scope="col" className={cn('px-4 py-3 font-semibold', c.className)}>{c.label}</th>)}
              {publishKey && <th scope="col" className="px-4 py-3 font-semibold">Status</th>}
              <th scope="col" className="px-4 py-3 text-right font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filtered.map((item) => {
              const published = publishKey ? Boolean((item as Record<string, unknown>)[publishKey]) : true
              return (
                <tr key={item.id} className="hover:bg-marfim/60">
                  {columns.map((c) => <td key={c.label} className={cn('px-4 py-3 align-top', c.className)}>{c.render(item)}</td>)}
                  {publishKey && (
                    <td className="px-4 py-3 align-top">
                      <Badge tone={published ? 'success' : 'neutral'}>{published ? 'Publicado' : 'Rascunho'}</Badge>
                    </td>
                  )}
                  <td className="whitespace-nowrap px-4 py-2 text-right align-top">
                    {publishKey && (
                      <button
                        onClick={() => { onSave({ ...item, [publishKey]: !published } as T); toast(published ? 'Conteúdo despublicado' : 'Conteúdo publicado', 'success') }}
                        className="rounded-lg p-2 text-muted hover:bg-bege hover:text-onix"
                        aria-label={published ? 'Despublicar' : 'Publicar'}
                        title={published ? 'Despublicar' : 'Publicar'}
                      >
                        {published ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                      </button>
                    )}
                    <button onClick={() => open(item, false)} className="rounded-lg p-2 text-muted hover:bg-bege hover:text-onix" aria-label="Editar" title="Editar"><Pencil className="h-4 w-4" aria-hidden="true" /></button>
                    {onDelete && <button onClick={() => setToDelete(item)} className="rounded-lg p-2 text-muted hover:bg-rubi-soft hover:text-rubi" aria-label="Excluir" title="Excluir"><Trash2 className="h-4 w-4" aria-hidden="true" /></button>}
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={columns.length + 2} className="px-4 py-10 text-center text-muted">Nenhum item encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[12px] text-muted">{filtered.length} de {items.length} itens · alterações salvas neste navegador e refletidas na plataforma.</p>

      <Modal
        open={!!editing}
        onOpenChange={(o) => !o && setEditing(null)}
        size="lg"
        title={editing?.isNew ? `Novo · ${title}` : `Editar · ${title}`}
        footer={<><Button variant="ghost" onClick={() => setEditing(null)}>Cancelar</Button><Button onClick={save}>Salvar</Button></>}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map((f) => {
            const id = `f-${f.key}`
            const v = draft[f.key]
            return (
              <div key={f.key} className={cn((f.wide || f.type === 'textarea' || f.type === 'lines') && 'sm:col-span-2')}>
                {f.type === 'boolean' ? (
                  <label className="flex items-center gap-2.5 pt-6 text-[14px] font-semibold">
                    <input type="checkbox" className="h-4 w-4 accent-[#650F1D]" checked={Boolean(v)} onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.checked }))} /> {f.label}
                  </label>
                ) : (
                  <Field label={`${f.label}${f.required ? ' *' : ''}`} htmlFor={id} hint={f.hint ?? (f.type === 'lines' ? 'Um item por linha' : undefined)} error={errors[f.key]}>
                    {f.type === 'select' ? (
                      <select id={id} className="input" value={String(v ?? '')} onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}>
                        {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    ) : f.type === 'textarea' || f.type === 'lines' ? (
                      <textarea id={id} rows={f.type === 'lines' ? 5 : 4} className="input" value={String(v ?? '')} onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))} />
                    ) : (
                      <input id={id} type={f.type === 'number' ? 'number' : 'text'} className="input" value={String(v ?? '')} onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))} />
                    )}
                  </Field>
                )}
              </div>
            )
          })}
        </div>
      </Modal>

      <Modal open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)} size="sm" title="Excluir item?" description="Esta ação remove o conteúdo da plataforma neste navegador."
        footer={<><Button variant="ghost" onClick={() => setToDelete(null)}>Cancelar</Button><Button onClick={() => { if (toDelete && onDelete) onDelete(toDelete.id); setToDelete(null); toast('Item excluído') }}>Excluir</Button></>}>
        <p className="text-[14px]">O item poderá ser recuperado restaurando a demonstração.</p>
      </Modal>
    </div>
  )
}
