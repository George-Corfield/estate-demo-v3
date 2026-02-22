import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { CONTRACT_TYPES } from '../../data/staff'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PHONE_REGEX = /^[\d\s+()-]{7,}$/

export default function StaffCreateForm({ onCancel, onSave, editData }) {
  const { addStaff, updateStaff, showToast } = useApp()
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState({
    name: editData?.name || '',
    email: editData?.email || '',
    mobile: editData?.mobile || '',
    address: editData?.address || '',
    emergencyContactName: editData?.emergencyContact?.name || '',
    emergencyContactNumber: editData?.emergencyContact?.number || '',
    startDate: editData?.startDate || '',
    contractType: editData?.contractType || 'Full-Time',
    hoursPerWeek: editData?.hoursPerWeek != null ? String(editData.hoursPerWeek) : '',
    hourlyRate: editData?.hourlyRate != null ? String(editData.hourlyRate) : '',
  })

  const update = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: null }))
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Full name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!EMAIL_REGEX.test(form.email)) errs.email = 'Enter a valid email address'
    if (!form.mobile.trim()) errs.mobile = 'Mobile is required'
    else if (!PHONE_REGEX.test(form.mobile)) errs.mobile = 'Enter a valid phone number'
    if (!form.address.trim()) errs.address = 'Address is required'
    if (!form.emergencyContactName.trim()) errs.emergencyContactName = 'Emergency contact name is required'
    if (!form.emergencyContactNumber.trim()) errs.emergencyContactNumber = 'Emergency contact number is required'
    else if (!PHONE_REGEX.test(form.emergencyContactNumber)) errs.emergencyContactNumber = 'Enter a valid phone number'
    if (!form.startDate) errs.startDate = 'Start date is required'
    if (!form.hoursPerWeek) errs.hoursPerWeek = 'Hours per week is required'
    if (!form.hourlyRate) errs.hourlyRate = 'Hourly rate is required'
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    const initials = form.name.trim().split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

    const memberData = {
      name: form.name.trim(),
      email: form.email.trim(),
      mobile: form.mobile.trim(),
      address: form.address.trim(),
      emergencyContact: { name: form.emergencyContactName.trim(), number: form.emergencyContactNumber.trim() },
      startDate: form.startDate,
      contractType: form.contractType,
      hoursPerWeek: parseFloat(form.hoursPerWeek),
      hourlyRate: parseFloat(form.hourlyRate),
      initials,
    }

    if (editData) {
      updateStaff(editData.id, memberData)
      showToast(`${memberData.name} updated`)
    } else {
      addStaff({
        id: `staff-${Date.now()}`,
        ...memberData,
        role: '',
        status: 'On Site',
        team: '',
        permissionLevel: 'Standard',
        profilePic: null,
        documents: [],
      })
      showToast(`${memberData.name} added to staff`)
    }
    onSave()
  }

  return (
    <form onSubmit={handleSubmit} className="card flex flex-col gap-4">
      <h3 className="text-heading-4" style={{ color: 'var(--color-ink-900)', margin: 0 }}>
        {editData ? 'Edit Staff Member' : 'Add Staff Member'}
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Full Name *" error={errors.name}>
          <input type="text" value={form.name} onChange={e => update('name', e.target.value)} placeholder="e.g. John Smith" className="form-input" style={errors.name ? { borderColor: 'var(--color-ochre-400)' } : undefined} />
        </FormField>
        <FormField label="Email *" error={errors.email}>
          <input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="e.g. john@example.com" className="form-input" style={errors.email ? { borderColor: 'var(--color-ochre-400)' } : undefined} />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Mobile *" error={errors.mobile}>
          <input type="tel" value={form.mobile} onChange={e => update('mobile', e.target.value)} placeholder="e.g. 07700 900123" className="form-input" style={errors.mobile ? { borderColor: 'var(--color-ochre-400)' } : undefined} />
        </FormField>
        <FormField label="Address *" error={errors.address}>
          <input type="text" value={form.address} onChange={e => update('address', e.target.value)} placeholder="Full address" className="form-input" style={errors.address ? { borderColor: 'var(--color-ochre-400)' } : undefined} />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Emergency Contact Name *" error={errors.emergencyContactName}>
          <input type="text" value={form.emergencyContactName} onChange={e => update('emergencyContactName', e.target.value)} placeholder="Contact name" className="form-input" style={errors.emergencyContactName ? { borderColor: 'var(--color-ochre-400)' } : undefined} />
        </FormField>
        <FormField label="Emergency Contact Number *" error={errors.emergencyContactNumber}>
          <input type="tel" value={form.emergencyContactNumber} onChange={e => update('emergencyContactNumber', e.target.value)} placeholder="Contact number" className="form-input" style={errors.emergencyContactNumber ? { borderColor: 'var(--color-ochre-400)' } : undefined} />
        </FormField>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <FormField label="Start Date *" error={errors.startDate}>
          <input type="date" value={form.startDate} onChange={e => update('startDate', e.target.value)} className="form-input" style={errors.startDate ? { borderColor: 'var(--color-ochre-400)' } : undefined} />
        </FormField>
        <FormField label="Contract Type *">
          <select value={form.contractType} onChange={e => update('contractType', e.target.value)} className="form-select">
            {CONTRACT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </FormField>
        <div className="grid grid-cols-2 gap-3">
          <FormField label="Hours/Week *" error={errors.hoursPerWeek}>
            <input type="number" step="0.5" value={form.hoursPerWeek} onChange={e => update('hoursPerWeek', e.target.value)} placeholder="40" className="form-input" style={{ ...(errors.hoursPerWeek ? { borderColor: 'var(--color-ochre-400)' } : {}), fontFamily: 'var(--font-mono)' }} />
          </FormField>
          <FormField label="£/Hour *" error={errors.hourlyRate}>
            <input type="number" step="0.01" value={form.hourlyRate} onChange={e => update('hourlyRate', e.target.value)} placeholder="12.00" className="form-input" style={{ ...(errors.hourlyRate ? { borderColor: 'var(--color-ochre-400)' } : {}), fontFamily: 'var(--font-mono)' }} />
          </FormField>
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="btn btn-secondary">Cancel</button>
        <button type="submit" className="btn btn-primary">Save</button>
      </div>
    </form>
  )
}

function FormField({ label, error, children }) {
  return (
    <div>
      <label className="form-label">{label}</label>
      {children}
      {error && <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--color-ochre-500)', margin: '4px 0 0' }}>{error}</p>}
    </div>
  )
}
