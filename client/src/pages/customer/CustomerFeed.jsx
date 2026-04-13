import { useState, useEffect } from 'react'
import { getAllPosts } from '../../services/postService'
import { createOrder } from '../../services/orderService'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'
import styles from './CustomerFeed.module.css'
import Modal from '../../components/ui/Modal'

function CustomerFeed() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [orderingId, setOrderingId] = useState(null)
  const [modal, setModal] = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await getAllPosts()
        setPosts(data.posts)
      } catch {
        setError('Failed to load posts. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  const handleOrder = async (postId) => {
    setOrderingId(postId)
    try {
      await createOrder(postId)
      setModal({
        icon: '🎉',
        title: 'Order placed!',
        message: 'The chef will review your order and confirm shortly. You will be notified when your live cooking session is scheduled.'
      })
    } catch (err) {
      setModal({
        icon: '❌',
        title: 'Order failed',
        message: err.response?.data?.message || 'Failed to place order. Please try again.'
      })
    } finally {
      setOrderingId(null)
    }
  }

  if (loading) {
    return <div className={styles.loading}>Loading posts...</div>
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          Welcome back, {user?.name} 👋
        </h1>
        <p className={styles.subtitle}>
          Browse dishes and watch chefs cook your order live
        </p>
      </div>

      
      {error && <div className={styles.errorBox}>{error}</div>}

      {posts.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🍽️</div>
          <p className={styles.emptyText}>No dishes available yet</p>
          <p>Check back soon — chefs are preparing their menus</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {posts.map(post => (
            <div key={post.id} className={styles.card}>
              <div className={styles.cardImagePlaceholder}>
                <span className={styles.placeholderIcon}>🍽️</span>
              </div>

              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{post.title}</h3>

                <span className={styles.cuisineTag}>
                  {post.chef?.cuisineType}
                </span>

                <p className={styles.cardDescription}>
                  {post.description}
                </p>

                <div className={styles.cardMeta}>
                  <div className={styles.chefInfo}>
                    <span className={styles.chefName}>
                      {post.author?.name}
                    </span>
                    <span className={styles.chefLocation}>
                      📍 {post.chef?.location}
                    </span>
                  </div>
                  <span className={styles.price}>
                    ₹{post.price}
                  </span>
                </div>

                <Button
                  variant="primary"
                  fullWidth
                  disabled={orderingId === post.id}
                  onClick={() => handleOrder(post.id)}
                >
                  {orderingId === post.id ? 'Placing order...' : 'Order & Watch Live'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal
          icon={modal.icon}
          title={modal.title}
          message={modal.message}
          onClose={() => setModal(null)}
        />
      )}

    </div>
  )
}

export default CustomerFeed