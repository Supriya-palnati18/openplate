import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { login as loginApi } from '../../services/authService'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import styles from './LoginPage.module.css'

function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const { theme } = useTheme()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    try {
      const { data } = await loginApi(formData)
      login(data.user)

      if (data.user.role === 'CHEF') {
        navigate('/chef/dashboard')
      } else if (data.user.role === 'ADMIN') {
        navigate('/admin')
      } else {
        navigate('/feed')
      }

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.logoWrapper}>
          <img
            src={theme === 'light' ? '/logo-light.png' : '/logo-dark.png'}
            alt="OpenPlate"
            className={styles.logoImg}
          />
        </div>

        <h1 className={styles.title}>Welcome back</h1>
        <p className={styles.subtitle}>Sign in to your OpenPlate account</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <div className={styles.errorBox}>{error}</div>}

          <Input
            label="Email address"
            type="email"
            name="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
          />

          <Input
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <div className={styles.footer}>
          Don't have an account?{' '}
          <button
            className={styles.link}
            onClick={() => navigate('/register')}
          >
            Create one
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginPage