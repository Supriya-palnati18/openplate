import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  IconLayoutGrid,
  IconShoppingBag,
  IconChefHat,
  IconClipboardList
} from '@tabler/icons-react'
import styles from './Sidebar.module.css'

function Sidebar() {
  const { user } = useAuth()

  const customerLinks = [
    { to: '/feed',      Icon: IconLayoutGrid,   label: 'Feed' },
    { to: '/my-orders', Icon: IconShoppingBag,  label: 'My Orders' },
  ]

  const chefLinks = [
    { to: '/chef/dashboard', Icon: IconChefHat,       label: 'My Menu' },
    { to: '/chef/orders',    Icon: IconClipboardList,  label: 'Orders' },
  ]

  const links = user?.role === 'CHEF' ? chefLinks : customerLinks

  return (
    <aside className={styles.sidebar}>
      {links.map(({ to, Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
          }
        >
          <Icon size={20} stroke={1.5} />
          <span className={styles.navLabel}>{label}</span>
        </NavLink>
      ))}
    </aside>
  )
}

export default Sidebar