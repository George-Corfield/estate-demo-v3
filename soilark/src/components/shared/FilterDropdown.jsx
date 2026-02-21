export default function FilterDropdown({ label, value, options, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="form-select"
      style={{ width: 'auto', paddingRight: 32 }}
    >
      <option value="all">{label}</option>
      {options.map((opt) => (
        <option key={opt.value || opt} value={opt.value || opt}>
          {opt.label || opt}
        </option>
      ))}
    </select>
  )
}
