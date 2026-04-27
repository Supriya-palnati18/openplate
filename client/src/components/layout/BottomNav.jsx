import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  IconLayoutGrid,
  IconShoppingBag,
  IconChefHat,
  IconClipboardList
} from '@tabler/icons-react'
import styles from './BottomNav.module.css'

function BottomNav() {
  const { user } = useAuth()

  const customerLinks = [
    { to: '/feed',      Icon: IconLayoutGrid,   label: 'Feed' },
    { to: '/my-orders', Icon: IconShoppingBag,  label: 'Orders' },
  ]

  const chefLinks = [
    { to: '/chef/dashboard', Icon: IconChefHat,       label: 'My Menu' },
    { to: '/chef/orders',    Icon: IconClipboardList,  label: 'Orders' },
  ]

  const links = user?.role === 'CHEF' ? chefLinks : customerLinks

  return (
    <nav className={styles.bottomNav}>
      {links.map(({ to, Icon, label }) => (
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