import { useState, useMemo } from 'react'
import { useApp } from '../../context/AppContext'
import { initialStaff } from '../../data/staff'
import { formatGBP } from '../../utils/currency'
import {
  PLANTING_SUBTYPES,
  CROP_OPTIONS,
  SEED_RATE_UNITS,
  SEED_SOURCES,
  ESTABLISHMENT_METHODS,
  HEDGE_PLANTS,
  HEDGE_ROWS,
  HEDGE_PROTECTION,
  HEDGE_SOURCES,
  TREE_SPECIES,
  TREE_STOCK_TYPES,
  TREE_PATTERNS,
  TREE_PROTECTION,
  TREE_SOURCES,
  LABOUR_TYPES,
  LABOUR_PRICING_METHODS,
  LABOUR_PRICING_METHODS_TREES,
  LABOUR_PRICING_METHODS_HEDGES,
} from '../../constants/plantingOptions'

const TASK_TYPES = ['Planting', 'Harvesting', 'Fertilizing', 'Maintenance', 'Feeding', 'Irrigation']
const PRIORITIES = ['low', 'medium', 'high']

const toggleActiveStyle = {
  background: 'rgba(78,140,53,0.15)',
  color: 'var(--color-sage-500)',
  border: '1px solid rgba(78,140,53,0.3)',
}
const toggleInactiveStyle = {
  background: 'var(--color-parchment-50)',
  color: 'var(--color-earth-500)',
  border: '1px solid var(--color-parchment-300)',
}
const toggleBaseStyle = {
  padding: '6px 12px',
  borderRadius: 'var(--radius-sm)',
  fontSize: 12,
  fontFamily: 'var(--font-body)',
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'all 120ms ease',
}

const chipActiveStyle = {
  ...toggleBaseStyle,
  ...toggleActiveStyle,
}
const chipInactiveStyle = {
  ...toggleBaseStyle,
  ...toggleInactiveStyle,
}

export default function TaskCreateForm({
  selectedFieldIds,
  setSelectedFieldIds,
  dueDate,
  setDueDate,
  onCancel,
  onSave,
  onFocusDate,
}) {
  const { fields, addTask, showToast } = useApp()
  const [form, setForm] = useState({
    name: '',
    type: '',
    description: '',
    priority: 'medium',
    assignedTo: [],
  })

  // Planting subtype state
  const [plantingSubtype, setPlantingSubtype] = useState('')

  // Crop/Seed fields
  const [cropMix, setCropMix] = useState('')
  const [customCropMix, setCustomCropMix] = useState('')
  const [rate, setRate] = useState('')
  const [rateUnit, setRateUnit] = useState('kg/ha')
  const [seedSource, setSeedSource] = useState('')
  const [seedPrice, setSeedPrice] = useState('')
  const [establishmentMethod, setEstablishmentMethod] = useState('')

  // Hedge fields
  const [hedgePlant, setHedgePlant] = useState('')
  const [customHedgePlant, setCustomHedgePlant] = useState('')
  const [hedgeRows, setHedgeRows] = useState('Single Row')
  const [plantsPerMetre, setPlantsPerMetre] = useState('')
  const [hedgeProtection, setHedgeProtection] = useState('')
  const [plantSource, setPlantSource] = useState('')
  const [pricePerPlant, setPricePerPlant] = useState('')

  // Tree fields
  const [treeSpecies, setTreeSpecies] = useState('')
  const [customTreeSpecies, setCustomTreeSpecies] = useState('')
  const [treeQuantity, setTreeQuantity] = useState('')
  const [stockType, setStockType] = useState('')
  const [plantingPattern, setPlantingPattern] = useState('')
  const [treeProtection, setTreeProtection] = useState('')
  const [treeSource, setTreeSource] = useState('')
  const [pricePerTree, setPricePerTree] = useState('')

  // Labour fields
  const [labourEnabled, setLabourEnabled] = useState(false)
  const [labourType, setLabourType] = useState('')
  const [labourPricingMethod, setLabourPricingMethod] = useState('')
  const [labourRate, setLabourRate] = useState('')
  const [labourLength, setLabourLength] = useState('')

  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }))

  const toggleStaff = (name) => {
    setForm(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(name)
        ? prev.assignedTo.filter(n => n !== name)
        : [...prev.assignedTo, name],
    }))
  }

  const toggleField = (id) => {
    setSelectedFieldIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  // Auto-calculated values
  const totalAreaHa = useMemo(() => {
    return selectedFieldIds.reduce((sum, id) => {
      const f = fields.find(ff => ff.id === id)
      return sum + (f ? f.sizeHectares : 0)
    }, 0)
  }, [selectedFieldIds, fields])

  const totalSeedRequired = useMemo(() => {
    const r = parseFloat(rate) || 0
    if (rateUnit === 'kg/ha') return totalAreaHa * r
    return totalAreaHa * 10000 * r // seeds/m² → convert ha to m²
  }, [totalAreaHa, rate, rateUnit])

  const totalSeedCost = useMemo(() => {
    const p = parseFloat(seedPrice) || 0
    if (!p) return 0
    if (rateUnit === 'kg/ha') return totalSeedRequired / 1000 * p //convert kg to tonnes
    return totalSeedRequired * p
  }, [totalSeedRequired, seedPrice])

  const hedgeLength = useMemo(() => {
    return selectedFieldIds.reduce((sum, id) => {
      const f = fields.find(ff => ff.id === id)
      if (!f) return sum
      return sum + 4 * Math.sqrt(f.sizeHectares * 10000)
    }, 0)
  }, [selectedFieldIds, fields])

  const totalPlantsRequired = useMemo(() => {
    const ppm = parseFloat(plantsPerMetre) || 0
    const rowMultiplier = hedgeRows === 'Double Row' ? 2 : 1
    return Math.round(hedgeLength * ppm * rowMultiplier)
  }, [hedgeLength, plantsPerMetre, hedgeRows])

  const totalPlantCost = useMemo(() => {
    const p = parseFloat(pricePerPlant) || 0
    if (!p) return 0
    return totalPlantsRequired * p
  }, [totalPlantsRequired, pricePerPlant])

  const totalTreeCost = useMemo(() => {
    const q = parseInt(treeQuantity) || 0
    const p = parseFloat(pricePerTree) || 0
    if (!p) return 0
    return q * p
  }, [treeQuantity, pricePerTree])

  // Labour calculations
  const labourPricingOptions = useMemo(() => {
    if (form.type === 'Planting' && plantingSubtype === 'Trees') return LABOUR_PRICING_METHODS_TREES
    if (form.type === 'Planting' && plantingSubtype === 'Hedges') return LABOUR_PRICING_METHODS_HEDGES
    return LABOUR_PRICING_METHODS
  }, [form.type, plantingSubtype])

  const effectiveLabourLength = useMemo(() => {
    if (labourPricingMethod === 'Per Tree') return parseInt(treeQuantity) || 0
    if (labourPricingMethod === 'Per Plant / Whip') return totalPlantsRequired
    return parseFloat(labourLength) || 0
  }, [labourPricingMethod, treeQuantity, totalPlantsRequired, labourLength])

  const labourCost = useMemo(() => {
    return effectiveLabourLength * (parseFloat(labourRate) || 0)
  }, [effectiveLabourLength, labourRate])

  const taskSpecificCost = useMemo(() => {
    if (form.type !== 'Planting') return 0
    if (plantingSubtype === 'Crop/Seed') return totalSeedCost
    if (plantingSubtype === 'Hedges') return totalPlantCost
    if (plantingSubtype === 'Trees') return totalTreeCost
    return 0
  }, [form.type, plantingSubtype, totalSeedCost, totalPlantCost, totalTreeCost])

  const totalTaskCost = useMemo(() => {
    return taskSpecificCost + labourCost
  }, [taskSpecificCost, labourCost])

  // Build typeFields for submission
  const buildTypeFields = () => {
    let tf = {}

    if (form.type === 'Planting') {
      tf.plantingSubtype = plantingSubtype

      if (plantingSubtype === 'Crop/Seed') {
        tf.cropMix = cropMix === 'Other' ? customCropMix : cropMix
        tf.area = totalAreaHa
        tf.rate = parseFloat(rate) || 0
        tf.rateUnit = rateUnit
        tf.totalSeedRequired = totalSeedRequired
        tf.seedSource = seedSource
        if (parseFloat(seedPrice)) {
          tf.price = parseFloat(seedPrice)
          tf.totalSeedCost = totalSeedCost
        }
        tf.establishmentMethod = establishmentMethod
      } else if (plantingSubtype === 'Hedges') {
        tf.hedgePlant = hedgePlant === 'Other' ? customHedgePlant : hedgePlant
        tf.hedgeLength = Math.round(hedgeLength)
        tf.rows = hedgeRows
        tf.plantsPerMetre = parseFloat(plantsPerMetre) || 0
        tf.totalPlantsRequired = totalPlantsRequired
        tf.hedgeProtection = hedgeProtection
        tf.plantSource = plantSource
        if (parseFloat(pricePerPlant) && plantSource === 'Bought') {
          tf.pricePerPlant = parseFloat(pricePerPlant)
          tf.totalPlantCost = totalPlantCost
        }
      } else if (plantingSubtype === 'Trees') {
        tf.treeSpecies = treeSpecies === 'Other' ? customTreeSpecies : treeSpecies
        tf.quantity = parseInt(treeQuantity) || 0
        tf.stockType = stockType
        tf.plantingPattern = plantingPattern
        tf.treeProtection = treeProtection
        tf.treeSource = treeSource
        if (parseFloat(pricePerTree) && treeSource === 'Bought') {
          tf.pricePerTree = parseFloat(pricePerTree)
          tf.totalTreeCost = totalTreeCost
        }
      }
    }

    if (labourEnabled) {
      tf.labourEnabled = true
      tf.labourType = labourType
      tf.labourPricingMethod = labourPricingMethod
      tf.labourRate = parseFloat(labourRate) || 0
      tf.labourLength = effectiveLabourLength
      tf.labourCost = labourCost
      tf.totalTaskCost = totalTaskCost
    }

    return tf
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.name || !form.type || !dueDate || selectedFieldIds.length === 0) return

    addTask({
      id: `task-${Date.now()}`,
      name: form.name,
      type: form.type,
      status: 'todo',
      priority: form.priority,
      dueDate,
      description: form.description,
      assignedTo: form.assignedTo,
      assignedMachinery: [],
      fieldIds: selectedFieldIds,
      completedDate: null,
      typeFields: buildTypeFields(),
      comments: [],
    })

    showToast('Task created')
    onSave()
  }

  const handleTypeChange = (type) => {
    update('type', type)
    setPlantingSubtype('')
    setLabourPricingMethod('')
  }

  const handlePlantingSubtypeChange = (subtype) => {
    setPlantingSubtype(subtype)
    setLabourPricingMethod('')
  }

  return (
    <div className="flex flex-col h-full">
      <div style={{ padding: 16, borderBottom: '1px solid var(--color-parchment-300)' }} className="flex items-center justify-between">
        <h2 className="text-heading-3" style={{ color: 'var(--color-ink-900)', margin: 0 }}>New Task</h2>
        <button onClick={onCancel} className="btn btn-ghost" style={{ padding: 4 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--color-earth-400)' }}>close</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar" style={{ padding: 20 }}>
        <div className="flex flex-col gap-4">
          {/* Name */}
          <div>
            <label className="form-label">Task Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => update('name', e.target.value)}
              placeholder="e.g. Apply Spring Fertiliser"
              className="form-input"
              required
            />
          </div>

          {/* Type */}
          <div>
            <label className="form-label">Task Type *</label>
            <select
              value={form.type}
              onChange={e => handleTypeChange(e.target.value)}
              className="form-select"
              required
            >
              <option value="">Select type...</option>
              {TASK_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>

          {/* Planting Subtype */}
          {form.type === 'Planting' && (
            <div>
              <label className="form-label">Planting Type *</label>
              <div className="flex gap-2 mt-1">
                {PLANTING_SUBTYPES.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handlePlantingSubtypeChange(s)}
                    style={{ ...toggleBaseStyle, flex: 1, padding: '6px 12px', ...(plantingSubtype === s ? toggleActiveStyle : toggleInactiveStyle) }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Fields */}
          <div>
            <label className="form-label">
              Fields * <span style={{ color: 'var(--color-earth-400)', textTransform: 'none' }}>(click map or select below)</span>
            </label>
            {selectedFieldIds.length > 0 && (
              <div className="flex flex-wrap gap-1" style={{ marginTop: 4, marginBottom: 8 }}>
                {selectedFieldIds.map(id => {
                  const f = fields.find(ff => ff.id === id)
                  return f ? (
                    <span key={id} className="badge badge-healthy" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      {f.name}
                      <button type="button" onClick={() => toggleField(id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit', lineHeight: 1 }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 12 }}>close</span>
                      </button>
                    </span>
                  ) : null
                })}
              </div>
            )}
            <div style={{ maxHeight: 144, overflowY: 'auto', border: '1px solid var(--color-parchment-300)', borderRadius: 'var(--radius-sm)' }}>
              {fields.map(f => (
                <label key={f.id} className="flex items-center gap-2" style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid var(--color-parchment-200)', fontSize: 13, fontFamily: 'var(--font-body)', color: 'var(--color-earth-600)' }}>
                  <input
                    type="checkbox"
                    checked={selectedFieldIds.includes(f.id)}
                    onChange={() => toggleField(f.id)}
                  />
                  <span>{f.name}</span>
                  <span className="text-data" style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--color-earth-400)' }}>{f.category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* ── Crop/Seed Fields ── */}
          {form.type === 'Planting' && plantingSubtype === 'Crop/Seed' && (
            <div className="flex flex-col gap-4" style={{ padding: 16, background: 'var(--color-parchment-100)', border: '1px solid var(--color-parchment-300)', borderRadius: 'var(--radius-md)' }}>
              <h3 className="text-label" style={{ color: 'var(--color-sage-600)' }}>Crop / Seed Details</h3>

              <div>
                <label className="form-label">Crop / Mix *</label>
                <select value={cropMix} onChange={e => setCropMix(e.target.value)} className="form-select" required>
                  <option value="">Select crop...</option>
                  {CROP_OPTIONS.map(c => <option key={c}>{c}</option>)}
                  <option value="Other">Other (custom)</option>
                </select>
                {cropMix === 'Other' && (
                  <input
                    type="text"
                    value={customCropMix}
                    onChange={e => setCustomCropMix(e.target.value)}
                    placeholder="Enter custom crop or mix..."
                    className="form-input"
                    style={{ marginTop: 8 }}
                    required
                  />
                )}
              </div>

              <div>
                <label className="form-label">Area (ha)</label>
                <ReadOnlyField>{totalAreaHa.toFixed(1)} ha</ReadOnlyField>
              </div>

              <div>
                <label className="form-label">Seed Rate *</label>
                <div className="flex gap-2" style={{ marginTop: 4 }}>
                  <input
                    type="number"
                    value={rate}
                    onChange={e => setRate(e.target.value)}
                    placeholder="Rate"
                    className="form-input"
                    style={{ flex: 1 }}
                    min="0"
                    step="any"
                    required
                  />
                  <div className="flex" style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-parchment-300)', overflow: 'hidden' }}>
                    {SEED_RATE_UNITS.map(u => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => setRateUnit(u)}
                        style={{
                          padding: '6px 12px',
                          fontSize: 12,
                          fontFamily: 'var(--font-body)',
                          fontWeight: 500,
                          cursor: 'pointer',
                          transition: 'all 120ms ease',
                          border: 'none',
                          ...(rateUnit === u
                            ? { background: 'rgba(78,140,53,0.15)', color: 'var(--color-sage-500)' }
                            : { background: 'var(--color-parchment-50)', color: 'var(--color-earth-500)' }),
                        }}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="form-label">Total Seed Required</label>
                <ReadOnlyField>
                  {rateUnit === 'kg/ha'
                    ? `${totalSeedRequired.toFixed(1)} kg`
                    : `${Math.round(totalSeedRequired).toLocaleString()} seeds`}
                </ReadOnlyField>
              </div>

              <div>
                <label className="form-label">Seed Source *</label>
                <select value={seedSource} onChange={e => setSeedSource(e.target.value)} className="form-select" required>
                  <option value="">Select source...</option>
                  {SEED_SOURCES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              {seedSource && (
                <div>
                  <label className="form-label">
                    {seedSource === 'Bought' ? 'Price' : 'Cost'}
                    {rateUnit === 'seeds/m²' ? ' per seed' : ' per tonne'}
                    <span style={{ color: 'var(--color-earth-400)', textTransform: 'none', marginLeft: 4 }}>(optional)</span>
                  </label>
                  <div style={{ position: 'relative', marginTop: 4 }}>
                    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-earth-400)', fontSize: 13 }}>£</span>
                    <input
                      type="number"
                      value={seedPrice}
                      onChange={e => setSeedPrice(e.target.value)}
                      placeholder="0.00"
                      className="form-input"
                      style={{ paddingLeft: 28 }}
                      min="0"
                      step="any"
                    />
                  </div>
                </div>
              )}

              {totalSeedCost > 0 && (
                <div>
                  <label className="form-label">Total Seed Cost</label>
                  <ReadOnlyField>{formatGBP(totalSeedCost)}</ReadOnlyField>
                </div>
              )}

              <div>
                <label className="form-label">Establishment Method *</label>
                <select value={establishmentMethod} onChange={e => setEstablishmentMethod(e.target.value)} className="form-select" required>
                  <option value="">Select method...</option>
                  {ESTABLISHMENT_METHODS.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* ── Hedges Fields ── */}
          {form.type === 'Planting' && plantingSubtype === 'Hedges' && (
            <div className="flex flex-col gap-4" style={{ padding: 16, background: 'var(--color-parchment-100)', border: '1px solid var(--color-parchment-300)', borderRadius: 'var(--radius-md)' }}>
              <h3 className="text-label" style={{ color: 'var(--color-sage-600)' }}>Hedge Details</h3>

              <div>
                <label className="form-label">Hedge Plant *</label>
                <div className="flex flex-wrap gap-2" style={{ marginTop: 4 }}>
                  {HEDGE_PLANTS.map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setHedgePlant(p)}
                      style={hedgePlant === p ? chipActiveStyle : chipInactiveStyle}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setHedgePlant('Other')}
                    style={hedgePlant === 'Other' ? chipActiveStyle : chipInactiveStyle}
                  >
                    Other
                  </button>
                </div>
                {hedgePlant === 'Other' && (
                  <input
                    type="text"
                    value={customHedgePlant}
                    onChange={e => setCustomHedgePlant(e.target.value)}
                    placeholder="Enter hedge plant..."
                    className="form-input"
                    style={{ marginTop: 8 }}
                    required
                  />
                )}
              </div>

              <div>
                <label className="form-label">Hedge Length (m)</label>
                <ReadOnlyField>{Math.round(hedgeLength).toLocaleString()} m</ReadOnlyField>
              </div>

              <div>
                <label className="form-label">Rows *</label>
                <div className="flex gap-2" style={{ marginTop: 4 }}>
                  {HEDGE_ROWS.map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setHedgeRows(r)}
                      style={{ ...toggleBaseStyle, flex: 1, ...(hedgeRows === r ? toggleActiveStyle : toggleInactiveStyle) }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="form-label">Plants per Metre *</label>
                <input
                  type="number"
                  value={plantsPerMetre}
                  onChange={e => setPlantsPerMetre(e.target.value)}
                  placeholder="e.g. 6"
                  className="form-input"
                  min="0"
                  step="any"
                  required
                />
              </div>

              <div>
                <label className="form-label">Total Plants Required</label>
                <ReadOnlyField>{totalPlantsRequired.toLocaleString()}</ReadOnlyField>
              </div>

              <div>
                <label className="form-label">Protection *</label>
                <select value={hedgeProtection} onChange={e => setHedgeProtection(e.target.value)} className="form-select" required>
                  <option value="">Select protection...</option>
                  {HEDGE_PROTECTION.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label className="form-label">Plant Source *</label>
                <div className="flex gap-2" style={{ marginTop: 4 }}>
                  {HEDGE_SOURCES.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => { setPlantSource(s); if (s !== 'Bought') setPricePerPlant('') }}
                      style={{ ...toggleBaseStyle, flex: 1, ...(plantSource === s ? toggleActiveStyle : toggleInactiveStyle) }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {plantSource === 'Bought' && (
                <div>
                  <label className="form-label">
                    Price per Plant <span style={{ color: 'var(--color-earth-400)', textTransform: 'none' }}>(optional)</span>
                  </label>
                  <div style={{ position: 'relative', marginTop: 4 }}>
                    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-earth-400)', fontSize: 13 }}>£</span>
                    <input
                      type="number"
                      value={pricePerPlant}
                      onChange={e => setPricePerPlant(e.target.value)}
                      placeholder="0.00"
                      className="form-input"
                      style={{ paddingLeft: 28 }}
                      min="0"
                      step="any"
                    />
                  </div>
                </div>
              )}

              {totalPlantCost > 0 && (
                <div>
                  <label className="form-label">Total Plant Cost</label>
                  <ReadOnlyField>{formatGBP(totalPlantCost)}</ReadOnlyField>
                </div>
              )}
            </div>
          )}

          {/* ── Trees Fields ── */}
          {form.type === 'Planting' && plantingSubtype === 'Trees' && (
            <div className="flex flex-col gap-4" style={{ padding: 16, background: 'var(--color-parchment-100)', border: '1px solid var(--color-parchment-300)', borderRadius: 'var(--radius-md)' }}>
              <h3 className="text-label" style={{ color: 'var(--color-sage-600)' }}>Tree Details</h3>

              <div>
                <label className="form-label">Tree Species *</label>
                <div className="flex flex-wrap gap-2" style={{ marginTop: 4, maxHeight: 144, overflowY: 'auto' }}>
                  {TREE_SPECIES.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setTreeSpecies(s)}
                      style={treeSpecies === s ? chipActiveStyle : chipInactiveStyle}
                    >
                      {s}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setTreeSpecies('Other')}
                    style={treeSpecies === 'Other' ? chipActiveStyle : chipInactiveStyle}
                  >
                    Other
                  </button>
                </div>
                {treeSpecies === 'Other' && (
                  <input
                    type="text"
                    value={customTreeSpecies}
                    onChange={e => setCustomTreeSpecies(e.target.value)}
                    placeholder="Enter tree species..."
                    className="form-input"
                    style={{ marginTop: 8 }}
                    required
                  />
                )}
              </div>

              <div>
                <label className="form-label">Quantity (number of trees) *</label>
                <input
                  type="number"
                  value={treeQuantity}
                  onChange={e => setTreeQuantity(e.target.value)}
                  placeholder="e.g. 500"
                  className="form-input"
                  min="1"
                  required
                />
              </div>

              <div>
                <label className="form-label">Stock Type *</label>
                <select value={stockType} onChange={e => setStockType(e.target.value)} className="form-select" required>
                  <option value="">Select stock type...</option>
                  {TREE_STOCK_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="form-label">Planting Pattern *</label>
                <select value={plantingPattern} onChange={e => setPlantingPattern(e.target.value)} className="form-select" required>
                  <option value="">Select pattern...</option>
                  {TREE_PATTERNS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label className="form-label">Protection *</label>
                <select value={treeProtection} onChange={e => setTreeProtection(e.target.value)} className="form-select" required>
                  <option value="">Select protection...</option>
                  {TREE_PROTECTION.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label className="form-label">Source *</label>
                <div className="flex gap-2" style={{ marginTop: 4 }}>
                  {TREE_SOURCES.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => { setTreeSource(s); if (s !== 'Bought') setPricePerTree('') }}
                      style={{ ...toggleBaseStyle, flex: 1, ...(treeSource === s ? toggleActiveStyle : toggleInactiveStyle) }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {treeSource === 'Bought' && (
                <div>
                  <label className="form-label">
                    Price per Tree <span style={{ color: 'var(--color-earth-400)', textTransform: 'none' }}>(optional)</span>
                  </label>
                  <div style={{ position: 'relative', marginTop: 4 }}>
                    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-earth-400)', fontSize: 13 }}>£</span>
                    <input
                      type="number"
                      value={pricePerTree}
                      onChange={e => setPricePerTree(e.target.value)}
                      placeholder="0.00"
                      className="form-input"
                      style={{ paddingLeft: 28 }}
                      min="0"
                      step="any"
                    />
                  </div>
                </div>
              )}

              {totalTreeCost > 0 && (
                <div>
                  <label className="form-label">Total Tree Cost</label>
                  <ReadOnlyField>{formatGBP(totalTreeCost)}</ReadOnlyField>
                </div>
              )}
            </div>
          )}

          {/* ── Labour Toggle ── */}
          {form.type && (
            <div className="flex flex-col gap-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => { setLabourEnabled(!labourEnabled); if (labourEnabled) { setLabourType(''); setLabourPricingMethod(''); setLabourRate(''); setLabourLength('') } }}
                  style={{
                    position: 'relative',
                    width: 40,
                    height: 20,
                    borderRadius: 10,
                    transition: 'background 120ms ease',
                    background: labourEnabled ? 'var(--color-sage-500)' : 'var(--color-parchment-300)',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: 2,
                    left: labourEnabled ? 22 : 2,
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    background: 'white',
                    transition: 'left 120ms ease',
                  }} />
                </div>
                <span className="text-body" style={{ fontWeight: 600, color: 'var(--color-earth-600)' }}>Add Labour Costs</span>
              </label>

              {labourEnabled && (
                <div className="flex flex-col gap-4" style={{ padding: 16, background: 'var(--color-parchment-100)', border: '1px solid var(--color-parchment-300)', borderRadius: 'var(--radius-md)' }}>
                  <h3 className="text-label" style={{ color: 'var(--color-earth-600)' }}>Labour Details</h3>

                  <div>
                    <label className="form-label">Labour Type *</label>
                    <div className="flex gap-2" style={{ marginTop: 4 }}>
                      {LABOUR_TYPES.map(t => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setLabourType(t)}
                          style={{ ...toggleBaseStyle, flex: 1, ...(labourType === t ? toggleActiveStyle : toggleInactiveStyle) }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Pricing Method *</label>
                    <select value={labourPricingMethod} onChange={e => setLabourPricingMethod(e.target.value)} className="form-select" required>
                      <option value="">Select method...</option>
                      {labourPricingOptions.map(m => <option key={m}>{m}</option>)}
                    </select>
                  </div>

                  {labourPricingMethod && (
                    <div>
                      <label className="form-label">
                        Rate ({labourPricingMethod === 'Per Hour' ? '£/hour' : labourPricingMethod === 'Per Day' ? '£/day' : labourPricingMethod === 'Per Tree' ? '£/tree' : '£/plant'}) *
                      </label>
                      <div style={{ position: 'relative', marginTop: 4 }}>
                        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-earth-400)', fontSize: 13 }}>£</span>
                        <input
                          type="number"
                          value={labourRate}
                          onChange={e => setLabourRate(e.target.value)}
                          placeholder="0.00"
                          className="form-input"
                          style={{ paddingLeft: 28 }}
                          min="0"
                          step="any"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {labourPricingMethod && (
                    <div>
                      <label className="form-label">
                        {labourPricingMethod === 'Per Hour' ? 'Hours' : labourPricingMethod === 'Per Day' ? 'Days' : labourPricingMethod === 'Per Tree' ? 'Number of Trees' : 'Number of Plants'} *
                      </label>
                      {labourPricingMethod === 'Per Tree' || labourPricingMethod === 'Per Plant / Whip' ? (
                        <ReadOnlyField>{effectiveLabourLength.toLocaleString()}</ReadOnlyField>
                      ) : (
                        <input
                          type="number"
                          value={labourLength}
                          onChange={e => setLabourLength(e.target.value)}
                          placeholder="e.g. 5"
                          className="form-input"
                          min="0"
                          step="any"
                          required
                        />
                      )}
                    </div>
                  )}

                  {labourCost > 0 && (
                    <div>
                      <label className="form-label">Labour Cost</label>
                      <ReadOnlyField>{formatGBP(labourCost)}</ReadOnlyField>
                    </div>
                  )}

                  {totalTaskCost > 0 && (
                    <div>
                      <label className="form-label">Total Task Cost</label>
                      <ReadOnlyField bold>{formatGBP(totalTaskCost)}</ReadOnlyField>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div>
            <label className="form-label">Description</label>
            <textarea
              value={form.description}
              onChange={e => update('description', e.target.value)}
              placeholder="Optional details..."
              rows={3}
              className="form-textarea"
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="form-label">
              Due Date * <span style={{ color: 'var(--color-earth-400)', textTransform: 'none' }}>(or click calendar)</span>
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              onFocus={onFocusDate}
              className="form-input"
              required
            />
          </div>

          {/* Priority */}
          <div>
            <label className="form-label">Priority</label>
            <div className="flex gap-2" style={{ marginTop: 4 }}>
              {PRIORITIES.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => update('priority', p)}
                  style={{ ...toggleBaseStyle, flex: 1, textTransform: 'capitalize', ...(form.priority === p ? toggleActiveStyle : toggleInactiveStyle) }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Staff */}
          <div>
            <label className="form-label">Assign Staff</label>
            <div style={{ maxHeight: 144, overflowY: 'auto', border: '1px solid var(--color-parchment-300)', borderRadius: 'var(--radius-sm)', marginTop: 4 }}>
              {initialStaff.map(s => (
                <label key={s.id} className="flex items-center gap-2" style={{ padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid var(--color-parchment-200)', fontSize: 13, fontFamily: 'var(--font-body)', color: 'var(--color-earth-600)' }}>
                  <input
                    type="checkbox"
                    checked={form.assignedTo.includes(s.name)}
                    onChange={() => toggleStaff(s.name)}
                  />
                  <span>{s.name}</span>
                  <span className="text-data" style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--color-earth-400)' }}>{s.role}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-2" style={{ paddingTop: 8, paddingBottom: 16 }}>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
              Create Task
            </button>
            <button type="button" onClick={onCancel} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

function ReadOnlyField({ children, bold }) {
  return (
    <div
      className="text-body"
      style={{
        marginTop: 4,
        padding: '8px 12px',
        background: 'var(--color-parchment-200)',
        border: '1px solid var(--color-parchment-300)',
        borderRadius: 'var(--radius-sm)',
        color: 'var(--color-ink-900)',
        fontWeight: bold ? 700 : 500,
      }}
    >
      {children}
    </div>
  )
}
