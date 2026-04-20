import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'
import { logout as logoutApi } from '../../services/authService'
import styles from './Navbar.module.css'

function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    try {
      await logoutApi()
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

        <div className={styles.right}>
          <button
            className={styles.themeToggle}
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          {user ? (
            <div className={styles.profileWrapper} ref={dropdownRef}>
              <button
                className={styles.profileBtn}
                onClick={() => setDropdownOpen(prev => !prev)}
              >
                <div className={styles.avatar}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className={styles.profileName}>{user.name}</span>
                <span className={styles.arrow}>
                  {dropdownOpen ? '▲' : '▼'}
                </span>
              </button>

              {dropdownOpen && (
                <div className={styles.dropdown}>
                  <div className={styles.dropdownHeader}>
                    <span className={styles.dropdownName}>{user.name}</span>
                    <span className={styles.dropdownRole}>{user.role}</span>
                  </div>
                  <div className={styles.dropdownDivider} />
                  <button
                    className={styles.dropdownItem}
                    onClick={() => {
                      setDropdownOpen(false)
                      navigate('/profile')
                    }}
                  >
                    👤 Profile
                  </button>
                  <button
                    className={styles.dropdownItem}
                    onClick={() => {
                      setDropdownOpen(false)
                      navigate('/settings')
                    }}
                  >
                    ⚙️ Settings
                  </button>
                  <div className={styles.dropdownDivider} />
                  <button
                    className={`${styles.dropdownItem} ${styles.dropdownLogout}`}
                    onClick={handleLogout}
                  >
                    🚪 Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.authButtons}>
              <button
                className={styles.loginBtn}
                onClick={() => navigate('/login')}
              >
                Login
              </button>
              <button
                className={styles.registerBtn}
                onClick={() => navigate('/register')}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar