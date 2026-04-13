import { useState, useEffect } from 'react'
import { getChefOrders, confirmOrder, cancelOrder } from '../../../services/orderService'
import { startSession, endSession } from '../../../services/sessionService'
import Button from '../../../components/ui/Button'
import styles from './OrdersSection.module.css'

function OrdersSection() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionId, setActionId] = useState(null)

  const fetchOrders = async () => {
    try {
      const { data } = await getChefOrders()
      setOrders(data.orders)
    } catch {
      console.error('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchOrders() }, [])

  const handleConfirm = async (orderId) => {
    setActionId(orderId)
    try {
      await confirmOrder(orderId)
      fetchOrders()
    } catch {
      console.error('Failed to confirm order')
    } finally {
      setActionId(null)
    }
  }

  const handleCancel = async (orderId) => {
    setActionId(orderId)
    try {
      await cancelOrder(orderId)
      fetchOrders()
    } catch {
      console.error('Failed to cancel order')
    } finally {
      setActionId(null)
    }
  }

  const handleStartSession = async (sessionId) => {
    setActionId(sessionId)
    try {
      await startSession(sessionId)
      fetchOrders()
    } catch {
      console.error('Failed to start session')
    } finally {
      setActionId(null)
    }
  }

  const handleEndSession = async (sessionId) => {
    setActionId(sessionId)
    try {
      await endSession(sessionId)
      fetchOrders()
    } catch {
      console.error('Failed to end session')
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

  if (loading) return <div>Loading orders...</div>

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Incoming orders</h2>

      {orders.length === 0 ? (
        <div className={styles.empty}>
          No orders yet. Publish your dishes to start receiving orders.
        </div>
      ) : (
        orders.map(order => (
          <div key={order.id} className={styles.orderCard}>
            <div className={styles.orderHeader}>
              <span className={styles.orderTitle}>
                {order.post?.title}
              </span>
              <span className={`${styles.statusBadge} ${getStatusClass(order.status)}`}>
                {order.status}
              </span>
            </div>

            <div className={styles.orderMeta}>
              <span className={styles.metaItem}>
                <span className={styles.metaLabel}>Customer: </span>
                {order.customer?.name}
              </span>
              <span className={styles.metaItem}>
                <span className={styles.metaLabel}>Amount: </span>
                ₹{order.amount}
              </span>
              <span className={styles.metaItem}>
                <span className={styles.metaLabel}>Type: </span>
                {order.post?.isLive ? '🔴 Live' : '🎬 Video'}
              </span>
            </div>

            <div className={styles.orderActions}>
              {order.status === 'PENDING' && (
                <>
                  <Button
                    variant="primary"
                    size="small"
                    disabled={actionId === order.id}
                    onClick={() => handleConfirm(order.id)}
                  >
                    Confirm
                  </Button>
                  <Button
                    variant="ghost"
                    size="small"
                    disabled={actionId === order.id}
                    onClick={() => handleCancel(order.id)}
                  >
                    Cancel
                  </Button>
                </>
              )}

              {order.status === 'CONFIRMED' && order.liveSession && (
                <>
                  {order.liveSession.status === 'SCHEDULED' && (
                    <Button
                      variant="primary"
                      size="small"
                      disabled={actionId === order.liveSession.id}
                      onClick={() => handleStartSession(order.liveSession.id)}
                    >
                      🔴 Go Live
                    </Button>
                  )}
                  {order.liveSession.status === 'LIVE' && (
                    <Button
                      variant="secondary"
                      size="small"
                      disabled={actionId === order.liveSession.id}
                      onClick={() => handleEndSession(order.liveSession.id)}
                    >
                      End Session
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default OrdersSection