import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { register as registerApi, login as loginApi } from '../../services/authService'
import {
  IconUser,
  IconMail,
  IconLock,
  IconShoppingBag,
  IconChefHat,
  IconArrowRight,
  IconAlertCircle,
  IconEye,
  IconEyeOff,
} from '@tabler/icons-react'
import AuthLayout from '../../components/layout/AuthLayout'
import styles from './RegisterPage.module.css'

function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'CUSTOMER',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleRoleSelect = (role) => {
    setFormData(prev => ({ ...prev, role }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields')
      return
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      await registerApi(formData)
      const { data } = await loginApi({ email: formData.email, password: formData.password })
      login(data.user)
      navigate(data.user.role === 'CHEF' ? '/chef/profile/setup' : '/feed')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>

      {/* Heading */}
      <div className={styles.heading}>
        <h1 className={styles.title}>
          Welcome to{' '}
          <span className={styles.brandGradient}>OpenPlate</span>
        </h1>
        <p className={styles.subtitle}>
          Already have an account?{' '}
          <button className={styles.inlineLink} onClick={() => navigate('/login')}>
            Sign in
          </button>
        </p>
      </div>

      {/* Form */}
      <form className={styles.form} onSubmit={handleSubmit}>

        {error && (
          <div className={styles.errorBox}>
            <IconAlertCircle size={14} stroke={1.8} />
            <span>{error}</span>
          </div>
        )}

        {/* Name */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Name</label>
          <div className={styles.inputWrap}>
            <IconUser size={14} stroke={1.5} className={styles.inputIcon} />
            <input
              className={styles.input}
              type="text"
              name="name"
              placeholder="Type your full name"
              value={formData.name}
              onChange={handleChange}
              autoComplete="name"
            />
          </div>
        </div>

        {/* Email */}
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

        {/* Password */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Password</label>
          <div className={styles.inputWrap}>
            <IconLock size={14} stroke={1.5} className={styles.inputIcon} />
            <input
              className={styles.input}
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="At least 6 characters"
              value={formData.password}
              onChange={handleChange}
              autoComplete="new-password"
            />
            <button
              type="button"
              className={styles.eyeBtn}
              onClick={() => setShowPassword(p => !p)}
              tabIndex={-1}
            >
              {showPassword
                ? <IconEyeOff size={14} stroke={1.5} />
                : <IconEye size={14} stroke={1.5} />
              }
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className={styles.fieldGroup}>
          <label className={styles.label}>Confirm Password</label>
          <div className={styles.inputWrap}>
            <IconLock size={14} stroke={1.5} className={styles.inputIcon} />
            <input
              className={`${styles.input} ${
                formData.confirmPassword && formData.password !== formData.confirmPassword
                  ? styles.inputError
                  : formData.confirmPassword && formData.password === formData.confirmPassword
                  ? styles.inputSuccess
                  : ''
              }`}
              type={showConfirm ? 'text' : 'password'}
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
            />
            <button
              type="button"
              className={styles.eyeBtn}
              onClick={() => setShowConfirm(p => !p)}
              tabIndex={-1}
            >
              {showConfirm
                ? <IconEyeOff size={14} stroke={1.5} />
                : <IconEye size={14} stroke={1.5} />
              }
            </button>
          </div>
        </div>

        {/* Role selector */}
        <div className={styles.roleSection}>
          <label className={styles.label}>I want to join as</label>
          <div className={styles.roleGrid}>

            <div
              className={`${styles.roleCard} ${formData.role === 'CUSTOMER' ? styles.roleActive : ''}`}
              onClick={() => handleRoleSelect('CUSTOMER')}
            >
              <div className={styles.roleIconBox}>
                <IconShoppingBag size={15} stroke={1.5} />
              </div>
              <div className={styles.roleText}>
                <span className={styles.roleTitle}>Customer</span>
                <span className={styles.roleDesc}>Order &amp; watch live</span>
              </div>
              <div className={styles.roleCheck}>
                {formData.role === 'CUSTOMER' && (
                  <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            </div>

            <div
              className={`${styles.roleCard} ${formData.role === 'CHEF' ? styles.roleActive : ''}`}
              onClick={() => handleRoleSelect('CHEF')}
            >
              <div className={styles.roleIconBox}>
                <IconChefHat size={15} stroke={1.5} />
              </div>
              <div className={styles.roleText}>
                <span className={styles.roleTitle}>Chef</span>
                <span className={styles.roleDesc}>Cook &amp; earn</span>
              </div>
              <div className={styles.roleCheck}>
                {formData.role === 'CHEF' && (
                  <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            </div>

          </div>
        </div>

        <button type="submit" className={styles.submitBtn} disabled={loading}>
          {loading ? (
            <span className={styles.spinner} />
          ) : (
            <>
              <span>Sign Up</span>
              <IconArrowRight size={15} stroke={2} />
            </>
          )}
        </button>

      </form>

      <p className={styles.terms}>
        By clicking Sign up, you agree to OpenPlate's{' '}
        <button className={styles.termsLink}>Terms of Service</button>
      </p>

    </AuthLayout>
  )
}

export default RegisterPage