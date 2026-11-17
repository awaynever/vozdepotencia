import { forwardRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Info, Lock } from 'lucide-react'
import { cn } from '@/utils/cn'

// ── Button ──
type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold' | 'light'
type Size = 'sm' | 'md' | 'lg' | 'icon'

const variants: Record<Variant, string> = {
  primary: 'bg-rubi text-white hover:bg-rubi-deep shadow-soft',
  secondary: 'bg-bege text-onix hover:bg-[#e4d9c7]',
  outline: 'border border-line bg-white text-onix hover:border-champagne hover:bg-marfim',
  ghost: 'text-onix hover:bg-bege/60',
  gold: 'bg-champagne text-onix hover:bg-[#b8975f]',
  light: 'bg-white/95 text-rubi hover:bg-white',
}
const sizes: Record<Size, string> = {
  sm: 'h-9 px-3.5 text-[13px] gap-1.5',
  md: 'h-11 px-5 text-sm gap-2',
  lg: 'h-13 px-7 text-[15px] gap-2.5',
  icon: 'h-10 w-10 justify-center',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  to?: string
}

const buttonClass = (variant: Variant = 'primary', size: Size = 'md', className?: string) =>
  cn(
    'inline-flex items-center justify-center rounded-xl font-semibold tracking-[0.01em] transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 select-none whitespace-nowrap',
    variants[variant],
    sizes[size],
    className,
  )

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({ variant = 'primary', size = 'md', className, to, children, type = 'button', ...props }, ref) {
  if (to) {
    return (
      <Link to={to} className={buttonClass(variant, size, className)}>
        {children}
      </Link>
    )
  }
  return (
    <button ref={ref} type={type} className={buttonClass(variant, size, className)} {...props}>
      {children}
    </button>
  )
})

// ── Card ──
export function Card({ className, children, as: As = 'div', ...props }: { className?: string; children: ReactNode; as?: 'div' | 'section' | 'article' } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <As className={cn('card', className)} {...props}>
      {children}
    </As>
  )
}

// ── Badge ──
type Tone = 'neutral' | 'rubi' | 'gold' | 'success' | 'warning' | 'dark'
const tones: Record<Tone, string> = {
  neutral: 'bg-bege text-onix/80',
  rubi: 'bg-rubi-soft text-rubi',
  gold: 'bg-champagne-soft text-champagne-ink',
  success: 'bg-sucesso-soft text-sucesso',
  warning: 'bg-alerta-soft text-alerta',
  dark: 'bg-onix text-marfim',
}
export function Badge({ tone = 'neutral', className, children }: { tone?: Tone; className?: string; children: ReactNode }) {
  return <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11.5px] font-semibold', tones[tone], className)}>{children}</span>
}

// ── Progress ──
export function ProgressBar({ value, className, tone = 'rubi', label }: { value: number; className?: string; tone?: 'rubi' | 'gold' | 'light'; label?: string }) {
  const v = Math.max(0, Math.min(100, value))
  return (
    <div
      className={cn('h-2 w-full overflow-hidden rounded-full', tone === 'light' ? 'bg-white/20' : 'bg-bege', className)}
      role="progressbar"
      aria-valuenow={Math.round(v)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? 'Progresso'}
    >
      <div
        className={cn('h-full rounded-full transition-[width] duration-700 ease-out', tone === 'rubi' && 'bg-rubi', tone === 'gold' && 'bg-champagne', tone === 'light' && 'bg-champagne')}
        style={{ width: `${v}%` }}
      />
    </div>
  )
}

export function ProgressRing({ value, size = 64, stroke = 5, children, light }: { value: number; size?: number; stroke?: number; children?: ReactNode; light?: boolean }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const offset = c - (Math.max(0, Math.min(100, value)) / 100) * c
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={light ? 'rgba(255,255,255,0.18)' : '#EDE5D8'} strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={light ? '#C5A572' : '#650F1D'} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  )
}

// ── Section header ──
export function SectionHeader({ eyebrow, title, description, action, className }: { eyebrow?: string; title: ReactNode; description?: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={cn('mb-5 flex flex-wrap items-end justify-between gap-3', className)}>
      <div className="min-w-0">
        {eyebrow && <p className="eyebrow mb-1.5">{eyebrow}</p>}
        <h2 className="text-[26px] sm:text-[30px]">{title}</h2>
        {description && <p className="mt-1.5 max-w-2xl text-sm text-muted">{description}</p>}
      </div>
      {action}
    </div>
  )
}

// ── Page header ──
export function PageHeader({ eyebrow, title, description, actions, children }: { eyebrow?: string; title: ReactNode; description?: ReactNode; actions?: ReactNode; children?: ReactNode }) {
  return (
    <header className="mb-7 flex flex-col gap-4 sm:mb-9 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
        <h1 className="text-[34px] leading-[1.05] sm:text-[44px]">{title}</h1>
        {description && <p className="mt-3 max-w-2xl text-[15px] text-muted">{description}</p>}
        {children}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </header>
  )
}

// ── Chip ──
export function Chip({ active, onClick, children, className, ...rest }: { active?: boolean; onClick?: () => void; children: ReactNode; className?: string } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active} className={cn('chip shrink-0', active && 'chip-active', className)} {...rest}>
      {children}
    </button>
  )
}

// ── Segmented ──
export function Segmented<T extends string>({ options, value, onChange, className, label }: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void; className?: string; label?: string }) {
  return (
    <div role="radiogroup" aria-label={label} className={cn('inline-flex rounded-xl border border-line bg-white p-1', className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn('rounded-lg px-3 py-1.5 text-[13px] font-semibold transition-colors', value === o.value ? 'bg-rubi text-white' : 'text-muted hover:text-onix')}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

// ── Demo notice ──
export function DemoNotice({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-start gap-2.5 rounded-xl border border-champagne/40 bg-champagne-soft/60 px-3.5 py-2.5 text-[13px] text-champagne-ink', className)} role="note">
      <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div>{children}</div>
    </div>
  )
}

export function DemoTag({ className, label = 'Demonstração' }: { className?: string; label?: string }) {
  return <span className={cn('inline-flex items-center rounded-full border border-champagne/50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-champagne-ink', className)}>{label}</span>
}

// ── Image with graceful fallback ──
export function Img({ src, alt, className, imgClassName }: { src?: string; alt: string; className?: string; imgClassName?: string }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className={cn('relative overflow-hidden bg-gradient-to-br from-rubi to-rubi-deep', className)}>
      {src && !failed && <img src={src} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} className={cn('h-full w-full object-cover', imgClassName)} />}
    </div>
  )
}

// ── Favorite ──
export function FavoriteButton({ active, onToggle, label = 'Favoritar', className, light }: { active: boolean; onToggle: () => void; label?: string; className?: string; light?: boolean }) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onToggle()
      }}
      aria-pressed={active}
      aria-label={active ? `Remover dos favoritos` : label}
      title={active ? 'Remover dos favoritos' : label}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-full transition-all hover:scale-105',
        light ? 'bg-white/90 text-rubi backdrop-blur' : 'bg-white text-rubi border border-line',
        className,
      )}
    >
      <Heart className={cn('h-4 w-4 transition-all', active && 'fill-rubi')} aria-hidden="true" />
    </button>
  )
}

// ── Empty state ──
export function EmptyState({ icon, title, description, action }: { icon?: ReactNode; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-white/60 px-6 py-14 text-center">
      {icon && <div className="mb-3 text-champagne">{icon}</div>}
      <p className="font-serif text-2xl">{title}</p>
      {description && <p className="mt-1.5 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

// ── Stat ──
export function Stat({ label, value, hint, icon, className }: { label: string; value: ReactNode; hint?: ReactNode; icon?: ReactNode; className?: string }) {
  return (
    <div className={cn('card p-4 sm:p-5', className)}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-[12px] font-medium leading-snug text-muted">{label}</p>
        {icon && <span className="shrink-0 text-champagne-ink">{icon}</span>}
      </div>
      <p className="mt-2 font-serif text-[32px] font-semibold leading-none text-onix">{value}</p>
      {hint && <p className="mt-1.5 text-[12px] text-muted">{hint}</p>}
    </div>
  )
}

// ── Premium lock ──
export function PremiumLock({ className, compact }: { className?: string; compact?: boolean }) {
  return (
    <Link to="/app/planos" className={cn('inline-flex items-center gap-1.5 rounded-full bg-onix/85 px-2.5 py-1 text-[11px] font-semibold text-marfim backdrop-blur hover:bg-onix', className)}>
      <Lock className="h-3 w-3" aria-hidden="true" />
      {compact ? 'Experience' : 'Disponível no Experience'}
    </Link>
  )
}

// ── Field ──
export function Field({ label, htmlFor, hint, error, children }: { label: string; htmlFor?: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-[13px] font-semibold text-onix">
        {label}
      </label>
      {children}
      {hint && !error && <p className="text-[12px] text-muted">{hint}</p>}
      {error && <p className="text-[12px] font-medium text-rubi" role="alert">{error}</p>}
    </div>
  )
}

export function Toggle({ checked, onChange, label, description }: { checked: boolean; onChange: (v: boolean) => void; label: string; description?: string }) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 py-3">
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        {description && <span className="block text-[13px] text-muted">{description}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={cn('relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors', checked ? 'bg-rubi' : 'bg-line')}
      >
        <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all', checked ? 'left-[22px]' : 'left-0.5')} />
      </button>
    </label>
  )
}
