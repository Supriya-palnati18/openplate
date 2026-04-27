import { useState, useEffect, useCallback } from 'react'
import { togglePublish, deletePost } from '../../../services/postService'
import { getMyProfile } from '../../../services/chefService'
import {
  IconToolsKitchen2,
  IconEye,
  IconEyeOff,
  IconTrash,
  IconVideo,
  IconRadioactive,
  IconX
} from '@tabler/icons-react'
import CreatePostForm from './CreatePostForm'
import Button from '../../../components/ui/Button'
import Modal from '../../../components/ui/Modal'
import styles from './PostsSection.module.css'

function SkeletonCard() {
  return (
    <div className={styles.skCard}>
      <div className={styles.skBadgeRow}>
        <div className={`${styles.skBadge} skeleton`} />
        <div className={`${styles.skBadge} skeleton`} />
      </div>
      <div className={`${styles.skTitle} skeleton`} />
      <div className={`${styles.skPrice} skeleton`} />
      <div className={styles.skDivider} />
      <div className={styles.skActionRow}>
        <div className={`${styles.skAction} skeleton`} />
        <div className={`${styles.skAction} skeleton`} />
      </div>
    </div>
  )
}

function PostsSection() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [deleteModal, setDeleteModal] = useState(null)
  const [togglingId, setTogglingId] = useState(null)

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await getMyProfile()
      setPosts(data.profile.posts || [])
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchPosts() }, [fetchPosts])

  const handleTogglePublish = async (postId) => {
    setTogglingId(postId)
    try {
      await togglePublish(postId)
      fetchPosts()
    } catch {
      // silent
    } finally {
      setTogglingId(null)
    }
  }

  const handleDelete = async (postId) => {
    try {
      await deletePost(postId)
      setDeleteModal(null)
      fetchPosts()
    } catch {
      // silent
    }
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>My dishes</h2>
        <Button variant="primary" size="small" onClick={() => setShowForm(true)}>
          + Add dish
        </Button>
      </div>

      {loading ? (
        <div className={styles.grid}>
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : posts.length === 0 ? (
        <div className={styles.empty}>
          <IconToolsKitchen2 size={40} stroke={1} className={styles.emptyIcon} />
          <p className={styles.emptyTitle}>No dishes yet</p>
          <p className={styles.emptyText}>Click "Add dish" to create your first dish.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {posts.map(post => (
            <div key={post.id} className={styles.postCard}>
              <div className={styles.cardTop}>
                <span className={`${styles.typeBadge} ${post.isLive ? styles.typeLive : styles.typeVideo}`}>
                  {post.isLive
                    ? <><IconRadioactive size={12} stroke={1.5} /> Live</>
                    : <><IconVideo size={12} stroke={1.5} /> Video</>
                  }
                </span>
                <span className={`${styles.statusBadge} ${post.isPublished ? styles.statusPublished : styles.statusDraft}`}>
                  {post.isPublished ? 'Published' : 'Draft'}
                </span>
              </div>

              <div className={styles.cardBody}>
                <p className={styles.postTitle}>{post.title}</p>
                <p className={styles.postPrice}>₹{post.price}</p>
              </div>

              <div className={styles.cardActions}>
                <button
                  className={`${styles.actionBtn} ${post.isPublished ? styles.actionUnpublish : styles.actionPublish}`}
                  disabled={togglingId === post.id}
                  onClick={() => handleTogglePublish(post.id)}
                >
                  {post.isPublished
                    ? <><IconEyeOff size={14} stroke={1.5} /> Unpublish</>
                    : <><IconEye size={14} stroke={1.5} /> Publish</>
                  }
                </button>
                <button
                  className={`${styles.actionBtn} ${styles.actionDelete}`}
                  onClick={() => setDeleteModal(post.id)}
                >
                  <IconTrash size={14} stroke={1.5} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add dish modal */}
      {showForm && (
        <div className={styles.modalOverlay} onClick={() => setShowForm(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>Add new dish</h3>
              <button className={styles.modalClose} onClick={() => setShowForm(false)}>
                <IconX size={20} stroke={1.5} />
              </button>
            </div>
            <div className={styles.modalBody}>
              <CreatePostForm
                showTitle={false}
                onPostCreated={() => { setShowForm(false); fetchPosts() }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deleteModal && (
        <Modal
          type="warning"
          title="Delete dish?"
          message="This action cannot be undone. All orders for this dish will also be affected."
          onClose={() => setDeleteModal(null)}
          onConfirm={() => handleDelete(deleteModal)}
          confirmText="Delete"
        />
      )}
    </div>
  )
}

export default PostsSection