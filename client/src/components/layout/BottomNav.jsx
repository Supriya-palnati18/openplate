import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  IconLayoutGrid,
  IconShoppingBag,
  IconChefHat,
  IconClipboardList,
} from '@tabler/icons-react'
import styles from './BottomNav.module.css'

const customerLinks = [
  { to: '/feed',      icon: IconLayoutGrid,  label: 'Feed' },
  { to: '/my-orders', icon: IconShoppingBag, label: 'Orders' },
]

const chefLinks = [
  { to: '/chef/dashboard', icon: IconChefHat,      label: 'Menu' },
  { to: '/chef/orders',    icon: IconClipboardList, label: 'Orders' },
]

function BottomNav() {
  const { user } = useAuth()
  const links = user?.role === 'CHEF' ? chefLinks : customerLinks

  return (
    <nav className={styles.bottomNav}>
      {links.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
          }
        >
          <Icon size={22} stroke={1.5} className={styles.navIcon} />
          <span className={styles.navLabel}>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default BottomNav