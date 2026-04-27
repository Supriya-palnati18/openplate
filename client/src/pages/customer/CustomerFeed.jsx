import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllPosts } from '../../services/postService'
import { createOrder } from '../../services/orderService'
import { useAuth } from '../../context/AuthContext'
import Modal from '../../components/ui/Modal'
import {
  IconToolsKitchen2,
  IconMapPin,
  IconEye,
  IconRadioactive,
  IconAlertCircle,
  IconRefresh,
  IconSalad,
  IconChevronLeft,
  IconChevronRight,
} from '@tabler/icons-react'
import styles from './CustomerFeed.module.css'

const POSTS_PER_PAGE = 9

function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, '...', total]
  if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total]
  return [1, '...', current - 1, current, current + 1, '...', total]
}

function SkeletonCard() {
  return (
    <div className={styles.card}>
      <div className={`${styles.cardImageArea} skeleton`} />
      <div className={styles.cardBody}>
        <div className={`skeleton ${styles.skTitle}`} />
        <div className={`skeleton ${styles.skTag}`} />
        <div className={`skeleton ${styles.skText}`} />
        <div className={`skeleton ${styles.skText} ${styles.skTextShort}`} />
        <div className={`skeleton ${styles.skBtn}`} />
      </div>
    </div>
  )
}

function CustomerFeed() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [orderingId, setOrderingId] = useState(null)
  const [modal, setModal] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const { user } = useAuth()
  const navigate = useNavigate()

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    setError('')
    setCurrentPage(1)
    try {
      const { data } = await getAllPosts()
      setPosts(data.posts)
    } catch {
      setError('Failed to load posts. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchPosts() }, [fetchPosts])

  const handleOrder = async (post) => {
    if (!post.isLive) {
      navigate(`/posts/${post.id}`)
      return
    }
    setOrderingId(post.id)
    try {
      await createOrder(post.id)
      setModal({
        type: 'success',
        title: 'Order placed!',
        message: 'The chef will confirm your order and go live to cook it.',
      })
    } catch (err) {
      setModal({
        type: 'error',
        title: 'Order failed',
        message: err.response?.data?.message || 'Failed to place order. Please try again.',
      })
    } finally {
      setOrderingId(null)
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  const paginatedPosts = posts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  )

  return (
    <div className={styles.page}>

      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>
          Welcome back, <span className={styles.nameGradient}>{user?.name}</span>
        </h1>
        <p className={styles.subtitle}>Browse dishes and watch chefs cook your order live</p>
      </div>

      {/* Loading */}
      {loading && (
        <div className={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className={styles.errorState}>
          <div className={styles.errorIconWrap}>
            <IconAlertCircle size={36} stroke={1.5} />
          </div>
          <h3 className={styles.stateTitle}>Something went wrong</h3>
          <p className={styles.stateMsg}>{error}</p>
          <button className={styles.retryBtn} onClick={fetchPosts}>
            <IconRefresh size={15} stroke={2} /> Try again
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && posts.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIconWrap}>
            <IconSalad size={48} stroke={1} />
          </div>
          <h3 className={styles.stateTitle}>No dishes yet</h3>
          <p className={styles.stateMsg}>Chefs are preparing their menus. Check back soon!</p>
        </div>
      )}

      {/* Posts grid */}
      {!loading && !error && posts.length > 0 && (
        <>
          {/* Results count */}
          <p className={styles.resultsCount}>
            Showing {(currentPage - 1) * POSTS_PER_PAGE + 1}–{Math.min(currentPage * POSTS_PER_PAGE, posts.length)} of {posts.length} dishes
          </p>

          <div className={styles.grid}>
            {paginatedPosts.map(post => (
              <div key={post.id} className={styles.card}>

                <div className={styles.cardImageArea}>
                  {post.imageUrl ? (
                    <img src={post.imageUrl} alt={post.title} className={styles.cardImg} />
                  ) : (
                    <div className={styles.cardImgPlaceholder}>
                      <IconToolsKitchen2 size={40} stroke={1} />
                    </div>
                  )}
                  {post.isLive && (
                    <div className={styles.liveBadge}>
                      <span className={styles.liveDot} />
                      Live
                    </div>
                  )}
                </div>

                <div className={styles.cardBody}>
                  <h3 className={styles.cardTitle}>{post.title}</h3>

                  {post.chef?.cuisineType && (
                    <span className={styles.cuisineTag}>{post.chef.cuisineType}</span>
                  )}

                  <p className={styles.cardDescription}>{post.description}</p>

                  <div className={styles.cardMeta}>
                    <div className={styles.chefInfo}>
                      <span className={styles.chefName}>{post.author?.name}</span>
                      {post.chef?.location && (
                        <span className={styles.chefLocation}>
                          <IconMapPin size={11} stroke={1.5} />
                          {post.chef.location}
                        </span>
                      )}
                    </div>
                    <span className={styles.price}>₹{post.price}</span>
                  </div>

                  <button
                    className={`${styles.orderBtn} ${post.isLive ? styles.orderBtnLive : ''}`}
                    disabled={orderingId === post.id}
                    onClick={() => handleOrder(post)}
                  >
                    {orderingId === post.id ? (
                      <span className={styles.btnSpinner} />
                    ) : post.isLive ? (
                      <><IconRadioactive size={15} stroke={1.5} /> Order &amp; Watch Live</>
                    ) : (
                      <><IconEye size={15} stroke={1.5} /> View &amp; Order</>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={styles.pageNavBtn}
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <IconChevronLeft size={16} stroke={2} /> Prev
              </button>

              <div className={styles.pageNumbers}>
                {getPageNumbers(currentPage, totalPages).map((page, i) =>
                  page === '...' ? (
                    <span key={`ellipsis-${i}`} className={styles.ellipsis}>…</span>
                  ) : (
                    <button
                      key={page}
                      className={`${styles.pageBtn} ${page === currentPage ? styles.pageBtnActive : ''}`}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                className={styles.pageNavBtn}
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next <IconChevronRight size={16} stroke={2} />
              </button>
            </div>
          )}
        </>
      )}

      {modal && (
        <Modal
          type={modal.type}
          title={modal.title}
          message={modal.message}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}

export default CustomerFeed