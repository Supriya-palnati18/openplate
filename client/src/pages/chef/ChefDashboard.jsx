import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getChefOrders } from '../../services/orderService'
import { getMyProfile } from '../../services/chefService'
import {
  IconChefHat,
  IconClipboardList,
  IconToolsKitchen2,
  IconShoppingBag,
  IconClock
} from '@tabler/icons-react'
import PostsSection from './sections/PostsSection'
import OrdersSection from './sections/OrdersSection'
import styles from './ChefDashboard.module.css'

function ChefDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('posts')
  const [stats, setStats] = useState({ totalPosts: 0, totalOrders: 0, pendingOrders: 0 })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [profileRes, ordersRes] = await Promise.all([
          getMyProfile(),
          getChefOrders()
        ])
        setStats({
          totalPosts: profileRes.data.profile.posts?.length || 0,
          totalOrders: ordersRes.data.count,
          pendingOrders: ordersRes.data.orders.filter(o => o.status === 'PENDING').length
        })
      } catch {
        // stats are non-critical
      }
    }
    fetchStats()
  }, [])

  const statCards = [
    { value: stats.totalPosts,   label: 'Total dishes',   Icon: IconToolsKitchen2 },
    { value: stats.totalOrders,  label: 'Total orders',   Icon: IconShoppingBag },
    { value: stats.pendingOrders, label: 'Pending orders', Icon: IconClock },
  ]

  const tabs = [
    { id: 'posts',  label: 'My Menu', Icon: IconChefHat },
    { id: 'orders', label: 'Orders',  Icon: IconClipboardList },
  ]

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          Welcome, <span className={styles.nameGradient}>{user?.name}</span>
        </h1>
        <p className={styles.subtitle}>Manage your menu and incoming orders</p>
      </div>

      <div className={styles.stats}>
        {statCards.map(({ value, label, Icon }) => (
          <div key={label} className={styles.statCard}>
            <div className={styles.statIcon}>
              <Icon size={22} stroke={1.5} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{value}</span>
              <span className={styles.statLabel}>{label}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.tabs}>
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={`${styles.tab} ${activeTab === id ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(id)}
          >
            <Icon size={18} stroke={1.5} />
            {label}
          </button>
        ))}
      </div>

      {activeTab === 'posts'  && <PostsSection />}
      {activeTab === 'orders' && <OrdersSection />}
    </div>
  )
}

export default ChefDashboard