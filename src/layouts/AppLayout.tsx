import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import * as Dialog from '@radix-ui/react-dialog'
import { Bell, Menu, X, ShieldCheck } from 'lucide-react'
import { Logo, Monogram } from '@/components/ui/Logo'
import { DemoTag } from '@/components/ui/primitives'
import { useAppStore } from '@/store/useAppStore'
import { useContentStore } from '@/store/useContentStore'
import { plans } from '@/mocks/plans'
import { relativeTime } from '@/utils/date'
import { cn } from '@/utils/cn'
import { bottomNav, methodNav, sidebarNav, type NavItem } from './navigation'

function SideLink({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  const Icon = item.icon
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition-colors',
          isActive ? 'bg-rubi text-white shadow-soft' : 'text-onix/80 hover:bg-bege/70 hover:text-onix',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon className={cn('h-[18px] w-[18px] shrink-0', isActive ? 'text-champagne' : 'text-muted group-hover:text-rubi')} aria-hidden="true" />
          <span className="flex-1 truncate">{item.label}</span>
          {item.badge && <span className={cn('rounded-full px-1.5 py-px text-[9.5px] font-semibold uppercase tracking-wider', isActive ? 'bg-white/15 text-champagne' : 'bg-champagne-soft text-champagne-ink')}>{item.badge}</span>}
        </>
      )}
    </NavLink>
  )
}

function UserFooter({ onNavigate }: { onNavigate?: () => void }) {
  const profile = useAppStore((s) => s.profile)
  const planName = plans.find((p) => p.id === profile.plan)?.name ?? ''
  return (
    <Link to="/app/configuracoes" onClick={onNavigate} className="flex items-center gap-3 rounded-xl border border-line bg-white p-2.5 transition-colors hover:border-champagne">
      <img src={profile.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13.5px] font-semibold">{profile.name}</p>
        <p className="truncate text-[11.5px] text-champagne-ink">{planName}</p>
      </div>
    </Link>
  )
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <div className="px-5 pb-5 pt-6">
        <Link to="/app" onClick={onNavigate} aria-label="Voz de Potência — início">
          <Logo compact />
        </Link>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4 scrollbar-none" aria-label="Navegação principal">
        {sidebarNav.slice(0, 3).map((item) => (
          <SideLink key={item.to} item={item} onNavigate={onNavigate} />
        ))}
        <SideLink item={methodNav} onNavigate={onNavigate} />
        <p className="px-3 pb-1.5 pt-4 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-muted">Praticar</p>
        {sidebarNav.slice(3, 9).map((item) => (
          <SideLink key={item.to} item={item} onNavigate={onNavigate} />
        ))}
        <p className="px-3 pb-1.5 pt-4 text-[10.5px] font-semibold uppercase tracking-[0.16em] text-muted">Acompanhar</p>
        {sidebarNav.slice(9).map((item) => (
          <SideLink key={item.to} item={item} onNavigate={onNavigate} />
        ))}
      </nav>
      <div className="space-y-2 border-t border-line p-3">
        <UserFooter onNavigate={onNavigate} />
        <div className="flex items-center justify-between px-1.5">
          <DemoTag label="Demonstração" />
          <Link to="/admin" onClick={onNavigate} className="inline-flex items-center gap-1 text-[11px] font-medium text-muted hover:text-rubi">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> Admin
          </Link>
        </div>
      </div>
    </div>
  )
}

export function NotificationsButton() {
  const [open, setOpen] = useState(false)
  const notifications = useContentStore((s) => s.notifications)
  const read = useAppStore((s) => s.readNotifications)
  const markRead = useAppStore((s) => s.markNotificationRead)
  const markAll = useAppStore((s) => s.markAllNotificationsRead)
  const navigate = useNavigate()
  const unread = notifications.filter((n) => !n.read && !read.includes(n.id))
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-onix hover:border-champagne"
        aria-label={`Notificações${unread.length ? ` (${unread.length} não lidas)` : ''}`}
        aria-expanded={open}
      >
        <Bell className="h-[18px] w-[18px]" aria-hidden="true" />
        {unread.length > 0 && <span className="absolute -right-0.5 -top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-rubi px-1 text-[10px] font-bold text-white">{unread.length}</span>}
      </button>
      {open && (
        <>
          <button className="fixed inset-0 z-40 cursor-default" aria-label="Fechar notificações" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-12 z-50 w-[min(92vw,360px)] rounded-2xl border border-line bg-white p-2 shadow-lift">
            <div className="flex items-center justify-between px-3 py-2">
              <p className="font-serif text-xl font-semibold">Notificações</p>
              {unread.length > 0 && (
                <button className="text-[12px] font-semibold text-rubi hover:underline" onClick={() => markAll(notifications.map((n) => n.id))}>
                  Marcar todas como lidas
                </button>
              )}
            </div>
            <ul className="max-h-80 overflow-y-auto">
              {notifications.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted">Nenhuma notificação.</li>}
              {notifications.map((n) => {
                const isUnread = !n.read && !read.includes(n.id)
                return (
                  <li key={n.id}>
                    <button
                      className="flex w-full gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-marfim"
                      onClick={() => {
                        markRead(n.id)
                        setOpen(false)
                        if (n.link) navigate(n.link)
                      }}
                    >
                      <span className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', isUnread ? 'bg-rubi' : 'bg-transparent')} />
                      <span className="min-w-0">
                        <span className="block text-[13.5px] font-semibold">{n.title}</span>
                        <span className="block text-[12.5px] text-muted">{n.text}</span>
                        <span className="mt-0.5 block text-[11px] text-muted/80">{relativeTime(n.date)}</span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}

function useApplySettings() {
  const settings = useAppStore((s) => s.settings)
  useEffect(() => {
    const el = document.documentElement
    el.classList.toggle('vp-large-text', settings.largeText)
    el.classList.toggle('vp-high-contrast', settings.highContrast)
    el.classList.toggle('vp-reduce-motion', settings.reduceMotion)
  }, [settings])
}

export function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const onboardingDone = useAppStore((s) => s.onboarding.completed)
  const navigate = useNavigate()
  useApplySettings()

  useEffect(() => {
    if (!onboardingDone) navigate('/onboarding', { replace: true })
  }, [onboardingDone, navigate])

  const hideBottomNav = useMemo(() => /\/app\/(aurora)/.test(location.pathname), [location.pathname])

  return (
    <div className="min-h-dvh bg-marfim">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[90] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:shadow-lift">
        Pular para o conteúdo
      </a>
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[272px] border-r border-line bg-marfim lg:block">
        <SidebarContent />
      </aside>

      {/* Header mobile/tablet */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line/70 bg-marfim/90 px-4 backdrop-blur-md lg:hidden">
        <Link to="/app" className="flex items-center gap-2.5" aria-label="Voz de Potência — início">
          <Monogram size={34} />
          <span className="font-serif text-xl font-semibold">Voz de Potência</span>
        </Link>
        <div className="flex items-center gap-2">
          <NotificationsButton />
          <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
            <Dialog.Trigger className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white" aria-label="Abrir menu">
              <Menu className="h-[18px] w-[18px]" aria-hidden="true" />
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-onix/40" />
              <Dialog.Content className="fixed inset-y-0 right-0 z-50 w-[min(86vw,320px)] bg-marfim shadow-lift outline-none data-[state=open]:animate-[fadeIn_.2s_ease]">
                <Dialog.Title className="sr-only">Menu</Dialog.Title>
                <Dialog.Description className="sr-only">Todas as áreas da plataforma</Dialog.Description>
                <Dialog.Close className="absolute right-3 top-5 z-10 rounded-full p-2 text-muted hover:bg-bege" aria-label="Fechar menu">
                  <X className="h-5 w-5" aria-hidden="true" />
                </Dialog.Close>
                <SidebarContent onNavigate={() => setMenuOpen(false)} />
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </header>

      <main id="conteudo" tabIndex={-1} className={cn('lg:pl-[272px]', !hideBottomNav && 'pb-24 lg:pb-0')}>
        <div className="mx-auto w-full max-w-[1240px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
          <Outlet />
        </div>
      </main>

      {/* Bottom nav mobile */}
      {!hideBottomNav && (
        <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden" aria-label="Navegação inferior">
          <ul className="mx-auto grid max-w-lg grid-cols-5">
            {bottomNav.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) => cn('flex h-16 flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors', isActive ? 'text-rubi' : 'text-muted hover:text-onix')}
                  >
                    {({ isActive }) => (
                      <>
                        <span className={cn('flex h-7 w-12 items-center justify-center rounded-full transition-colors', isActive && 'bg-rubi-soft')}>
                          <Icon className="h-[19px] w-[19px]" aria-hidden="true" />
                        </span>
                        {item.label}
                      </>
                    )}
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>
      )}
    </div>
  )
}
