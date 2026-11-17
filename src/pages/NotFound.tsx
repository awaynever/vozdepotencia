import { Monogram } from '@/components/ui/Logo'
import { Button } from '@/components/ui/primitives'

export default function NotFound({ inApp }: { inApp?: boolean }) {
  return (
    <div className={inApp ? 'py-20 text-center' : 'flex min-h-dvh flex-col items-center justify-center bg-marfim px-6 text-center'}>
      <Monogram size={56} className="mx-auto" />
      <h1 className="mt-6 text-[40px]">Página não encontrada</h1>
      <p className="mt-2 text-muted">O endereço acessado não existe ou foi movido.</p>
      <div className="mt-6 flex justify-center gap-3">
        <Button to={inApp ? '/app' : '/'}>Voltar ao início</Button>
      </div>
    </div>
  )
}
