import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { createProfile, getMyProfile } from '../../services/chefService'
import {
  IconChefHat,
  IconMapPin,
  IconToolsKitchen2,
  IconAlertCircle,
  IconArrowRight
} from '@tabler/icons-react'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import styles from './ChefProfileSetup.module.css'

function ChefProfileSetup() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [formData, setFormData] = useState({ bio: '', location: '', cuisineType: '' })
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const checkProfile = async () => {
      try {
        await getMyProfile()
        navigate('/chef/dashboard', { replace: true })
      } catch {
        setChecking(false)
      }
    }
    checkProfile()
  }, [navigate])

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.bio || !formData.location || !formData.cuisineType) {
      setError('Please fill in all fields')
      return
    }
    setLoading(true)
    try {
      await createProfile(formData)
      navigate('/chef/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create profile')
    } finally {
      setLoading(false)
    }
  }

  if (checking) return null

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.avatarWrap}>
          <div className={styles.avatar}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className={styles.chefBadge}>
            <IconChefHat size={14} stroke={2} />
          </div>
        </div>

        <h1 className={styles.title}>
          Set up your{' '}
          <span className={styles.gradient}>Chef Profile</span>
        </h1>
        <p className={styles.subtitle}>
          Customers see this when they browse your dishes. Make it count.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && (
            <div className={styles.errorBox}>
              <IconAlertCircle size={16} stroke={1.5} />
              {error}
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label}>
              <IconChefHat size={14} stroke={1.5} />
              About you
            </label>
            <textarea
              className={styles.textarea}
              name="bio"
              placeholder="Describe your cooking style, experience, and what makes your food special..."
              value={formData.bio}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              <IconMapPin size={14} stroke={1.5} />
              Location
            </label>
            <input
              className={styles.input}
              name="location"
              placeholder="e.g. Hyderabad, Telangana"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              <IconToolsKitchen2 size={14} stroke={1.5} />
              Cuisine type
            </label>
            <input
              className={styles.input}
              name="cuisineType"
              placeholder="e.g. South Indian, Chinese, Continental"
              value={formData.cuisineType}
              onChange={handleChange}
            />
          </div>

          <Button type="submit" variant="primary" fullWidth disabled={loading}>
            {loading ? 'Setting up...' : (
              <>
                Complete profile
                <IconArrowRight size={16} stroke={2} />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default ChefProfileSetup