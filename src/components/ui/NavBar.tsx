import { NavLink } from 'react-router-dom'

const navItems = [
  { to: '/module/1', label: '01 Vectors' },
  { to: '/module/1/2', label: '01.2 Norms' },
  { to: '/module/2', label: '02 Dot Product' },
  { to: '/module/3', label: '03 Matrices' }
]

const monoFont = '"IBM Plex Sans", system-ui, -apple-system, sans-serif'

const NavBar = () => {
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[52px] border-b" style={{ borderColor: '#1a2740', background: '#020815' }}>
      <div className="mx-auto flex h-full w-full max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-8">
        <span className="text-[14px]" style={{ fontFamily: monoFont, color: '#6e7f9b' }}>
          MathML
        </span>

        <nav aria-label="Primary" className="flex min-w-0 items-center gap-4 overflow-x-auto whitespace-nowrap sm:gap-8">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'text-[13px] no-underline transition-colors duration-150',
                  isActive ? 'text-[#c7d2e8]' : 'text-[#5e6f8e] hover:text-[#9db0cf]'
                ].join(' ')
              }
              style={{ fontFamily: monoFont }}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default NavBar
