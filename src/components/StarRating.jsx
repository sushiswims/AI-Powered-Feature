export default function StarRating({ value, onChange, readonly = false }) {
  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => !readonly && onChange && onChange(star)}
          style={{
            fontSize: '1.2rem',
            cursor: readonly ? 'default' : 'pointer',
            color: star <= value ? '#f5c518' : '#444',
            transition: 'color 0.15s',
          }}
        >
          ★
        </span>
      ))}
    </div>
  )
}
