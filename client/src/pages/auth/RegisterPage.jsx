import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { register as registerApi, login as loginApi } from '../../services/authService'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import styles from './RegisterPage.module.css'

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CUSTOMER'
  })
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

  const handleRoleSelect = (role) => {
    setFormData(prev => ({ ...prev, role }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all fields')
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      await registerApi(formData)
      const { data } = await loginApi({ 
        email: formData.email, 
        password: formData.password 
      })
      login(data.user)
      navigate(data.user.role === 'CHEF' ? '/chef/dashboard' : '/feed')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.')
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

        <h1 className={styles.title}>Join OpenPlate</h1>
        <p className={styles.subtitle}>Create your account to get started</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <div className={styles.errorBox}>{error}</div>}

          <Input
            label="Full name"
            type="text"
            name="name"
            placeholder="Your full name"
            value={formData.name}
            onChange={handleChange}
          />

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
            placeholder="At least 6 characters"
            value={formData.password}
            onChange={handleChange}
          />

          <div className={styles.roleSelector}>
            <span className={styles.roleLabel}>I want to join as</span>
            <div className={styles.roleOptions}>
              <div
                className={`${styles.roleCard} ${formData.role === 'CUSTOMER' ? styles.roleCardActive : ''}`}
                onClick={() => handleRoleSelect('CUSTOMER')}
              >
                <span className={styles.roleEmoji}>🛒</span>
                <span className={styles.roleTitle}>Customer</span>
                <span className={styles.roleDesc}>Order and watch live cooking</span>
              </div>
              <div
                className={`${styles.roleCard} ${formData.role === 'CHEF' ? styles.roleCardActive : ''}`}
                onClick={() => handleRoleSelect('CHEF')}
              >
                <span className={styles.roleEmoji}>👨‍🍳</span>
                <span className={styles.roleTitle}>Chef</span>
                <span className={styles.roleDesc}>Cook and earn from orders</span>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

        <div className={styles.footer}>
          Already have an account?{' '}
          <button
            className={styles.link}
            onClick={() => navigate('/login')}
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage