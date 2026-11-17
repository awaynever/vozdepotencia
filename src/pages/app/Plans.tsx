import { Check, Lock, Sparkles } from 'lucide-react'
import { Badge, Button, DemoNotice, PageHeader } from '@/components/ui/primitives'
import { useAppStore } from '@/store/useAppStore'
import { useContentStore } from '@/store/useContentStore'
import { toast } from '@/store/useToastStore'
import { cn } from '@/utils/cn'

export default function Plans() {
  const plans = useContentStore((s) => s.plans)
  const current = useAppStore((s) => s.profile.plan)
  const setPlan = useAppStore((s) => s.setPlan)

  return (
    <div>
      <PageHeader eyebrow="Acesso" title="Planos" description="Escolha a experiência ideal para o seu momento. Nesta demonstração, você pode alternar entre os planos para ver os diferentes estados de acesso." />
      <DemoNotice className="mb-8">Nenhuma cobrança é realizada e nenhum dado bancário é solicitado. O checkout é apenas uma simulação.</DemoNotice>

      <div className="grid gap-5 lg:grid-cols-3">
        {plans.map((p) => {
          const isCurrent = current === p.id
          return (
            <div key={p.id} className={cn('relative flex flex-col rounded-2xl border p-7', p.highlight ? 'border-rubi bg-rubi text-marfim shadow-lift' : 'border-line bg-white', isCurrent && !p.highlight && 'ring-2 ring-rubi')}>
              <div className="flex flex-wrap gap-2">
                {isCurrent && <Badge tone={p.highlight ? 'gold' : 'rubi'} className={p.highlight ? 'bg-champagne text-onix' : ''}><Check className="h-3 w-3" aria-hidden="true" /> Seu plano atual</Badge>}
                {p.comingSoon && <Badge tone="dark">Lançamento futuro</Badge>}
                {p.highlight && !isCurrent && <Badge className="bg-champagne text-onix">Mais completo</Badge>}
              </div>
              <h2 className={cn('mt-4 text-[28px]', p.highlight && 'text-marfim')}>{p.name}</h2>
              <p className={cn('mt-1 text-sm', p.highlight ? 'text-marfim/70' : 'text-muted')}>{p.description}</p>
              <p className="mt-6 font-serif text-[46px] font-semibold leading-none">{p.price}</p>
              <p className={cn('mt-1 text-[13px]', p.highlight ? 'text-champagne' : 'text-muted')}>{p.priceNote}</p>
              <ul className="mt-6 flex-1 space-y-2.5">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2.5 text-[14px]"><Check className={cn('mt-0.5 h-4 w-4 shrink-0', p.highlight ? 'text-champagne' : 'text-rubi')} aria-hidden="true" /> {f}</li>
                ))}
              </ul>
              <div className="mt-8">
                {p.comingSoon ? (
                  <Button variant="outline" className="w-full" onClick={() => toast('Você entrou na lista de interesse do Clube (demonstração)', 'success')}>
                    <Lock className="h-4 w-4" aria-hidden="true" /> Quero ser avisada
                  </Button>
                ) : isCurrent ? (
                  <Button variant={p.highlight ? 'gold' : 'secondary'} className="w-full" disabled>Plano ativo</Button>
                ) : p.id === 'free' ? (
                  <Button variant="outline" className="w-full" onClick={() => { setPlan('free'); toast('Plano Gratuito ativado na demonstração') }}>Alternar para o Gratuito</Button>
                ) : (
                  <Button to={`/app/checkout/${p.id}`} variant={p.highlight ? 'gold' : 'primary'} className="w-full"><Sparkles className="h-4 w-4" aria-hidden="true" /> Quero o {p.name.replace('Voz de Potência ', '')}</Button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
