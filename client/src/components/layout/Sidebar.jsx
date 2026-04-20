import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './Sidebar.module.css'

function Sidebar() {
  const { user } = useAuth()

  const customerLinks = [
    { to: '/feed', icon: '🍽️', label: 'Feed' },
    { to: '/my-orders', icon: '📦', label: 'My Orders' },
  ]

  const chefLinks = [
    { to: '/chef/dashboard', icon: '👨‍🍳', label: 'My Menu' },
    { to: '/chef/orders', icon: '📦', label: 'Orders' },
  ]

  const links = user?.role === 'CHEF' ? chefLinks : customerLinks

  return (
    <aside className={styles.sidebar}>
      {links.map(link => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
          }
        >
          <span className={styles.navIcon}>{link.icon}</span>
          <span className={styles.navLabel}>{link.label}</span>
        </NavLink>
      ))}
    </aside>
  )
}

export default Sidebar