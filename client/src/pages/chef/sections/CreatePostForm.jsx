import { useState } from 'react'
import { createPost } from '../../../services/postService'
import Input from '../../../components/ui/Input'
import Button from '../../../components/ui/Button'
import styles from './CreatePostForm.module.css'

const initialForm = {
  title: '',
  description: '',
  ingredients: '',
  steps: '',
  price: '',
  videoUrl: '',
  isLive: false
}

function CreatePostForm({ onPostCreated }) {
  const [formData, setFormData] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
  }

  const handleTypeSelect = (isLive) => {
    setFormData(prev => ({ ...prev, isLive }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title || !formData.description ||
        !formData.ingredients || !formData.steps || !formData.price) {
      setError('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      await createPost({
        ...formData,
        price: parseFloat(formData.price)
      })
      setFormData(initialForm)
      onPostCreated()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.form}>
      <h3 className={styles.formTitle}>Add new dish</h3>

      <form className={styles.fields} onSubmit={handleSubmit}>
        {error && <div className={styles.errorBox}>{error}</div>}

        <div className={styles.row}>
          <Input
            label="Dish name *"
            name="title"
            placeholder="e.g. Hyderabadi Biryani"
            value={formData.title}
            onChange={handleChange}
          />
          <Input
            label="Price (₹) *"
            name="price"
            type="number"
            placeholder="e.g. 299"
            value={formData.price}
            onChange={handleChange}
          />
        </div>

        <Input
          label="Description *"
          name="description"
          placeholder="What makes this dish special?"
          value={formData.description}
          onChange={handleChange}
        />

        <Input
          label="Ingredients *"
          name="ingredients"
          placeholder="List all ingredients separated by commas"
          value={formData.ingredients}
          onChange={handleChange}
        />

        <Input
          label="Cooking steps *"
          name="steps"
          placeholder="Step 1: ... Step 2: ..."
          value={formData.steps}
          onChange={handleChange}
        />

        <div className={styles.typeSelector}>
          <span className={styles.typeLabel}>Cooking type</span>
          <div className={styles.typeOptions}>
            <div
              className={`${styles.typeCard} ${!formData.isLive ? styles.typeCardActive : ''}`}
              onClick={() => handleTypeSelect(false)}
            >
              <span className={styles.typeEmoji}>🎬</span>
              <span className={styles.typeTitle}>Video post</span>
              <span className={styles.typeDesc}>Upload a cooking video</span>
            </div>
            <div
              className={`${styles.typeCard} ${formData.isLive ? styles.typeCardActive : ''}`}
              onClick={() => handleTypeSelect(true)}
            >
              <span className={styles.typeEmoji}>🔴</span>
              <span className={styles.typeTitle}>Live cooking</span>
              <span className={styles.typeDesc}>Cook live for the customer</span>
            </div>
          </div>
        </div>

        {!formData.isLive && (
          <Input
            label="Video URL"
            name="videoUrl"
            placeholder="Paste your cooking video URL"
            value={formData.videoUrl}
            onChange={handleChange}
          />
        )}

        <div className={styles.actions}>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setFormData(initialForm)}
          >
            Clear
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create dish'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default CreatePostForm