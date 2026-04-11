import styles from './Button.module.css'

function Button({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button'
}) {
  return (
    <button
      type={type}
      className={`
        ${styles.button} 
        ${styles[variant]} 
        ${styles[size]}
        ${fullWidth ? styles.fullWidth : ''}
      `}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button