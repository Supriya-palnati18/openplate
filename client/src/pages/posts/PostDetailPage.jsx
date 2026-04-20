import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPostById } from '../../services/postService'
import { createOrder } from '../../services/orderService'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import styles from './PostDetailPage.module.css'

function PostDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [ordering, setOrdering] = useState(false)
  const [error, setError] = useState('')
  const [modal, setModal] = useState(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await getPostById(id)
        setPost(data.post)
      } catch {
        setError('Post not found or unavailable.')
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [id])

  const handleOrder = async () => {
    setOrdering(true)
    try {
      await createOrder(post.id)
      setModal({
        icon: '🎉',
        title: 'Order placed!',
        message: post.isLive
          ? 'The chef will confirm and go live to cook your order.'
          : 'Your order has been placed successfully.'
      })
    } catch (err) {
      setModal({
        icon: '❌',
        title: 'Order failed',
        message: err.response?.data?.message || 'Failed to place order.'
      })
    } finally {
      setOrdering(false)
    }
  }

  if (loading) return <div className={styles.loading}>Loading...</div>

  if (error) return (
    <div className={styles.page}>
      <div className={styles.errorBox}>{error}</div>
    </div>
  )

  return (
    <div className={styles.page}>
      <button
        className={styles.backBtn}
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <h1 className={styles.title}>{post.title}</h1>

      <div className={styles.chefCard}>
        <div className={styles.chefAvatar}>
          {post.author?.name?.charAt(0).toUpperCase()}
        </div>
        <div className={styles.chefInfo}>
          <div className={styles.chefName}>{post.author?.name}</div>
          <div className={styles.chefMeta}>
            📍 {post.chef?.location} · {post.chef?.cuisineType}
          </div>
        </div>
        {post.chef?.isVerified && (
          <span className={styles.verifiedBadge}>✓ Verified</span>
        )}
      </div>

      <div className={styles.videoWrapper}>
        {post.videoUrl ? (
          <video
            className={styles.video}
            controls
            src={post.videoUrl}
          />
        ) : (
          <div className={styles.videoPlaceholder}>
            <span className={styles.videoPlaceholderIcon}>
              {post.isLive ? '🔴' : '🎬'}
            </span>
            <p>
              {post.isLive
                ? 'Chef will cook live after your order'
                : 'No video uploaded yet'}
            </p>
          </div>
        )}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>About this dish</h2>
        <p className={styles.sectionText}>{post.description}</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Ingredients</h2>
        <p className={styles.sectionText}>{post.ingredients}</p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Cooking steps</h2>
        <p className={styles.sectionText}>{post.steps}</p>
      </div>

      <div className={styles.orderCard}>
        <div>
          <span className={styles.priceLabel}>Price</span>
          <span className={styles.price}>₹{post.price}</span>
        </div>
        <Button
          variant="primary"
          disabled={ordering}
          onClick={handleOrder}
        >
          {ordering
            ? 'Placing order...'
            : post.isLive
              ? '🔴 Order & Watch Live'
              : '🛒 Place Order'}
        </Button>
      </div>

      {modal && (
        <Modal
          icon={modal.icon}
          title={modal.title}
          message={modal.message}
          onClose={() => {
            setModal(null)
            if (modal.icon === '🎉') navigate(-1)
          }}
        />
      )}
    </div>
  )
}

export default PostDetailPage