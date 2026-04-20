import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import styles from './AppLayout.module.css'

function AppLayout({ children }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.body}>
        <div className={styles.sidebar}>
          <Sidebar />
        </div>
        <main className={styles.main}>
          {children}
        </main>
      </div>
      <BottomNav />
    </div>
  )
}

export default AppLayout