import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getMyProfile, createProfile, updateProfile } from '../../services/chefService'
import {
  IconChefHat,
  IconMapPin,
  IconToolsKitchen2,
  IconPencil,
  IconCheck,
  IconX,
  IconUser,
  IconAlertCircle,
  IconRosetteDiscountCheck
} from '@tabler/icons-react'
import Button from '../../components/ui/Button'
import styles from './ChefProfileSetup.module.css'

function ChefProfileSetup() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const isChef = user?.role === 'CHEF'

  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(isChef)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({ bio: '', location: '', cuisineType: '' })
  const [isNewProfile, setIsNewProfile] = useState(false)

  useEffect(() => {
    if (!isChef) return
    const fetchProfile = async () => {
      try {
        const { data } = await getMyProfile()
        setProfile(data.profile)
        setFormData({
          bio: data.profile.bio || '',
          location: data.profile.location || '',
          cuisineType: data.profile.cuisineType || ''
        })
      } catch {
        setIsNewProfile(true)
        setEditing(true)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [isChef])

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const { data } = isNewProfile
        ? await createProfile(formData)
        : await updateProfile(formData)
      setProfile(data.profile)
      setIsNewProfile(false)
      setEditing(false)
      setSuccess(isNewProfile ? 'Profile created!' : 'Profile updated successfully')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      bio: profile?.bio || '',
      location: profile?.location || '',
      cuisineType: profile?.cuisineType || ''
    })
    setEditing(false)
    setError('')
  }

  if (loading) return <div className={styles.loading}>Loading...</div>

  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.avatarWrap}>
          <div className={styles.avatar}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className={styles.roleBadge}>
            {isChef
              ? <IconChefHat size={14} stroke={2} />
              : <IconUser size={14} stroke={2} />
            }
          </div>
        </div>

        <div className={styles.headerInfo}>
          <h1 className={styles.name}>{user?.name}</h1>
          <div className={styles.badges}>
            <span className={styles.roleTag}>
              {isChef ? 'Chef' : 'Customer'}
            </span>
            {profile?.isVerified && (
              <span className={styles.verifiedTag}>
                <IconRosetteDiscountCheck size={14} stroke={1.5} />
                Verified
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Feedback */}
      {success && (
        <div className={styles.successBox}>
          <IconCheck size={16} stroke={2} /> {success}
        </div>
      )}
      {error && (
        <div className={styles.errorBox}>
          <IconAlertCircle size={16} stroke={1.5} /> {error}
        </div>
      )}

      {/* Chef profile card */}
      {isChef && (profile || isNewProfile) && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              {isNewProfile ? 'Complete Your Profile' : 'Chef Profile'}
            </h2>
            {!editing ? (
              <button className={styles.editBtn} onClick={() => setEditing(true)}>
                <IconPencil size={15} stroke={1.5} /> Edit
              </button>
            ) : (
              <div className={styles.editActions}>
                <Button size="small" variant="primary" disabled={saving} onClick={handleSave}>
                  <IconCheck size={14} stroke={2} />
                  {saving ? 'Saving...' : 'Save'}
                </Button>
                <Button size="small" variant="secondary" onClick={handleCancel}>
                  <IconX size={14} stroke={2} /> Cancel
                </Button>
              </div>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>
              <IconChefHat size={14} stroke={1.5} /> About you
            </label>
            {editing ? (
              <textarea
                className={styles.textarea}
                value={formData.bio}
                onChange={e => setFormData(p => ({ ...p, bio: e.target.value }))}
                rows={4}
                placeholder="Describe your cooking style and experience..."
              />
            ) : (
              <p className={styles.fieldValue}>{profile.bio || '—'}</p>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>
              <IconMapPin size={14} stroke={1.5} /> Location
            </label>
            {editing ? (
              <input
                className={styles.input}
                value={formData.location}
                onChange={e => setFormData(p => ({ ...p, location: e.target.value }))}
                placeholder="e.g. Hyderabad, Telangana"
              />
            ) : (
              <p className={styles.fieldValue}>{profile.location || '—'}</p>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>
              <IconToolsKitchen2 size={14} stroke={1.5} /> Cuisine type
            </label>
            {editing ? (
              <input
                className={styles.input}
                value={formData.cuisineType}
                onChange={e => setFormData(p => ({ ...p, cuisineType: e.target.value }))}
                placeholder="e.g. South Indian, Continental"
              />
            ) : (
              <p className={styles.fieldValue}>{profile.cuisineType || '—'}</p>
            )}
          </div>

          {isNewProfile && (
            <button
              className={styles.skipBtn}
              onClick={() => navigate('/chef/dashboard')}
            >
              Skip for now — I'll complete this later
            </button>
          )}
        </div>
      )}

      {/* Customer card */}
      {!isChef && (
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Account Info</h2>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>
              <IconUser size={14} stroke={1.5} /> Name
            </label>
            <p className={styles.fieldValue}>{user?.name}</p>
          </div>
          <div className={styles.field}>
            <label className={styles.fieldLabel}>Role</label>
            <p className={styles.fieldValue}>Customer</p>
          </div>
        </div>
      )}

    </div>
  )
}

export default ChefProfileSetup