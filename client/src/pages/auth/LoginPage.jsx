import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { login as loginApi } from '../../services/authService'
import {
  IconMail, IconLock, IconEye, IconEyeOff,
  IconArrowRight, IconAlertCircle,
} from '@tabler/icons-react'
import AuthLayout from '../../components/layout/AuthLayout'
import styles from './LoginPage.module.css'

function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
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
      if (data.user.role === 'CHEF') navigate('/chef/dashboard')
      else if (data.user.role === 'ADMIN') navigate('/admin')
      else navigate('/feed')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className={styles.heading}>
        <h1 className={styles.title}>
          Welcome back to <span className={styles.brandGradient}>OpenPlate</span>
        </h1>
        <p className={styles.subtitle}>
          Don't have an account?{' '}
          <button className={styles.inlineLink} onClick={() => navigate('/register')}>
            Create one
          </button>
        </p>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {error && (
          <div className={styles.errorBox}>
            <IconAlertCircle size={14} stroke={1.8} />
            <span>{error}</span>
          </div>
        )}

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Email</label>
          <div className={styles.inputWrap}>
            <IconMail size={14} stroke={1.5} className={styles.inputIcon} />
            <input
              className={styles.input}
              type="email"
              name="email"
              placeholder="Type your email address"
              value={formData.email}
              onChange={handleChange}
              autoComplete="email"
            />
          </div>
        </div>

        <div className={styles.fieldGroup}>
          <label className={styles.label}>Password</label>
          <div className={styles.inputWrap}>
            <IconLock size={14} stroke={1.5} className={styles.inputIcon} />
            <input
              className={styles.input}
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              autoComplete="current-password"
            />
            <button type="button" className={styles.eyeBtn}
              onClick={() => setShowPassword(p => !p)} tabIndex={-1}>
              {showPassword ? <IconEyeOff size={14} stroke={1.5} /> : <IconEye size={14} stroke={1.5} />}
            </button>
          </div>
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? <span className={styles.spinner} /> : (
            <><span>Sign in</span><IconArrowRight size={15} stroke={2} /></>
          )}
        </button>
      </form>

      <p className={styles.terms}>
        By signing in, you agree to OpenPlate's{' '}
        <button className={styles.termsLink}>Terms of Service</button>
      </p>
    </AuthLayout>
  )
}

export default LoginPage