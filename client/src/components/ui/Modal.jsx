import {
  IconCircleCheck,
  IconCircleX,
  IconAlertTriangle,
  IconInfoCircle,
  IconX,
} from '@tabler/icons-react'
import styles from './Modal.module.css'

const typeConfig = {
  success: { Icon: IconCircleCheck, colorVar: 'var(--success)' },
  error:   { Icon: IconCircleX,     colorVar: 'var(--error)' },
  warning: { Icon: IconAlertTriangle, colorVar: 'var(--warning)' },
  info:    { Icon: IconInfoCircle,  colorVar: 'var(--primary)' },
}

function Modal({ type = 'info', title, message, onClose, onConfirm, confirmText = 'OK', cancelText = 'Cancel' }) {
  const { Icon, colorVar } = typeConfig[type] || typeConfig.info

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        {/* Close button */}
        <button className={styles.closeBtn} onClick={onClose}>
          <IconX size={16} stroke={2} />
        </button>

        {/* Icon */}
        <div className={styles.iconWrap} style={{ color: colorVar, background: `color-mix(in srgb, ${colorVar} 10%, transparent)` }}>
          <Icon size={28} stroke={1.5} />
        </div>

        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>

        <div className={styles.actions}>
          {onConfirm ? (
            <>
              <button className={styles.cancelBtn} onClick={onClose}>
                {cancelText}
              </button>
              <button
                className={styles.confirmBtn}
                style={{ background: colorVar }}
                onClick={onConfirm}
              >
                {confirmText}
              </button>
            </>
          ) : (
            <button
              className={styles.confirmBtn}
              style={{ background: colorVar }}
              onClick={onClose}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Modal