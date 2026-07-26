import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { FlameMark } from '../components/brand/FlameMark'
import { cn } from '../lib/utils'
import { User } from 'lucide-react'

const nav = [
  { to: '/assistant', label: 'Визуальный ассистент' },
  { to: '/scheme', label: 'Схема цифровых двойников' },
  { to: '/orchestrator', label: 'Оркестратор' },
]

function levelLabel(pathname: string) {
  if (pathname.startsWith('/assistant/video')) return 'Уровень 3: Видеоаналитика'
  if (pathname.startsWith('/assistant/production')) return 'Уровень 2: Добыча'
  if (pathname.startsWith('/assistant')) return 'Уровень 1'
  if (pathname.startsWith('/scheme')) return 'Интерактивная схема промысла'
  if (pathname.startsWith('/orchestrator')) return 'Оркестратор сценариев'
  return 'СППР'
}

export function AppShell() {
  const { pathname } = useLocation()
  const isScheme = pathname.startsWith('/scheme')

  return (
    <div className="min-h-screen bg-spatial bg-flame-motif text-white">
      <div className="sticky top-0 z-40 border-b border-white/10 bg-[#021526]/75 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-[1600px] items-center gap-6 px-4 md:px-6">
          <NavLink to="/" className="flex items-center gap-3 shrink-0">
            <FlameMark className="h-9 w-9" />
            <div className="leading-none">
              <div className="font-display text-2xl font-bold tracking-wide text-white">
                СППР
              </div>
              <div className="mt-0.5 text-[10px] uppercase tracking-[0.14em] text-gpn-sky">
                Газпром нефть
              </div>
            </div>
          </NavLink>

          <nav className="hidden md:flex items-center gap-1 flex-1">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'relative rounded-lg px-3 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-white/65 hover:bg-white/5 hover:text-white',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    {isActive && (
                      <span className="absolute inset-x-3 -bottom-[9px] h-0.5 rounded-full bg-energy" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3 text-sm text-white/80">
            <div className="hidden sm:block text-right leading-tight">
              <div className="font-medium text-white">Иван Иванов</div>
              <div className="text-xs text-white/50">Пользователь</div>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gpn-blue/40 ring-1 ring-gpn-sky/40">
              <User className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-4 pb-2 md:px-6">
          <div className="text-xs text-gpn-sky/90 font-medium tracking-wide">
            {levelLabel(pathname)}
          </div>
          <div className="md:hidden flex gap-2 overflow-x-auto">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'whitespace-nowrap rounded-full px-3 py-1 text-xs',
                    isActive ? 'bg-energy text-white' : 'bg-white/10 text-white/70',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>

      <main
        className={cn(
          'mx-auto max-w-[1600px]',
          isScheme ? 'px-0 py-0' : 'px-4 py-5 md:px-6 md:py-6',
        )}
      >
        <Outlet />
      </main>

      {!isScheme && (
        <footer className="mx-auto flex max-w-[1600px] items-center justify-between px-4 py-4 text-xs text-white/40 md:px-6">
          <span>© СППР, 2026. Все права защищены</span>
          <span className="font-display tracking-wider text-white/50">ГАЗПРОМ НЕФТЬ</span>
        </footer>
      )}
    </div>
  )
}
