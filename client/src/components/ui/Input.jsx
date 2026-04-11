import styles from './Input.module.css'

function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  name
}) {
  return (
    <div className={styles.wrapper}>
      {label && (
        <label className={styles.label}>{label}</label>
      )}
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`${styles.input} ${error ? styles.error : ''}`}
      />
      {error && (
        <span className={styles.errorText}>{error}</span>
      )}
    </div>
  )
}

export default Input