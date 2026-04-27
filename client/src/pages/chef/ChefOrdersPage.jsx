import { useState, useEffect, useCallback } from 'react'
import { getChefOrders, confirmOrder, cancelOrder } from '../../services/orderService'
import { startSession, endSession } from '../../services/sessionService'
import {
  IconClipboardList,
  IconShoppingBag,
  IconClock,
  IconCircleCheck,
  IconUser,
  IconVideo,
  IconRadioactive,
  IconAlertCircle
} from '@tabler/icons-react'
import Button from '../../components/ui/Button'
import styles from './ChefOrdersPage.module.css'

const STATUS_LABEL = {
  PENDING:   'Pending',
  CONFIRMED: 'Confirmed',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled'
}

const STATUS_CLASS = {
  PENDING:   'statusPending',
  CONFIRMED: 'statusConfirmed',
  COMPLETED: 'statusCompleted',
  CANCELLED: 'statusCancelled'
}

function SkeletonCard() {
  return (
    <div className={styles.skCard}>
      <div className={styles.skHeader}>
        <div className={`${styles.skLine} ${styles.skLineLong} skeleton`} />
        <div className={`${styles.skBadge} skeleton`} />
      </div>
      <div className={`${styles.skLine} ${styles.skLineMed} skeleton`} />
      <div className={styles.skMeta}>
        <div className={`${styles.skLine} ${styles.skLineShort} skeleton`} />
        <div className={`${styles.skLine} ${styles.skLineShort} skeleton`} />
      </div>
      <div className={styles.skDivider} />
      <div className={styles.skActions}>
        <div className={`${styles.skBtn} skeleton`} />
        <div className={`${styles.skBtn} skeleton`} />
      </div>
    </div>
  )
}

function ChefOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionId, setActionId] = useState(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await getChefOrders()
      setOrders(data.orders)
    } catch {
      setError('Failed to load orders. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const withAction = async (id, fn) => {
    setActionId(id)
    try { await fn(); fetchOrders() }
    catch { /* silent */ }
    finally { setActionId(null) }
  }

  const total     = orders.length
  const pending   = orders.filter(o => o.status === 'PENDING').length
  const completed = orders.filter(o => o.status === 'COMPLETED').length

  const statCards = [
    { value: total,     label: 'Total orders',     Icon: IconShoppingBag,  cls: 'iconTotal' },
    { value: pending,   label: 'Pending',           Icon: IconClock,        cls: 'iconPending' },
    { value: completed, label: 'Delivered',         Icon: IconCircleCheck,  cls: 'iconCompleted' },
  ]

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Orders</h1>
        <p className={styles.subtitle}>Manage and respond to incoming orders</p>
      </div>

      <div className={styles.stats}>
        {statCards.map(({ value, label, Icon, cls }) => (
          <div key={label} className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles[cls]}`}>
              <Icon size={22} stroke={1.5} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statValue}>{loading ? '—' : value}</span>
              <span className={styles.statLabel}>{label}</span>
            </div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className={styles.grid}>
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <div className={styles.errorBox}>
          <IconAlertCircle size={20} stroke={1.5} />
          <p>{error}</p>
          <Button variant="secondary" size="small" onClick={fetchOrders}>Retry</Button>
        </div>
      ) : orders.length === 0 ? (
        <div className={styles.empty}>
          <IconClipboardList size={40} stroke={1} className={styles.emptyIcon} />
          <p className={styles.emptyTitle}>No orders yet</p>
          <p className={styles.emptyText}>Publish your dishes to start receiving orders.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {orders.map(order => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.cardHeader}>
                <span className={styles.dishName}>{order.post?.title}</span>
                <span className={`${styles.statusBadge} ${styles[STATUS_CLASS[order.status]]}`}>
                  {STATUS_LABEL[order.status] || order.status}
                </span>
              </div>

              <div className={styles.typeRow}>
                {order.post?.isLive
                  ? <><IconRadioactive size={14} stroke={1.5} className={styles.liveIcon} /> Live cooking</>
                  : <><IconVideo size={14} stroke={1.5} className={styles.videoIcon} /> Video post</>
                }
              </div>

              <div className={styles.metaRow}>
                <span className={styles.metaItem}>
                  <IconUser size={14} stroke={1.5} />
                  {order.customer?.name}
                </span>
                <span className={styles.metaPrice}>₹{order.amount}</span>
              </div>

              <div className={styles.cardActions}>
                {order.status === 'PENDING' && (
                  <>
                    <Button
                      variant="primary"
                      size="small"
                      disabled={actionId === order.id}
                      onClick={() => withAction(order.id, () => confirmOrder(order.id))}
                    >
                      Confirm
                    </Button>
                    <Button
                      variant="ghost"
                      size="small"
                      disabled={actionId === order.id}
                      onClick={() => withAction(order.id, () => cancelOrder(order.id))}
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
                        onClick={() => withAction(order.liveSession.id, () => startSession(order.liveSession.id))}
                      >
                        🔴 Go Live
                      </Button>
                    )}
                    {order.liveSession.status === 'LIVE' && (
                      <Button
                        variant="secondary"
                        size="small"
                        disabled={actionId === order.liveSession.id}
                        onClick={() => withAction(order.liveSession.id, () => endSession(order.liveSession.id))}
                      >
                        End Session
                      </Button>
                    )}
                  </>
                )}

                {(order.status === 'COMPLETED' || order.status === 'CANCELLED') && (
                  <span className={styles.closedLabel}>
                    {order.status === 'COMPLETED' ? 'Order delivered' : 'Order cancelled'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ChefOrdersPage