import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, CreditCard, Loader2, QrCode, ShieldCheck } from 'lucide-react'
import { Button, Card, DemoNotice, Field } from '@/components/ui/primitives'
import { useAppStore } from '@/store/useAppStore'
import { useContentStore } from '@/store/useContentStore'
import { cn } from '@/utils/cn'
import NotFound from '../NotFound'

const schema = z.object({
  name: z.string().trim().min(3, 'Informe seu nome completo'),
  email: z.string().trim().email('Informe um e-mail válido'),
  accept: z.literal(true, { message: 'Confirme que entende que esta é uma simulação' }),
})
type Values = z.infer<typeof schema>

export default function Checkout() {
  const { planId } = useParams()
  const plan = useContentStore((s) => s.plans.find((p) => p.id === planId))
  const profile = useAppStore((s) => s.profile)
  const setPlan = useAppStore((s) => s.setPlan)
  const navigate = useNavigate()
  const [method, setMethod] = useState<'pix' | 'cartao'>('pix')
  const [status, setStatus] = useState<'form' | 'processing' | 'done'>('form')
  const { register, handleSubmit, formState: { errors } } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { name: profile.name, email: profile.email } })

  if (!plan || plan.id === 'free' || plan.comingSoon) return <NotFound inApp />

  const submit = () => {
    setStatus('processing')
    setTimeout(() => {
      setPlan(plan.id)
      setStatus('done')
    }, 1600)
  }

  if (status === 'done') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto max-w-lg py-12 text-center">
        <CheckCircle2 className="mx-auto h-14 w-14 text-sucesso" aria-hidden="true" />
        <h1 className="mt-5 text-[38px]">Acesso liberado!</h1>
        <p className="mt-2 text-muted">O plano <strong>{plan.name}</strong> foi ativado nesta demonstração. Nenhuma cobrança foi realizada.</p>
        <div className="mt-7 flex justify-center gap-3">
          <Button onClick={() => navigate('/app')}>Ir para o início</Button>
          <Button variant="outline" to="/app/jornada">Ver minha jornada</Button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link to="/app/planos" className="mb-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-muted hover:text-rubi"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> Planos</Link>
      <h1 className="text-[36px] sm:text-[44px]">Checkout simulado</h1>
      <DemoNotice className="mt-4">Esta tela demonstra o fluxo de compra. Nenhum dado bancário é solicitado e nenhum pagamento é processado.</DemoNotice>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <form onSubmit={handleSubmit(submit)} noValidate>
          <Card className="space-y-5 p-6">
            <Field label="Nome completo" htmlFor="co-name" error={errors.name?.message}>
              <input id="co-name" className="input" autoComplete="name" {...register('name')} />
            </Field>
            <Field label="E-mail" htmlFor="co-email" error={errors.email?.message}>
              <input id="co-email" type="email" className="input" autoComplete="email" {...register('email')} />
            </Field>
            <fieldset>
              <legend className="mb-2 text-[13px] font-semibold">Forma de pagamento (simulada)</legend>
              <div className="grid grid-cols-2 gap-3">
                {([['pix', 'Pix', QrCode], ['cartao', 'Cartão', CreditCard]] as const).map(([id, label, I]) => (
                  <button key={id} type="button" onClick={() => setMethod(id)} aria-pressed={method === id} className={cn('flex items-center gap-2.5 rounded-xl border p-4 text-[14px] font-semibold', method === id ? 'border-rubi bg-rubi-soft text-rubi' : 'border-line bg-white')}>
                    <I className="h-5 w-5" aria-hidden="true" /> {label}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[12.5px] text-muted">
                {method === 'pix' ? 'Em produção, um QR Code seria gerado pelo provedor de pagamento.' : 'Em produção, os dados do cartão seriam coletados diretamente pelo provedor de pagamento, fora desta plataforma.'}
              </p>
            </fieldset>
            <div>
              <label className="flex items-start gap-2.5 text-[13.5px]">
                <input type="checkbox" className="mt-0.5 h-4 w-4 accent-[#650F1D]" {...register('accept')} />
                Entendo que esta é uma simulação e que nenhuma cobrança será realizada.
              </label>
              {errors.accept && <p className="mt-1 text-[12px] font-medium text-rubi" role="alert">{errors.accept.message}</p>}
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={status === 'processing'}>
              {status === 'processing' ? (<><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Processando simulação…</>) : 'Confirmar (simulação)'}
            </Button>
          </Card>
        </form>
        <Card className="h-fit p-6">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-champagne-ink">Resumo</p>
          <p className="mt-2 font-serif text-[26px] font-semibold">{plan.name}</p>
          <p className="text-[13px] text-muted">{plan.description}</p>
          <div className="mt-5 flex items-baseline justify-between border-t border-line pt-4">
            <span className="text-[14px]">Total</span>
            <span className="font-serif text-[32px] font-semibold">{plan.price}</span>
          </div>
          <p className="text-right text-[12px] text-muted">{plan.priceNote}</p>
          <p className="mt-5 flex items-center gap-2 text-[12.5px] text-muted"><ShieldCheck className="h-4 w-4 text-sucesso" aria-hidden="true" /> Ambiente demonstrativo, sem coleta de dados financeiros.</p>
        </Card>
      </div>
    </div>
  )
}
