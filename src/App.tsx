import { Fragment, lazy, Suspense, useEffect, type ReactNode } from 'react'
import { BrowserRouter, HashRouter, MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { AppLayout } from '@/layouts/AppLayout'
import { CelebrationLayer, Toaster } from '@/components/feedback/FeedbackLayer'
import { Monogram } from '@/components/ui/Logo'
import { useAppStore } from '@/store/useAppStore'

const Landing = lazy(() => import('@/pages/Landing'))
const Onboarding = lazy(() => import('@/pages/Onboarding'))
const NotFound = lazy(() => import('@/pages/NotFound'))
const Home = lazy(() => import('@/pages/app/Home'))
const Journey = lazy(() => import('@/pages/app/Journey'))
const JourneyDayPage = lazy(() => import('@/pages/app/JourneyDay'))
const Method = lazy(() => import('@/pages/app/Method'))
const PowerMap = lazy(() => import('@/pages/app/PowerMap'))
const Academy = lazy(() => import('@/pages/app/Academy'))
const VoicePractice = lazy(() => import('@/pages/app/VoicePractice'))
const Lab = lazy(() => import('@/pages/app/Lab'))
const SimulationPage = lazy(() => import('@/pages/app/SimulationPage'))
const Responses = lazy(() => import('@/pages/app/Responses'))
const Rituals = lazy(() => import('@/pages/app/Rituals'))
const RitualPlayer = lazy(() => import('@/pages/app/RitualPlayer'))
const Journal = lazy(() => import('@/pages/app/Journal'))
const Library = lazy(() => import('@/pages/app/Library'))
const LibraryReader = lazy(() => import('@/pages/app/LibraryReader'))
const Aurora = lazy(() => import('@/pages/app/Aurora'))
const Evolution = lazy(() => import('@/pages/app/Evolution'))
const Community = lazy(() => import('@/pages/app/Community'))
const Plans = lazy(() => import('@/pages/app/Plans'))
const Checkout = lazy(() => import('@/pages/app/Checkout'))
const Settings = lazy(() => import('@/pages/app/Settings'))
const Practice = lazy(() => import('@/pages/app/Practice'))
const Admin = lazy(() => import('@/pages/admin/Admin'))

// Roteamento: padrão BrowserRouter; VITE_ROUTER=hash para hospedagem estática sem fallback de SPA;
// VITE_ROUTER=memory para ambientes embutidos (iframe/sandbox) que não sincronizam a URL.
const Router = import.meta.env.VITE_ROUTER === 'hash' ? HashRouter : import.meta.env.VITE_ROUTER === 'memory' ? MemoryRouter : BrowserRouter

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [pathname])
  return null
}

// Remonta a página quando o parâmetro da rota muda (ex.: Dia 8 → Dia 9)
function KeyByPath({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  return <Fragment key={pathname}>{children}</Fragment>
}

// Âncoras internas (#secao) rolam até o elemento, compatível com BrowserRouter e HashRouter
function InPageAnchors() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]')
      if (!a) return
      const id = a.getAttribute('href')!.slice(1)
      const el = id ? document.getElementById(id) : null
      if (!el) return
      e.preventDefault()
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      if (id === 'conteudo') el.focus({ preventScroll: true })
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])
  return null
}

function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-label="Carregando">
      <Monogram size={44} className="animate-pulse" />
    </div>
  )
}

export default function App() {
  const reduceMotion = useAppStore((s) => s.settings.reduceMotion)
  return (
    <MotionConfig reducedMotion={reduceMotion ? 'always' : 'user'}>
      <Router>
        <ScrollToTop />
        <InPageAnchors />
        <Suspense fallback={<Loading />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/:section" element={<Admin />} />
            <Route path="/app" element={<AppLayout />}>
              <Route index element={<Home />} />
              <Route path="jornada" element={<Journey />} />
              <Route path="jornada/:day" element={<KeyByPath><JourneyDayPage /></KeyByPath>} />
              <Route path="metodo" element={<Method />} />
              <Route path="mapa" element={<PowerMap />} />
              <Route path="academia" element={<Academy />} />
              <Route path="academia/:exerciseId" element={<KeyByPath><VoicePractice /></KeyByPath>} />
              <Route path="laboratorio" element={<Lab />} />
              <Route path="laboratorio/:id" element={<KeyByPath><SimulationPage /></KeyByPath>} />
              <Route path="respostas" element={<Responses />} />
              <Route path="rituais" element={<Rituals />} />
              <Route path="rituais/:id" element={<KeyByPath><RitualPlayer /></KeyByPath>} />
              <Route path="diario" element={<Journal />} />
              <Route path="biblioteca" element={<Library />} />
              <Route path="biblioteca/:id" element={<KeyByPath><LibraryReader /></KeyByPath>} />
              <Route path="aurora" element={<Aurora />} />
              <Route path="evolucao" element={<Evolution />} />
              <Route path="comunidade" element={<Community />} />
              <Route path="planos" element={<Plans />} />
              <Route path="checkout/:planId" element={<Checkout />} />
              <Route path="configuracoes" element={<Settings />} />
              <Route path="praticar" element={<Practice />} />
              <Route path="*" element={<NotFound inApp />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Toaster />
        <CelebrationLayer />
      </Router>
    </MotionConfig>
  )
}
