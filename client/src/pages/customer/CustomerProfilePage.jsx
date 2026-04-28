import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getProfile, createProfile, updateProfile } from '../../services/customerService'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import styles from './CustomerProfilePage.module.css'

function CustomerProfilePage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [isNewProfile, setIsNewProfile] = useState(false)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    phone: '', landmark: '', street: '', city: '', state: '', country: '', pincode: ''
  })

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getProfile()
        setProfile(data.profile)
        setFormData({
          phone:    data.profile.phone,
          landmark: data.profile.landmark || '',
          street:   data.profile.street,
          city:     data.profile.city,
          state:    data.profile.state,
          country:  data.profile.country,
          pincode:  data.profile.pincode
        })
      } catch {
        setIsNewProfile(true)
        setEditing(true)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const { phone, street, city, state, country, pincode } = formData
    if (!phone || !street || !city || !state || !country || !pincode) {
      setError('Please fill in all required fields')
      return
    }
    setSaving(true)
    try {
      const { data } = isNewProfile
        ? await createProfile(formData)
        : await updateProfile(formData)
      setProfile(data.profile)
      setIsNewProfile(false)
      setEditing(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className={styles.loading}>Loading...</div>

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{isNewProfile ? 'Complete Your Profile' : 'My Profile'}</h1>
          <p className={styles.subtitle}>
            {isNewProfile ? 'Add your details for a smooth ordering experience' : 'Your account and delivery information'}
          </p>
        </div>
        {!editing && !isNewProfile && (
          <Button variant="secondary" onClick={() => setEditing(true)}>Edit</Button>
        )}
      </div>

      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>Account Info</h2>
        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Name</span>
            <span className={styles.infoValue}>{user?.name}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Email</span>
            <span className={styles.infoValue}>{user?.email}</span>
          </div>
          <div className={styles.infoItem}>
            <span className={styles.infoLabel}>Role</span>
            <span className={styles.infoValue}>{user?.role}</span>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>Delivery Details</h2>

        {editing ? (
          <form className={styles.form} onSubmit={handleSave}>
            {error && <div className={styles.errorBox}>{error}</div>}

            <Input
              label="Phone *"
              name="phone"
              type="tel"
              placeholder="e.g. +91 98765 43210"
              value={formData.phone}
              onChange={handleChange}
            />

            <div className={styles.row}>
              <Input
                label="Street *"
                name="street"
                placeholder="Street / Area"
                value={formData.street}
                onChange={handleChange}
              />
              <Input
                label="Landmark"
                name="landmark"
                placeholder="Nearby landmark (optional)"
                value={formData.landmark}
                onChange={handleChange}
              />
            </div>

            <div className={styles.row}>
              <Input
                label="City *"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
              />
              <Input
                label="State *"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
              />
            </div>

            <div className={styles.row}>
              <Input
                label="Country *"
                name="country"
                placeholder="Country"
                value={formData.country}
                onChange={handleChange}
              />
              <Input
                label="Pincode *"
                name="pincode"
                placeholder="Pincode"
                value={formData.pincode}
                onChange={handleChange}
              />
            </div>

            <div className={styles.actions}>
              {!isNewProfile && (
                <Button variant="ghost" type="button" onClick={() => { setEditing(false); setError('') }}>
                  Cancel
                </Button>
              )}
              <Button variant="primary" type="submit" disabled={saving}>
                {saving ? 'Saving...' : isNewProfile ? 'Save Profile' : 'Update Profile'}
              </Button>
            </div>
          </form>
        ) : (
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Phone</span>
              <span className={styles.infoValue}>{profile?.phone}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Street</span>
              <span className={styles.infoValue}>{profile?.street}</span>
            </div>
            {profile?.landmark && (
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Landmark</span>
                <span className={styles.infoValue}>{profile.landmark}</span>
              </div>
            )}
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>City</span>
              <span className={styles.infoValue}>{profile?.city}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>State</span>
              <span className={styles.infoValue}>{profile?.state}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Country</span>
              <span className={styles.infoValue}>{profile?.country}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Pincode</span>
              <span className={styles.infoValue}>{profile?.pincode}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomerProfilePage