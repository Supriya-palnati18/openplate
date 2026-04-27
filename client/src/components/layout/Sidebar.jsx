import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  IconLayoutGrid,
  IconShoppingBag,
  IconChefHat,
  IconClipboardList,
} from '@tabler/icons-react'
import styles from './Sidebar.module.css'

const customerLinks = [
  { to: '/feed',      icon: IconLayoutGrid,   label: 'Feed' },
  { to: '/my-orders', icon: IconShoppingBag,  label: 'My Orders' },
]

const chefLinks = [
  { to: '/chef/dashboard', icon: IconChefHat,       label: 'My Menu' },
  { to: '/chef/orders',    icon: IconClipboardList,  label: 'Orders' },
]

function Sidebar() {
  const { user } = useAuth()
  const links = user?.role === 'CHEF' ? chefLinks : customerLinks

  return (
    <aside className={styles.sidebar}>
      {links.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
          }
        >
          <Icon size={20} stroke={1.5} className={styles.navIcon} />
          <span className={styles.navLabel}>{label}</span>
        </NavLink>
      ))}
    </aside>
  )
}

export default Sidebar