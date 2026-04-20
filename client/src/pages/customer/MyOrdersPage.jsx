import { useState, useEffect } from 'react'
import { getMyOrders, cancelOrder } from '../../services/orderService'
import Button from '../../components/ui/Button'
import Modal from '../../components/ui/Modal'
import styles from './MyOrdersPage.module.css'

function MyOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelModal, setCancelModal] = useState(null)
  const [actionId, setActionId] = useState(null)

  const fetchOrders = async () => {
    try {
      const { data } = await getMyOrders()
      setOrders(data.orders)
    } catch {
      console.error('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [])

  const handleCancel = async (orderId) => {
    setActionId(orderId)
    try {
      await cancelOrder(orderId)
      setCancelModal(null)
      fetchOrders()
    } catch {
      console.error('Failed to cancel order')
    } finally {
      setActionId(null)
    }
  }

  const getStatusClass = (status) => {
    const map = {
      PENDING: styles.statusPending,
      CONFIRMED: styles.statusConfirmed,
      COMPLETED: styles.statusCompleted,
      CANCELLED: styles.statusCancelled
    }
    return map[status] || ''
  }

  if (loading) {
    return <div className={styles.loading}>Loading orders...</div>
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Orders</h1>
        <p className={styles.subtitle}>
          Track your orders and live sessions
        </p>
      </div>

      {orders.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📦</div>
          <p className={styles.emptyText}>No orders yet</p>
          <p>Browse the feed and place your first order</p>
        </div>
      ) : (
        <div className={styles.list}>
          {orders.map(order => (
            <div key={order.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>
                  {order.post?.title}
                </span>
                <span className={`${styles.statusBadge} ${getStatusClass(order.status)}`}>
                  {order.status}
                </span>
              </div>

              {order.liveSession && (
                <div className={styles.sessionBadge}>
                  🔴 Live session: {order.liveSession.status}
                </div>
              )}

              <div className={styles.cardMeta}>
                <span className={styles.metaItem}>
                  <span className={styles.metaLabel}>Amount: </span>
                  ₹{order.amount}
                </span>
                <span className={styles.metaItem}>
                  <span className={styles.metaLabel}>Order ID: </span>
                  #{order.id}
                </span>
                <span className={styles.metaItem}>
                  <span className={styles.metaLabel}>Date: </span>
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className={styles.cardActions}>
                {order.status === 'PENDING' && (
                  <Button
                    variant="ghost"
                    size="small"
                    disabled={actionId === order.id}
                    onClick={() => setCancelModal(order.id)}
                  >
                    Cancel Order
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {cancelModal && (
        <Modal
          icon="⚠️"
          title="Cancel this order?"
          message="Are you sure you want to cancel? This action cannot be undone."
          onClose={() => setCancelModal(null)}
          onConfirm={() => handleCancel(cancelModal)}
          confirmText="Yes, Cancel"
        />
      )}
    </div>
  )
}

export default MyOrdersPage