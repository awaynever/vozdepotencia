import { cn } from '@/utils/cn'

export function Monogram({ size = 40, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={cn('shrink-0', className)} role="img" aria-label="Voz de Potência">
      <rect width="64" height="64" rx="14" fill="#650F1D" />
      <circle cx="32" cy="32" r="23.5" fill="none" stroke="#C5A572" strokeWidth="1" />
      <text x="32" y="39.5" textAnchor="middle" fontFamily="'Cormorant Garamond', Georgia, serif" fontWeight="600" fontSize="21" fill="#C5A572" letterSpacing="-0.5">
        VP
      </text>
    </svg>
  )
}

export function Logo({ light = false, compact = false, className }: { light?: boolean; compact?: boolean; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-3', className)}>
      <Monogram size={compact ? 34 : 40} />
      <span className="flex flex-col leading-none">
        <span className={cn('font-serif text-[22px] font-semibold tracking-tight', light ? 'text-marfim' : 'text-onix')}>Voz de Potência</span>
        {!compact && <span className={cn('mt-1 text-[9.5px] font-semibold uppercase tracking-[0.22em]', light ? 'text-champagne' : 'text-champagne-ink')}>Sua voz · Sua essência · Sua potência</span>}
      </span>
    </span>
  )
}
