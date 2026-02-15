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

const inputClass = 'mt-1 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none'
const labelClass = 'text-xs font-semibold text-slate-500 uppercase'
const readOnlyClass = 'mt-1 w-full px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-700 font-medium'

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
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">New Task</h2>
        <button onClick={onCancel} className="p-1 hover:bg-slate-100 rounded">
          <span className="material-icons text-slate-400">close</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-4">
        {/* Name */}
        <div>
          <label className={labelClass}>Task Name *</label>
          <input
            type="text"
            value={form.name}
            onChange={e => update('name', e.target.value)}
            placeholder="e.g. Apply Spring Fertiliser"
            className={inputClass}
            required
          />
        </div>

        {/* Type */}
        <div>
          <label className={labelClass}>Task Type *</label>
          <select
            value={form.type}
            onChange={e => handleTypeChange(e.target.value)}
            className={inputClass}
            required
          >
            <option value="">Select type...</option>
            {TASK_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>

        {/* Planting Subtype */}
        {form.type === 'Planting' && (
          <div>
            <label className={labelClass}>Planting Type *</label>
            <div className="flex gap-2 mt-1">
              {PLANTING_SUBTYPES.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handlePlantingSubtypeChange(s)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                    plantingSubtype === s
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Fields */}
        <div>
          <label className={labelClass}>
            Fields * <span className="text-slate-400 normal-case">(click map or select below)</span>
          </label>
          {selectedFieldIds.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1 mb-2">
              {selectedFieldIds.map(id => {
                const f = fields.find(ff => ff.id === id)
                return f ? (
                  <span key={id} className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary text-xs font-medium rounded-full">
                    {f.name}
                    <button type="button" onClick={() => toggleField(id)} className="hover:text-red-500">
                      <span className="material-icons text-xs">close</span>
                    </button>
                  </span>
                ) : null
              })}
            </div>
          )}
          <div className="max-h-36 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100">
            {fields.map(f => (
              <label key={f.id} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={selectedFieldIds.includes(f.id)}
                  onChange={() => toggleField(f.id)}
                  className="rounded border-slate-300 text-primary focus:ring-primary/30"
                />
                <span className="text-slate-700">{f.name}</span>
                <span className="text-xs text-slate-400 ml-auto">{f.category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* ── Crop/Seed Fields ── */}
        {form.type === 'Planting' && plantingSubtype === 'Crop/Seed' && (
          <div className="space-y-4 p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl">
            <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Crop / Seed Details</h3>

            {/* Crop/Mix */}
            <div>
              <label className={labelClass}>Crop / Mix *</label>
              <select value={cropMix} onChange={e => setCropMix(e.target.value)} className={inputClass} required>
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
                  className={inputClass + ' mt-2'}
                  required
                />
              )}
            </div>

            {/* Area */}
            <div>
              <label className={labelClass}>Area (ha)</label>
              <div className={readOnlyClass}>{totalAreaHa.toFixed(1)} ha</div>
            </div>

            {/* Rate */}
            <div>
              <label className={labelClass}>Seed Rate *</label>
              <div className="flex gap-2 mt-1">
                <input
                  type="number"
                  value={rate}
                  onChange={e => setRate(e.target.value)}
                  placeholder="Rate"
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                  min="0"
                  step="any"
                  required
                />
                <div className="flex rounded-lg border border-slate-200 overflow-hidden">
                  {SEED_RATE_UNITS.map(u => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setRateUnit(u)}
                      className={`px-3 py-2 text-xs font-medium transition-colors ${
                        rateUnit === u
                          ? 'bg-primary/20 text-primary'
                          : 'bg-white text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Total Seed Required */}
            <div>
              <label className={labelClass}>Total Seed Required</label>
              <div className={readOnlyClass}>
                {rateUnit === 'kg/ha'
                  ? `${totalSeedRequired.toFixed(1)} kg`
                  : `${Math.round(totalSeedRequired).toLocaleString()} seeds`}
              </div>
            </div>

            {/* Seed Source */}
            <div>
              <label className={labelClass}>Seed Source *</label>
              <select value={seedSource} onChange={e => setSeedSource(e.target.value)} className={inputClass} required>
                <option value="">Select source...</option>
                {SEED_SOURCES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>

            {/* Price */}
            {seedSource && (
              <div>
                <label className={labelClass}>
                  {seedSource === 'Bought' ? 'Price' : 'Cost'}
                  {rateUnit === 'seeds/m²' ? ' per seed' : ' per tonne'}
                  <span className="text-slate-400 normal-case ml-1">(optional)</span>
                </label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">£</span>
                  <input
                    type="number"
                    value={seedPrice}
                    onChange={e => setSeedPrice(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-7 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                    min="0"
                    step="any"
                  />
                </div>
              </div>
            )}

            {/* Total Seed Cost */}
            {totalSeedCost > 0 && (
              <div>
                <label className={labelClass}>Total Seed Cost</label>
                <div className={readOnlyClass}>{formatGBP(totalSeedCost)}</div>
              </div>
            )}

            {/* Establishment Method */}
            <div>
              <label className={labelClass}>Establishment Method *</label>
              <select value={establishmentMethod} onChange={e => setEstablishmentMethod(e.target.value)} className={inputClass} required>
                <option value="">Select method...</option>
                {ESTABLISHMENT_METHODS.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* ── Hedges Fields ── */}
        {form.type === 'Planting' && plantingSubtype === 'Hedges' && (
          <div className="space-y-4 p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl">
            <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Hedge Details</h3>

            {/* Hedge Plant */}
            <div>
              <label className={labelClass}>Hedge Plant *</label>
              <div className="flex flex-wrap gap-2 mt-1">
                {HEDGE_PLANTS.map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setHedgePlant(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      hedgePlant === p
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setHedgePlant('Other')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    hedgePlant === 'Other'
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                  }`}
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
                  className={inputClass + ' mt-2'}
                  required
                />
              )}
            </div>

            {/* Hedge Length */}
            <div>
              <label className={labelClass}>Hedge Length (m)</label>
              <div className={readOnlyClass}>{Math.round(hedgeLength).toLocaleString()} m</div>
            </div>

            {/* Rows */}
            <div>
              <label className={labelClass}>Rows *</label>
              <div className="flex gap-2 mt-1">
                {HEDGE_ROWS.map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setHedgeRows(r)}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                      hedgeRows === r
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Plants/m */}
            <div>
              <label className={labelClass}>Plants per Metre *</label>
              <input
                type="number"
                value={plantsPerMetre}
                onChange={e => setPlantsPerMetre(e.target.value)}
                placeholder="e.g. 6"
                className={inputClass}
                min="0"
                step="any"
                required
              />
            </div>

            {/* Total Plants Required */}
            <div>
              <label className={labelClass}>Total Plants Required</label>
              <div className={readOnlyClass}>{totalPlantsRequired.toLocaleString()}</div>
            </div>

            {/* Protection */}
            <div>
              <label className={labelClass}>Protection *</label>
              <select value={hedgeProtection} onChange={e => setHedgeProtection(e.target.value)} className={inputClass} required>
                <option value="">Select protection...</option>
                {HEDGE_PROTECTION.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>

            {/* Plant Source */}
            <div>
              <label className={labelClass}>Plant Source *</label>
              <div className="flex gap-2 mt-1">
                {HEDGE_SOURCES.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => { setPlantSource(s); if (s !== 'Bought') setPricePerPlant('') }}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                      plantSource === s
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Price per Plant */}
            {plantSource === 'Bought' && (
              <div>
                <label className={labelClass}>
                  Price per Plant <span className="text-slate-400 normal-case">(optional)</span>
                </label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">£</span>
                  <input
                    type="number"
                    value={pricePerPlant}
                    onChange={e => setPricePerPlant(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-7 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                    min="0"
                    step="any"
                  />
                </div>
              </div>
            )}

            {/* Total Plant Cost */}
            {totalPlantCost > 0 && (
              <div>
                <label className={labelClass}>Total Plant Cost</label>
                <div className={readOnlyClass}>{formatGBP(totalPlantCost)}</div>
              </div>
            )}
          </div>
        )}

        {/* ── Trees Fields ── */}
        {form.type === 'Planting' && plantingSubtype === 'Trees' && (
          <div className="space-y-4 p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl">
            <h3 className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Tree Details</h3>

            {/* Tree Species */}
            <div>
              <label className={labelClass}>Tree Species *</label>
              <div className="flex flex-wrap gap-2 mt-1 max-h-36 overflow-y-auto">
                {TREE_SPECIES.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setTreeSpecies(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      treeSpecies === s
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setTreeSpecies('Other')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    treeSpecies === 'Other'
                      ? 'bg-primary/20 text-primary border border-primary/30'
                      : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                  }`}
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
                  className={inputClass + ' mt-2'}
                  required
                />
              )}
            </div>

            {/* Quantity */}
            <div>
              <label className={labelClass}>Quantity (number of trees) *</label>
              <input
                type="number"
                value={treeQuantity}
                onChange={e => setTreeQuantity(e.target.value)}
                placeholder="e.g. 500"
                className={inputClass}
                min="1"
                required
              />
            </div>

            {/* Stock Type */}
            <div>
              <label className={labelClass}>Stock Type *</label>
              <select value={stockType} onChange={e => setStockType(e.target.value)} className={inputClass} required>
                <option value="">Select stock type...</option>
                {TREE_STOCK_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>

            {/* Planting Pattern */}
            <div>
              <label className={labelClass}>Planting Pattern *</label>
              <select value={plantingPattern} onChange={e => setPlantingPattern(e.target.value)} className={inputClass} required>
                <option value="">Select pattern...</option>
                {TREE_PATTERNS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>

            {/* Protection */}
            <div>
              <label className={labelClass}>Protection *</label>
              <select value={treeProtection} onChange={e => setTreeProtection(e.target.value)} className={inputClass} required>
                <option value="">Select protection...</option>
                {TREE_PROTECTION.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>

            {/* Source */}
            <div>
              <label className={labelClass}>Source *</label>
              <div className="flex gap-2 mt-1">
                {TREE_SOURCES.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => { setTreeSource(s); if (s !== 'Bought') setPricePerTree('') }}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                      treeSource === s
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Price per Tree */}
            {treeSource === 'Bought' && (
              <div>
                <label className={labelClass}>
                  Price per Tree <span className="text-slate-400 normal-case">(optional)</span>
                </label>
                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">£</span>
                  <input
                    type="number"
                    value={pricePerTree}
                    onChange={e => setPricePerTree(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-7 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                    min="0"
                    step="any"
                  />
                </div>
              </div>
            )}

            {/* Total Tree Cost */}
            {totalTreeCost > 0 && (
              <div>
                <label className={labelClass}>Total Tree Cost</label>
                <div className={readOnlyClass}>{formatGBP(totalTreeCost)}</div>
              </div>
            )}
          </div>
        )}

        {/* ── Labour Toggle ── */}
        {form.type && (
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => { setLabourEnabled(!labourEnabled); if (labourEnabled) { setLabourType(''); setLabourPricingMethod(''); setLabourRate(''); setLabourLength('') } }}
                className={`relative w-10 h-5 rounded-full transition-colors ${labourEnabled ? 'bg-primary' : 'bg-slate-300'}`}
              >
                <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${labourEnabled ? 'translate-x-5' : ''}`} />
              </div>
              <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">Add Labour Costs</span>
            </label>

            {labourEnabled && (
              <div className="space-y-4 p-4 bg-blue-50/50 border border-blue-100 rounded-xl">
                <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider">Labour Details</h3>

                {/* Labour Type */}
                <div>
                  <label className={labelClass}>Labour Type *</label>
                  <div className="flex gap-2 mt-1">
                    {LABOUR_TYPES.map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setLabourType(t)}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
                          labourType === t
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Pricing Method */}
                <div>
                  <label className={labelClass}>Pricing Method *</label>
                  <select value={labourPricingMethod} onChange={e => setLabourPricingMethod(e.target.value)} className={inputClass} required>
                    <option value="">Select method...</option>
                    {labourPricingOptions.map(m => <option key={m}>{m}</option>)}
                  </select>
                </div>

                {/* Rate */}
                {labourPricingMethod && (
                  <div>
                    <label className={labelClass}>
                      Rate ({labourPricingMethod === 'Per Hour' ? '£/hour' : labourPricingMethod === 'Per Day' ? '£/day' : labourPricingMethod === 'Per Tree' ? '£/tree' : '£/plant'}) *
                    </label>
                    <div className="relative mt-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">£</span>
                      <input
                        type="number"
                        value={labourRate}
                        onChange={e => setLabourRate(e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-7 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none"
                        min="0"
                        step="any"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Length/Quantity */}
                {labourPricingMethod && (
                  <div>
                    <label className={labelClass}>
                      {labourPricingMethod === 'Per Hour' ? 'Hours' : labourPricingMethod === 'Per Day' ? 'Days' : labourPricingMethod === 'Per Tree' ? 'Number of Trees' : 'Number of Plants'} *
                    </label>
                    {labourPricingMethod === 'Per Tree' || labourPricingMethod === 'Per Plant / Whip' ? (
                      <div className={readOnlyClass}>{effectiveLabourLength.toLocaleString()}</div>
                    ) : (
                      <input
                        type="number"
                        value={labourLength}
                        onChange={e => setLabourLength(e.target.value)}
                        placeholder="e.g. 5"
                        className={inputClass}
                        min="0"
                        step="any"
                        required
                      />
                    )}
                  </div>
                )}

                {/* Labour Cost */}
                {labourCost > 0 && (
                  <div>
                    <label className={labelClass}>Labour Cost</label>
                    <div className={readOnlyClass}>{formatGBP(labourCost)}</div>
                  </div>
                )}

                {/* Total Task Cost */}
                {totalTaskCost > 0 && (
                  <div>
                    <label className={labelClass}>Total Task Cost</label>
                    <div className={readOnlyClass + ' font-bold'}>{formatGBP(totalTaskCost)}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Description */}
        <div>
          <label className={labelClass}>Description</label>
          <textarea
            value={form.description}
            onChange={e => update('description', e.target.value)}
            placeholder="Optional details..."
            rows={3}
            className={inputClass + ' resize-none'}
          />
        </div>

        {/* Due Date */}
        <div>
          <label className={labelClass}>
            Due Date * <span className="text-slate-400 normal-case">(or click calendar)</span>
          </label>
          <input
            type="date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            onFocus={onFocusDate}
            className={inputClass}
            required
          />
        </div>

        {/* Priority */}
        <div>
          <label className={labelClass}>Priority</label>
          <div className="flex gap-2 mt-1">
            {PRIORITIES.map(p => (
              <button
                key={p}
                type="button"
                onClick={() => update('priority', p)}
                className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-colors ${
                  form.priority === p
                    ? 'bg-primary/20 text-primary border border-primary/30'
                    : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Staff */}
        <div>
          <label className={labelClass}>Assign Staff</label>
          <div className="max-h-36 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100 mt-1">
            {initialStaff.map(s => (
              <label key={s.id} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 cursor-pointer text-sm">
                <input
                  type="checkbox"
                  checked={form.assignedTo.includes(s.name)}
                  onChange={() => toggleStaff(s.name)}
                  className="rounded border-slate-300 text-primary focus:ring-primary/30"
                />
                <span className="text-slate-700">{s.name}</span>
                <span className="text-xs text-slate-400 ml-auto">{s.role}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-2 pt-2 pb-4">
          <button
            type="submit"
            className="flex-1 py-2.5 bg-primary text-emerald-950 text-sm font-bold rounded-lg hover:bg-primary-dark transition-colors"
          >
            Create Task
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
