import StaffDetailView from './StaffDetailView'

export default function MobileStaffDetail({ staffId, onBack }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: 'var(--color-surface-50)' }}>
      <StaffDetailView staffId={staffId} onClose={onBack} />
    </div>
  )
}
