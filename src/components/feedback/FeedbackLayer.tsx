import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Award, Check, Sparkles, X } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { useToastStore } from '@/store/useToastStore'
import { cn } from '@/utils/cn'

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[70] flex flex-col items-center gap-2 px-4 lg:bottom-6" aria-live="polite">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className={cn('pointer-events-auto flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-medium shadow-lift', t.tone === 'error' ? 'bg-rubi text-white' : 'bg-onix text-marfim')}
          >
            {t.tone !== 'error' && <Check className="h-4 w-4 text-champagne" aria-hidden="true" />}
            <span>{t.message}</span>
            <button onClick={() => dismiss(t.id)} className="ml-1 rounded p-0.5 opacity-60 hover:opacity-100" aria-label="Fechar aviso">
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export function CelebrationLayer() {
  const celebrations = useAppStore((s) => s.celebrations)
  const dismiss = useAppStore((s) => s.dismissCelebration)
  const current = celebrations[0]

  useEffect(() => {
    if (!current) return
    const t = setTimeout(dismiss, current.kind === 'achievement' ? 4200 : 2200)
    return () => clearTimeout(t)
  }, [current, dismiss])

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-[80] flex justify-center px-4" aria-live="assertive">
      <AnimatePresence mode="wait">
        {current && (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className={cn(
              'pointer-events-auto flex max-w-md items-center gap-3.5 rounded-2xl px-4 py-3.5 shadow-lift',
              current.kind === 'achievement' ? 'bg-gradient-to-br from-rubi to-rubi-deep text-marfim' : 'border border-line bg-white text-onix',
            )}
            role="status"
          >
            <div className={cn('relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full', current.kind === 'achievement' ? 'bg-champagne/15 text-champagne' : 'bg-champagne-soft text-champagne-ink')}>
              {current.kind === 'achievement' && <span className="absolute inset-0 rounded-full border border-champagne/60 animate-pulse-ring" />}
              {current.kind === 'achievement' ? <Award className="h-5 w-5" aria-hidden="true" /> : <Sparkles className="h-5 w-5" aria-hidden="true" />}
            </div>
            <div className="min-w-0">
              <p className={cn('text-[10.5px] font-semibold uppercase tracking-[0.16em]', current.kind === 'achievement' ? 'text-champagne' : 'text-champagne-ink')}>
                {current.kind === 'achievement' ? 'Nova conquista' : 'Atividade concluída'}
              </p>
              <p className="font-serif text-xl font-semibold leading-tight">{current.title}</p>
              <p className={cn('truncate text-[12.5px]', current.kind === 'achievement' ? 'text-marfim/75' : 'text-muted')}>{current.description}</p>
            </div>
            <button onClick={dismiss} className="ml-1 self-start rounded p-1 opacity-60 hover:opacity-100" aria-label="Fechar">
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
