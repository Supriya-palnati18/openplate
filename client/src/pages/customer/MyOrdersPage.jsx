import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyOrders, cancelOrder } from '../../services/orderService'
import Modal from '../../components/ui/Modal'
import {
  IconShoppingBag,
  IconAlertCircle,
  IconRefresh,
  IconCalendar,
  IconReceipt,
  IconClock,
  IconCircleCheck,
  IconCheck,
  IconX,
  IconRadioactive,
} from '@tabler/icons-react'
import styles from './MyOrdersPage.module.css'

const STATUS_LABEL = {
  PENDING:   'Pending',
  CONFIRMED: 'Confirmed',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
}

const SESSION_LABEL = {
  SCHEDULED: 'Session scheduled',
  LIVE:      'Live now',
  ENDED:     'Session ended',
}

const STATUS_ICON = {
  PENDING:   IconClock,
  CONFIRMED: IconCheck,
  COMPLETED: IconCircleCheck,
  CANCELLED: IconX,
}

function SkeletonCard() {
  return (
    <div className={styles.skCard}>
      <div className={`skeleton ${styles.skBadge}`} />
      <div className={`skeleton ${styles.skTitle}`} />
      <div className={`skeleton ${styles.skTag}`} />
      <div className={`skeleton ${styles.skMeta}`} />
    </div>
  )
}

function MyOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [cancelModal, setCancelModal] = useState(null)
  const [actionId, setActionId] = useState(null)
  const navigate = useNavigate()

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await getMyOrders()
      setOrders(data.orders)
    } catch {
      setError('Failed to load your orders. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const handleCancel = async (orderId) => {
    setActionId(orderId)
    try {
      await cancelOrder(orderId)
      setCancelModal(null)
      fetchOrders()
    } catch {
      setCancelModal(null)
    } finally {
      setActionId(null)
    }
  }

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric'
    })

  return (
    <div className={styles.page}>

      <div className={styles.header}>
        <h1 className={styles.title}>My Orders</h1>
        <p className={styles.subtitle}>Track your orders and live sessions</p>
      </div>

      {/* Loading */}
      {loading && (
        <div className={styles.grid}>
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className={styles.centerState}>
          <div className={styles.errorIconWrap}>
            <IconAlertCircle size={36} stroke={1.5} />
          </div>
          <h3 className={styles.stateTitle}>Something went wrong</h3>
          <p className={styles.stateMsg}>{error}</p>
          <button className={styles.actionBtn} onClick={fetchOrders}>
            <IconRefresh size={15} stroke={2} /> Try again
          </button>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && orders.length === 0 && (
        <div className={styles.centerState}>
          <div className={styles.emptyIconWrap}>
            <IconShoppingBag size={40} stroke={1} />
          </div>
          <h3 className={styles.stateTitle}>No orders yet</h3>
          <p className={styles.stateMsg}>Browse the feed and place your first order</p>
          <button className={styles.actionBtn} onClick={() => navigate('/feed')}>
            Browse Feed
          </button>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && orders.length > 0 && (
        <div className={styles.grid}>
          {orders.map(order => {
            const StatusIcon = STATUS_ICON[order.status] || IconClock
            const isLiveSession = order.liveSession?.status === 'LIVE'

            return (
              <div key={order.id} className={styles.card}>

                {/* Status badge */}
                <div className={styles.cardTop}>
                  <span className={`${styles.statusBadge} ${styles[`status${order.status}`]}`}>
                    <StatusIcon size={11} stroke={2} />
                    {STATUS_LABEL[order.status]}
                  </span>
                </div>

                {/* Title */}
                <h3 className={styles.cardTitle}>{order.post?.title}</h3>

                {/* Cuisine tag */}
                {order.post?.chef?.cuisineType && (
                  <span className={styles.cuisineTag}>
                    {order.post.chef.cuisineType}
                  </span>
                )}

                {/* Live session */}
                {order.liveSession && (
                  <div className={`${styles.sessionRow} ${isLiveSession ? styles.sessionLive : ''}`}>
                    {isLiveSession && <span className={styles.liveDot} />}
                    <IconRadioactive size={12} stroke={1.5} />
                    {SESSION_LABEL[order.liveSession.status] || order.liveSession.status}
                  </div>
                )}

                {/* Meta */}
                <div className={styles.metaRow}>
                  <span className={styles.metaItem}>
                    <IconReceipt size={12} stroke={1.5} />
                    ₹{order.amount}
                  </span>
                  <span className={styles.metaDot} />
                  <span className={styles.metaItem}>#{order.id}</span>
                  <span className={styles.metaDot} />
                  <span className={styles.metaItem}>
                    <IconCalendar size={12} stroke={1.5} />
                    {formatDate(order.createdAt)}
                  </span>
                </div>

                {/* Cancel action */}
                {order.status === 'PENDING' && (
                  <div className={styles.cardActions}>
                    <button
                      className={styles.cancelBtn}
                      disabled={actionId === order.id}
                      onClick={() => setCancelModal(order.id)}
                    >
                      {actionId === order.id
                        ? <span className={styles.btnSpinner} />
                        : <><IconX size={12} stroke={2} /> Cancel Order</>
                      }
                    </button>
                  </div>
                )}

              </div>
            )
          })}
        </div>
      )}

      {cancelModal && (
        <Modal
          type="warning"
          title="Cancel this order?"
          message="Are you sure you want to cancel? This cannot be undone."
          onClose={() => setCancelModal(null)}
          onConfirm={() => handleCancel(cancelModal)}
          confirmText="Yes, Cancel"
          cancelText="Keep Order"
        />
      )}

    </div>
  )
}

export default MyOrdersPage