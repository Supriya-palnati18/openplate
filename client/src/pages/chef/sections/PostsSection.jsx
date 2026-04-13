import { useState, useEffect } from 'react'
import { getChefOrders } from '../../../services/orderService'
import { togglePublish, deletePost } from '../../../services/postService'
import CreatePostForm from './CreatePostForm'
import Button from '../../../components/ui/Button'
import Modal from '../../../components/ui/Modal'
import styles from './PostsSection.module.css'
import { getMyProfile } from '../../../services/chefService'

function PostsSection() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [deleteModal, setDeleteModal] = useState(null)

  const fetchPosts = async () => {
    try {
      const { data } = await getMyProfile()
      setPosts(data.profile.posts || [])
    } catch {
      console.error('Failed to fetch posts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPosts() }, [])

  const handleTogglePublish = async (postId) => {
    try {
      await togglePublish(postId)
      fetchPosts()
    } catch {
      console.error('Failed to toggle publish')
    }
  }

  const handleDelete = async (postId) => {
    try {
      await deletePost(postId)
      setDeleteModal(null)
      fetchPosts()
    } catch {
      console.error('Failed to delete post')
    }
  }

  const handlePostCreated = () => {
    setShowForm(false)
    fetchPosts()
  }

  if (loading) return <div>Loading...</div>

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>My dishes</h2>
        <Button
          variant="primary"
          size="small"
          onClick={() => setShowForm(prev => !prev)}
        >
          {showForm ? 'Cancel' : '+ Add dish'}
        </Button>
      </div>

      {showForm && (
        <CreatePostForm onPostCreated={handlePostCreated} />
      )}

      {posts.length === 0 ? (
        <div className={styles.empty}>
          No dishes yet. Add your first dish above.
        </div>
      ) : (
        posts.map(post => (
          <div key={post.id} className={styles.postCard}>
            <div className={styles.postInfo}>
              <p className={styles.postTitle}>{post.title}</p>
              <div className={styles.postMeta}>
                <span className={styles.postPrice}>₹{post.price}</span>
                <span className={`${styles.badge} ${post.isPublished ? styles.badgePublished : styles.badgeDraft}`}>
                  {post.isPublished ? 'Published' : 'Draft'}
                </span>
                {post.isLive && (
                  <span className={`${styles.badge} ${styles.badgeLive}`}>
                    🔴 Live
                  </span>
                )}
              </div>
            </div>
            <div className={styles.postActions}>
              <Button
                variant="secondary"
                size="small"
                onClick={() => handleTogglePublish(post.id)}
              >
                {post.isPublished ? 'Unpublish' : 'Publish'}
              </Button>
              <Button
                variant="ghost"
                size="small"
                onClick={() => setDeleteModal(post.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))
      )}

      {deleteModal && (
        <Modal
          icon="⚠️"
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