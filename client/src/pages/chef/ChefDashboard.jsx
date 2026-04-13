import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getChefOrders } from '../../services/orderService'
import { getAllPosts } from '../../services/postService'
import PostsSection from './sections/PostsSection'
import OrdersSection from './sections/OrdersSection'
import styles from './ChefDashboard.module.css'

function ChefDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('posts')
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalOrders: 0,
    pendingOrders: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [postsRes, ordersRes] = await Promise.all([
          getAllPosts(),
          getChefOrders()
        ])
        const pending = ordersRes.data.orders.filter(
          o => o.status === 'PENDING'
        ).length

        setStats({
          totalPosts: postsRes.data.count,
          totalOrders: ordersRes.data.count,
          pendingOrders: pending
        })
      } catch {
        console.error('Failed to fetch stats')
      }
    }
    fetchStats()
  }, [])

  const tabs = [
    { id: 'posts', label: '🍽️ My Menu' },
    { id: 'orders', label: '📦 Orders' },
  ]

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          Welcome, Chef {user?.name} 👨‍🍳
        </h1>
        <p className={styles.subtitle}>
          Manage your menu and incoming orders
        </p>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.totalPosts}</span>
          <span className={styles.statLabel}>Total dishes</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.totalOrders}</span>
          <span className={styles.statLabel}>Total orders</span>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{stats.pendingOrders}</span>
          <span className={styles.statLabel}>Pending orders</span>
        </div>
      </div>

      <div className={styles.tabs}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'posts' && <PostsSection />}
      {activeTab === 'orders' && <OrdersSection />}
    </div>
  )
}

export default ChefDashboard