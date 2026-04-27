import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPostById } from '../../services/postService'
import { createOrder } from '../../services/orderService'
import Modal from '../../components/ui/Modal'
import {
  IconArrowLeft,
  IconMapPin,

  IconRosetteDiscountCheck,
  IconRadioactive,
  IconShoppingCart,
  IconAlertCircle,
  IconToolsKitchen2,
} from '@tabler/icons-react'
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
      setModal({ type: 'success', title: 'Order placed!', message: 'The chef will confirm and cook your order.' })
    } catch (err) {
      setModal({ type: 'error', title: 'Order failed', message: err.response?.data?.message || 'Failed to place order.' })
    } finally {
      setOrdering(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={`skeleton ${styles.skBack}`} />
        <div className={styles.layout}>
          <div className={styles.left}>
            <div className={`skeleton ${styles.skTitle}`} />
            <div className={`skeleton ${styles.skImage}`} />
            <div className={`skeleton ${styles.skLine}`} />
            <div className={`skeleton ${styles.skLine}`} />
            <div className={`skeleton ${styles.skLineShort}`} />
          </div>
          <div className={styles.right}>
            <div className={`skeleton ${styles.skChefCard}`} />
            <div className={`skeleton ${styles.skOrderPanel}`} />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.page}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <IconArrowLeft size={16} stroke={2} /> Back
        </button>
        <div className={styles.errorState}>
          <div className={styles.errorIconWrap}>
            <IconAlertCircle size={36} stroke={1.5} />
          </div>
          <h3 className={styles.errorTitle}>Post unavailable</h3>
          <p className={styles.errorMsg}>{error}</p>
          <button className={styles.retryBtn} onClick={() => navigate(-1)}>
            Go back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>

      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        <IconArrowLeft size={16} stroke={2} /> Back
      </button>

      <div className={styles.layout}>

        {/* ── LEFT — main content ── */}
        <div className={styles.left}>

          {/* Title + tags */}
          <h1 className={styles.title}>{post.title}</h1>
          <div className={styles.tagRow}>
            {post.chef?.cuisineType && (
              <span className={styles.cuisineTag}>{post.chef.cuisineType}</span>
            )}
            {post.isLive && (
              <span className={styles.liveBadge}>
                <span className={styles.liveDot} /> Live now
              </span>
            )}
          </div>

          {/* Image — only if exists */}
          {post.imageUrl && (
            <div className={styles.imageWrap}>
              <img src={post.imageUrl} alt={post.title} className={styles.image} />
            </div>
          )}

          {/* Video — only if exists */}
          {post.videoUrl && (
            <div className={styles.videoWrap}>
              <video className={styles.video} controls src={post.videoUrl} />
            </div>
          )}

          {/* No media placeholder — only if no image AND no video */}
          {!post.imageUrl && !post.videoUrl && (
            <div className={styles.noMediaPlaceholder}>
              <IconToolsKitchen2 size={40} stroke={1} />
              {post.isLive && <p>Chef will cook live after you order</p>}
            </div>
          )}

          {/* About */}
          {post.description && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>About this dish</h2>
              <p className={styles.sectionText}>{post.description}</p>
            </section>
          )}

          {/* Ingredients */}
          {post.ingredients && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Ingredients</h2>
              <p className={styles.sectionText}>{post.ingredients}</p>
            </section>
          )}

          {/* Steps */}
          {post.steps && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Cooking steps</h2>
              <p className={styles.sectionText}>{post.steps}</p>
            </section>
          )}

        </div>

        {/* ── RIGHT — sticky order panel ── */}
        <div className={styles.right}>

          {/* Chef card */}
          <div className={styles.chefCard}>
            <div className={styles.chefAvatar}>
              {post.author?.name?.charAt(0).toUpperCase()}
            </div>
            <div className={styles.chefInfo}>
              <div className={styles.chefName}>
                {post.author?.name}
                {post.chef?.isVerified && (
                  <IconRosetteDiscountCheck size={15} stroke={1.5} className={styles.verifiedIcon} />
                )}
              </div>
              <div className={styles.chefMeta}>
                {post.chef?.location && (
                  <span className={styles.chefMetaItem}>
                    <IconMapPin size={11} stroke={1.5} /> {post.chef.location}
                  </span>
                )}
                {post.chef?.cuisineType && (
                  <span className={styles.chefMetaItem}>{post.chef.cuisineType}</span>
                )}
              </div>
            </div>
          </div>

          {/* Order panel */}
          <div className={styles.orderPanel}>
            <div className={styles.priceRow}>
              <span className={styles.priceLabel}>Price</span>
              <span className={styles.price}>₹{post.price}</span>
            </div>

            {post.isLive && (
              <div className={styles.liveNotice}>
                <span className={styles.liveDotSm} />
                Chef is live — order now to watch them cook!
              </div>
            )}

            <button
              className={`${styles.orderBtn} ${post.isLive ? styles.orderBtnLive : ''}`}
              disabled={ordering}
              onClick={handleOrder}
            >
              {ordering ? (
                <span className={styles.btnSpinner} />
              ) : post.isLive ? (
                <><IconRadioactive size={16} stroke={1.5} /> Order &amp; Watch Live</>
              ) : (
                <><IconShoppingCart size={16} stroke={1.5} /> Place Order</>
              )}
            </button>
          </div>

        </div>
      </div>

      {modal && (
        <Modal
          type={modal.type}
          title={modal.title}
          message={modal.message}
          onClose={() => {
            setModal(null)
            if (modal.type === 'success') navigate(-1)
          }}
        />
      )}

    </div>
  )
}

export default PostDetailPage