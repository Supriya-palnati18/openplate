import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import Button from '../ui/Button'
import api from '../../services/api'
import styles from './Navbar.module.css'

function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout')
      logout()
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          <img
            src={theme === 'light' ? '/logo-light.png' : '/logo-dark.png'}
            alt="OpenPlate"
            className={styles.logoImg}
          />
        </Link>

        <div className={styles.nav}>
          <button
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {user ? (
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user.name}</span>
              <span className={styles.roleBadge}>{user.role}</span>
              <Button
                variant="secondary"
                size="small"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className={styles.nav}>
              <Button
                variant="ghost"
                size="small"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button
                variant="primary"
                size="small"
                onClick={() => navigate('/register')}
              >
                Register
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar