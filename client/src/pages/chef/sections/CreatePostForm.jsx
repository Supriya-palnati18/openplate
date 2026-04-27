import { useState } from 'react'
import { createPost } from '../../../services/postService'
import { IconVideo, IconRadioactive, IconAlertCircle } from '@tabler/icons-react'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import styles from './CreatePostForm.module.css'

const initialForm = {
  title: '', description: '', ingredients: '',
  steps: '', price: '', videoUrl: '', isLive: false
}

function CreatePostForm({ onPostCreated, showTitle = true }) {
  const [formData, setFormData] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title || !formData.description || !formData.ingredients || !formData.steps || !formData.price) {
      setError('Please fill in all required fields')
      return
    }
    setLoading(true)
    try {
      await createPost({ ...formData, price: parseFloat(formData.price) })
      setFormData(initialForm)
      onPostCreated()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create dish')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.form}>
      {showTitle && <h3 className={styles.formTitle}>Add new dish</h3>}

      <form className={styles.fields} onSubmit={handleSubmit}>
        {error && (
          <div className={styles.errorBox}>
            <IconAlertCircle size={16} stroke={1.5} />
            {error}
          </div>
        )}

        <div className={styles.row}>
          <Input label="Dish name *" name="title" placeholder="e.g. Hyderabadi Biryani" value={formData.title} onChange={handleChange} />
          <Input label="Price (₹) *" name="price" type="number" placeholder="e.g. 299" value={formData.price} onChange={handleChange} />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Description *</label>
          <textarea className={styles.textarea} name="description" placeholder="What makes this dish special?" value={formData.description} onChange={handleChange} rows={3} />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Ingredients *</label>
          <textarea className={styles.textarea} name="ingredients" placeholder="List all ingredients, one per line or comma separated" value={formData.ingredients} onChange={handleChange} rows={3} />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Cooking steps *</label>
          <textarea className={styles.textarea} name="steps" placeholder={"Step 1: ...\nStep 2: ...\nStep 3: ..."} value={formData.steps} onChange={handleChange} rows={4} />
        </div>

        <div className={styles.typeSelector}>
          <span className={styles.typeLabel}>Cooking type</span>
          <div className={styles.typeOptions}>
            <div
              className={`${styles.typeCard} ${!formData.isLive ? styles.typeCardActive : ''}`}
              onClick={() => setFormData(prev => ({ ...prev, isLive: false }))}
            >
              <IconVideo size={24} stroke={1.5} className={styles.typeIcon} />
              <span className={styles.typeTitle}>Video post</span>
              <span className={styles.typeDesc}>Upload a cooking video</span>
            </div>
            <div
              className={`${styles.typeCard} ${formData.isLive ? styles.typeCardActive : ''}`}
              onClick={() => setFormData(prev => ({ ...prev, isLive: true }))}
            >
              <IconRadioactive size={24} stroke={1.5} className={`${styles.typeIcon} ${styles.typeIconLive}`} />
              <span className={styles.typeTitle}>Live cooking</span>
              <span className={styles.typeDesc}>Cook live for the customer</span>
            </div>
          </div>
        </div>

        {!formData.isLive && (
          <Input label="Video URL" name="videoUrl" placeholder="Paste your cooking video URL" value={formData.videoUrl} onChange={handleChange} />
        )}

        <div className={styles.actions}>
          <Button type="button" variant="secondary" onClick={() => setFormData(initialForm)}>Clear</Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Creating...' : 'Create dish'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CreatePostForm