import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createProfile, getMyProfile } from '../../services/chefService'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import styles from './ChefProfileSetup.module.css'

function ChefProfileSetup() {
  const navigate = useNavigate()

  // formData holds what chef types
  const [formData, setFormData] = useState({
    bio: '',
    location: '',
    cuisineType: ''
  })
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [error, setError] = useState('')

  // On page load — check if profile already exists
  // If yes — redirect to dashboard immediately
  useEffect(() => {
    const checkProfile = async () => {
      try {
        await getMyProfile()
        // profile exists — redirect away
        navigate('/chef/dashboard', { replace: true })
      } catch {
        // no profile yet — stay on this page
        setChecking(false)
      }
    }
    checkProfile()
  }, [navigate])

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
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
      // profile created — go to dashboard
      navigate('/chef/dashboard', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create profile')
    } finally {
      setLoading(false)
    }
  }

  // Show nothing while checking existing profile
  if (checking) return null

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>Set up your chef profile</h1>
        <p className={styles.subtitle}>
          Tell customers about yourself before you start posting dishes
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          {error && <div className={styles.errorBox}>{error}</div>}

          <Input
            label="Bio"
            name="bio"
            placeholder="Tell customers about your cooking style and experience"
            value={formData.bio}
            onChange={handleChange}
          />

          <Input
            label="Location"
            name="location"
            placeholder="e.g. Hyderabad, Telangana"
            value={formData.location}
            onChange={handleChange}
          />

          <Input
            label="Cuisine type"
            name="cuisineType"
            placeholder="e.g. South Indian, Chinese, Continental"
            value={formData.cuisineType}
            onChange={handleChange}
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Setting up...' : 'Complete profile'}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default ChefProfileSetup