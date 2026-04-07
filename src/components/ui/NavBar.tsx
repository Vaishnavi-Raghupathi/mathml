import { NavLink } from 'react-router-dom'

const links = [
  { to: '/module/1', label: '01 Vectors' },
  { to: '/module/2', label: '02 Dot Product' },
  { to: '/module/3', label: '03 Matrix' }
]

const NavBar = () => {
  return (
    <nav className="flex h-14 w-full items-center justify-between bg-background px-6">
      <div className="text-xl font-bold text-accent-purple">MathML</div>
      <div className="flex items-center gap-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              [
                'rounded-full px-4 py-1.5 text-sm transition-colors',
                isActive
                  ? 'bg-accent-purple text-white'
                  : 'text-text-secondary hover:text-text-primary'
              ].join(' ')
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default NavBar