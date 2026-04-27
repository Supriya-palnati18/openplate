import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getMyProfile } from '../../services/chefService'
import { IconToolsKitchen2 } from '@tabler/icons-react'
import PostsSection from './sections/PostsSection'
import styles from './ChefDashboard.module.css'

function ChefDashboard() {
  const { user } = useAuth()
  const [totalDishes, setTotalDishes] = useState(0)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await getMyProfile()
        setTotalDishes(data.profile.posts?.length || 0)
      } catch {
        // non-critical
      }
    }
    fetchStats()
  }, [])

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          Welcome, <span className={styles.nameGradient}>{user?.name}</span>
        </h1>
        <p className={styles.subtitle}>Add and manage your dishes below</p>
      </div>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <IconToolsKitchen2 size={22} stroke={1.5} />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statValue}>{totalDishes}</span>
            <span className={styles.statLabel}>Total dishes</span>
          </div>
        </div>
      </div>

      <PostsSection />
    </div>
  )
}

export default ChefDashboard