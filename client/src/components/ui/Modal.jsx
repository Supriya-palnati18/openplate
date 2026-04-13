import Button from './Button'
import styles from './Modal.module.css'

function Modal({ icon, title, message, onClose, onConfirm, confirmText = 'OK' }) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          {onConfirm ? (
            <>
              <Button variant="secondary" onClick={onClose}>Cancel</Button>
              <Button variant="primary" onClick={onConfirm}>{confirmText}</Button>
            </>
          ) : (
            <Button variant="primary" onClick={onClose}>{confirmText}</Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Modal