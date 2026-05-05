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

const TASK_TYPES = [
  { type: 'Planting', icon: 'park' },
  { type: 'Harvesting', icon: 'agriculture' },
  { type: 'Fertilizing', icon: 'eco' },
  { type: 'Maintenance', icon: 'build' },
  { type: 'Feeding', icon: 'grass' },
  { type: 'Irrigation', icon: 'water_drop' },
  { type: 'Service', icon: 'settings' },
]

const PRIORITIES = ['low', 'medium', 'high']

const TEAM_ORDER = ['Management', 'Arable', 'Livestock', 'Maintenance']

const toggleActiveStyle = {
  background: 'rgba(78,140,53,0.15)',
  color: 'var(--color-green-500)',
  border: '1px solid rgba(78,140,53,0.3)',
}
const toggleInactiveStyle = {
  background: 'var(--color-surface-50)',
  color: 'var(--color-slate-500)',
  border: '1px solid var(--color-surface-300)',
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
const chipActiveStyle = { ...toggleBaseStyle, ...toggleActiveStyle }
const chipInactiveStyle = { ...toggleBaseStyle, ...toggleInactiveStyle }

function ReadOnlyField({ children, bold }) {
  return (
    <div
      className="text-body"
      style={{
        marginTop: 4,
        padding: '8px 12px',
        background: 'var(--color-surface-200)',
        border: '1px solid var(--color-surface-300)',
        borderRadius: 'var(--radius-sm)',
        color: 'var(--color-slate-900)',
        fontWeight: bold ? 700 : 500,
      }}
    >
      {children}
    </div>
  )
}

export default function MobileTaskCreateStepper({
  selectedFieldIds,
  setSelectedFieldIds,
  onCancel,
  onSave,
  onStepChange,
}) {
  const { fields, machinery, addTask, showToast } = useApp()

  // Current step index (0-based)
  const [stepIndex, setStepIndex] = useState(0)

  // Form state
  const [taskType, setTaskType] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [form, setForm] = useState({ name: '', description: '', priority: 'medium' })
  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  // Planting subtype + fields
  const [plantingSubtype, setPlantingSubtype] = useState('')
  const [cropMix, setCropMix] = useState('')
  const [customCropMix, setCustomCropMix] = useState('')
  const [rate, setRate] = useState('')
  const [rateUnit, setRateUnit] = useState('kg/ha')
  const [seedSource, setSeedSource] = useState('')
  const [seedPrice, setSeedPrice] = useState('')
  const [establishmentMethod, setEstablishmentMethod] = useState('')
  const [hedgePlant, setHedgePlant] = useState('')
  const [customHedgePlant, setCustomHedgePlant] = useState('')
  const [hedgeRows, setHedgeRows] = useState('Single Row')
  const [plantsPerMetre, setPlantsPerMetre] = useState('')
  const [hedgeProtection, setHedgeProtection] = useState('')
  const [plantSource, setPlantSource] = useState('')
  const [pricePerPlant, setPricePerPlant] = useState('')
  const [treeSpecies, setTreeSpecies] = useState('')
  const [customTreeSpecies, setCustomTreeSpecies] = useState('')
  const [treeQuantity, setTreeQuantity] = useState('')
  const [stockType, setStockType] = useState('')
  const [plantingPattern, setPlantingPattern] = useState('')
  const [treeProtection, setTreeProtection] = useState('')
  const [treeSource, setTreeSource] = useState('')
  const [pricePerTree, setPricePerTree] = useState('')

  // Staff
  const [selectedNames, setSelectedNames] = useState(new Set())
  const [expandedTeams, setExpandedTeams] = useState(new Set())
  const staffByTeam = useMemo(() => {
    const groups = {}
    initialStaff.forEach(s => {
      const t = s.team || 'Other'
      if (!groups[t]) groups[t] = []
      groups[t].push(s)
    })
    return groups
  }, [])
  const orderedTeams = [...TEAM_ORDER, ...Object.keys(staffByTeam).filter(t => !TEAM_ORDER.includes(t))]
    .filter(t => staffByTeam[t])

  const isTeamFull = (team) => {
    const members = staffByTeam[team] || []
    return members.length > 0 && members.every(s => selectedNames.has(s.name))
  }
  const isTeamPartial = (team) => {
    const members = staffByTeam[team] || []
    return members.some(s => selectedNames.has(s.name)) && !isTeamFull(team)
  }
  const toggleTeamSelection = (team) => {
    const members = staffByTeam[team] || []
    setSelectedNames(prev => {
      const next = new Set(prev)
      if (isTeamFull(team)) members.forEach(s => next.delete(s.name))
      else members.forEach(s => next.add(s.name))
      return next
    })
  }
  const toggleMember = (name) => {
    setSelectedNames(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  // Machinery
  const [selectedMachinery, setSelectedMachinery] = useState(new Set())
  const toggleMachinery = (name) => {
    setSelectedMachinery(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  // Labour
  const [labourEnabled, setLabourEnabled] = useState(false)
  const [labourType, setLabourType] = useState('')
  const [labourPricingMethod, setLabourPricingMethod] = useState('')
  const [labourRate, setLabourRate] = useState('')
  const [labourLength, setLabourLength] = useState('')

  // Computed values
  const totalAreaHa = useMemo(() =>
    selectedFieldIds.reduce((sum, id) => {
      const f = fields.find(ff => ff.id === id)
      return sum + (f ? f.sizeHectares : 0)
    }, 0)
  , [selectedFieldIds, fields])

  const totalSeedRequired = useMemo(() => {
    const r = parseFloat(rate) || 0
    if (rateUnit === 'kg/ha') return totalAreaHa * r
    return totalAreaHa * 10000 * r
  }, [totalAreaHa, rate, rateUnit])

  const totalSeedCost = useMemo(() => {
    const p = parseFloat(seedPrice) || 0
    if (!p) return 0
    if (rateUnit === 'kg/ha') return totalSeedRequired / 1000 * p
    return totalSeedRequired * p
  }, [totalSeedRequired, seedPrice, rateUnit])

  const hedgeLength = useMemo(() =>
    selectedFieldIds.reduce((sum, id) => {
      const f = fields.find(ff => ff.id === id)
      if (!f) return sum
      return sum + 4 * Math.sqrt(f.sizeHectares * 10000)
    }, 0)
  , [selectedFieldIds, fields])

  const totalPlantsRequired = useMemo(() => {
    const ppm = parseFloat(plantsPerMetre) || 0
    const rowMultiplier = hedgeRows === 'Double Row' ? 2 : 1
    return Math.round(hedgeLength * ppm * rowMultiplier)
  }, [hedgeLength, plantsPerMetre, hedgeRows])

  const totalPlantCost = useMemo(() => {
    const p = parseFloat(pricePerPlant) || 0
    return p ? totalPlantsRequired * p : 0
  }, [totalPlantsRequired, pricePerPlant])

  const totalTreeCost = useMemo(() => {
    const q = parseInt(treeQuantity) || 0
    const p = parseFloat(pricePerTree) || 0
    return p ? q * p : 0
  }, [treeQuantity, pricePerTree])

  const labourPricingOptions = useMemo(() => {
    if (taskType === 'Planting' && plantingSubtype === 'Trees') return LABOUR_PRICING_METHODS_TREES
    if (taskType === 'Planting' && plantingSubtype === 'Hedges') return LABOUR_PRICING_METHODS_HEDGES
    return LABOUR_PRICING_METHODS
  }, [taskType, plantingSubtype])

  const effectiveLabourLength = useMemo(() => {
    if (labourPricingMethod === 'Per Tree') return parseInt(treeQuantity) || 0
    if (labourPricingMethod === 'Per Plant / Whip') return totalPlantsRequired
    return parseFloat(labourLength) || 0
  }, [labourPricingMethod, treeQuantity, totalPlantsRequired, labourLength])

  const labourCost = useMemo(() =>
    effectiveLabourLength * (parseFloat(labourRate) || 0)
  , [effectiveLabourLength, labourRate])

  const taskSpecificCost = useMemo(() => {
    if (taskType !== 'Planting') return 0
    if (plantingSubtype === 'Crop/Seed') return totalSeedCost
    if (plantingSubtype === 'Hedges') return totalPlantCost
    if (plantingSubtype === 'Trees') return totalTreeCost
    return 0
  }, [taskType, plantingSubtype, totalSeedCost, totalPlantCost, totalTreeCost])

  const totalTaskCost = useMemo(() => taskSpecificCost + labourCost, [taskSpecificCost, labourCost])

  // Steps config (0-indexed)
  // Steps: 0=Type, 1=Fields, 2=Basics, [3=Details if Planting], last=Resources
  const steps = useMemo(() => {
    const s = ['Type', 'Fields', 'Basics']
    if (taskType === 'Planting') s.push('Details')
    s.push('Resources')
    return s
  }, [taskType])

  // Validation errors per step
  const [errors, setErrors] = useState({})

  const validate = (idx) => {
    const step = steps[idx]
    const errs = {}
    if (step === 'Type') {
      if (!taskType) errs.type = 'Please select a task type'
    } else if (step === 'Fields') {
      if (selectedFieldIds.length === 0) errs.fields = 'Select at least one field'
    } else if (step === 'Basics') {
      if (!form.name.trim()) errs.name = 'Task name is required'
      if (!dueDate) errs.dueDate = 'Due date is required'
    } else if (step === 'Details') {
      if (!plantingSubtype) errs.plantingSubtype = 'Select a planting type'
      if (plantingSubtype === 'Crop/Seed') {
        if (!cropMix) errs.cropMix = 'Select a crop or mix'
        if (cropMix === 'Other' && !customCropMix.trim()) errs.cropMix = 'Enter a custom crop'
        if (!rate) errs.rate = 'Enter a seed rate'
        if (!seedSource) errs.seedSource = 'Select a seed source'
        if (!establishmentMethod) errs.establishmentMethod = 'Select an establishment method'
      } else if (plantingSubtype === 'Hedges') {
        if (!hedgePlant) errs.hedgePlant = 'Select a hedge plant'
        if (hedgePlant === 'Other' && !customHedgePlant.trim()) errs.hedgePlant = 'Enter a hedge plant'
        if (!plantsPerMetre) errs.plantsPerMetre = 'Enter plants per metre'
        if (!hedgeProtection) errs.hedgeProtection = 'Select a protection type'
        if (!plantSource) errs.plantSource = 'Select a plant source'
      } else if (plantingSubtype === 'Trees') {
        if (!treeSpecies) errs.treeSpecies = 'Select a tree species'
        if (treeSpecies === 'Other' && !customTreeSpecies.trim()) errs.treeSpecies = 'Enter a tree species'
        if (!treeQuantity) errs.treeQuantity = 'Enter a quantity'
        if (!stockType) errs.stockType = 'Select a stock type'
        if (!plantingPattern) errs.plantingPattern = 'Select a planting pattern'
        if (!treeProtection) errs.treeProtection = 'Select a protection type'
        if (!treeSource) errs.treeSource = 'Select a tree source'
      }
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const goTo = (idx) => {
    setStepIndex(idx)
    onStepChange?.(idx)
  }

  const handleNext = () => {
    if (!validate(stepIndex)) return
    const next = stepIndex + 1
    if (next < steps.length) goTo(next)
  }

  const handleBack = () => {
    if (stepIndex === 0) { onCancel(); return }
    goTo(stepIndex - 1)
  }

  const buildTypeFields = () => {
    let tf = {}
    if (taskType === 'Planting') {
      tf.plantingSubtype = plantingSubtype
      if (plantingSubtype === 'Crop/Seed') {
        tf.cropMix = cropMix === 'Other' ? customCropMix : cropMix
        tf.area = totalAreaHa
        tf.rate = parseFloat(rate) || 0
        tf.rateUnit = rateUnit
        tf.totalSeedRequired = totalSeedRequired
        tf.seedSource = seedSource
        if (parseFloat(seedPrice)) { tf.price = parseFloat(seedPrice); tf.totalSeedCost = totalSeedCost }
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

  const handleSubmit = () => {
    if (!validate(stepIndex)) return
    const fullySelectedTeams = orderedTeams.filter(t => isTeamFull(t))
    const derivedAssignedTo = [...selectedNames].filter(name => {
      const s = initialStaff.find(m => m.name === name)
      return !s || !fullySelectedTeams.includes(s.team)
    })
    addTask({
      id: `task-${Date.now()}`,
      name: form.name,
      type: taskType,
      status: 'todo',
      priority: form.priority,
      dueDate,
      description: form.description,
      assignedTo: derivedAssignedTo,
      assignedTeams: fullySelectedTeams,
      assignedMachinery: [...selectedMachinery],
      fieldIds: selectedFieldIds,
      completedDate: null,
      typeFields: buildTypeFields(),
      comments: [],
    })
    showToast('Task created')
    onSave()
  }

  const isLastStep = stepIndex === steps.length - 1
  const currentStep = steps[stepIndex]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ padding: '12px 16px 8px', borderBottom: '1px solid var(--color-surface-300)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 13, fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--color-slate-700)' }}>
            {currentStep}
          </span>
          <span style={{ fontSize: 12, fontFamily: 'var(--font-body)', color: 'var(--color-slate-400)' }}>
            {stepIndex + 1} / {steps.length}
          </span>
        </div>
        {/* Step dots */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
          {steps.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === stepIndex ? 20 : 8,
                height: 8,
                borderRadius: 99,
                background: i === stepIndex
                  ? 'var(--color-primary)'
                  : i < stepIndex
                    ? 'var(--color-green-400)'
                    : 'var(--color-surface-300)',
                transition: 'all 200ms ease',
              }}
            />
          ))}
        </div>
      </div>

      {/* Step content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        {currentStep === 'Type' && (
          <StepType
            taskType={taskType}
            onSelect={(type) => {
              setTaskType(type)
              setPlantingSubtype('')
              setLabourPricingMethod('')
              setErrors({})
              goTo(1)
            }}
            error={errors.type}
          />
        )}

        {currentStep === 'Fields' && (
          <StepFields
            fields={fields}
            selectedFieldIds={selectedFieldIds}
            setSelectedFieldIds={setSelectedFieldIds}
            error={errors.fields}
          />
        )}

        {currentStep === 'Basics' && (
          <StepBasics
            form={form}
            update={update}
            dueDate={dueDate}
            setDueDate={setDueDate}
            errors={errors}
          />
        )}

        {currentStep === 'Details' && (
          <StepDetails
            plantingSubtype={plantingSubtype}
            setPlantingSubtype={(s) => { setPlantingSubtype(s); setLabourPricingMethod('') }}
            errors={errors}
            // Crop
            cropMix={cropMix} setCropMix={setCropMix}
            customCropMix={customCropMix} setCustomCropMix={setCustomCropMix}
            rate={rate} setRate={setRate}
            rateUnit={rateUnit} setRateUnit={setRateUnit}
            seedSource={seedSource} setSeedSource={setSeedSource}
            seedPrice={seedPrice} setSeedPrice={setSeedPrice}
            establishmentMethod={establishmentMethod} setEstablishmentMethod={setEstablishmentMethod}
            totalAreaHa={totalAreaHa}
            totalSeedRequired={totalSeedRequired}
            totalSeedCost={totalSeedCost}
            // Hedges
            hedgePlant={hedgePlant} setHedgePlant={setHedgePlant}
            customHedgePlant={customHedgePlant} setCustomHedgePlant={setCustomHedgePlant}
            hedgeRows={hedgeRows} setHedgeRows={setHedgeRows}
            plantsPerMetre={plantsPerMetre} setPlantsPerMetre={setPlantsPerMetre}
            hedgeProtection={hedgeProtection} setHedgeProtection={setHedgeProtection}
            plantSource={plantSource} setPlantSource={setPlantSource}
            pricePerPlant={pricePerPlant} setPricePerPlant={setPricePerPlant}
            hedgeLength={hedgeLength}
            totalPlantsRequired={totalPlantsRequired}
            totalPlantCost={totalPlantCost}
            // Trees
            treeSpecies={treeSpecies} setTreeSpecies={setTreeSpecies}
            customTreeSpecies={customTreeSpecies} setCustomTreeSpecies={setCustomTreeSpecies}
            treeQuantity={treeQuantity} setTreeQuantity={setTreeQuantity}
            stockType={stockType} setStockType={setStockType}
            plantingPattern={plantingPattern} setPlantingPattern={setPlantingPattern}
            treeProtection={treeProtection} setTreeProtection={setTreeProtection}
            treeSource={treeSource} setTreeSource={setTreeSource}
            pricePerTree={pricePerTree} setPricePerTree={setPricePerTree}
            totalTreeCost={totalTreeCost}
          />
        )}

        {currentStep === 'Resources' && (
          <StepResources
            // Staff
            staffByTeam={staffByTeam}
            orderedTeams={orderedTeams}
            selectedNames={selectedNames}
            expandedTeams={expandedTeams}
            isTeamFull={isTeamFull}
            isTeamPartial={isTeamPartial}
            toggleTeamSelection={toggleTeamSelection}
            toggleMember={toggleMember}
            toggleTeamExpanded={(t) => setExpandedTeams(prev => {
              const next = new Set(prev)
              if (next.has(t)) next.delete(t)
              else next.add(t)
              return next
            })}
            // Machinery
            machinery={machinery}
            selectedMachinery={selectedMachinery}
            toggleMachinery={toggleMachinery}
            // Labour
            labourEnabled={labourEnabled}
            setLabourEnabled={setLabourEnabled}
            labourType={labourType}
            setLabourType={setLabourType}
            labourPricingMethod={labourPricingMethod}
            setLabourPricingMethod={setLabourPricingMethod}
            labourRate={labourRate}
            setLabourRate={setLabourRate}
            labourLength={labourLength}
            setLabourLength={setLabourLength}
            labourPricingOptions={labourPricingOptions}
            effectiveLabourLength={effectiveLabourLength}
            labourCost={labourCost}
            totalTaskCost={totalTaskCost}
          />
        )}
      </div>

      {/* Bottom nav */}
      <div style={{
        display: 'flex', gap: 10, padding: '12px 16px',
        borderTop: '1px solid var(--color-surface-300)', flexShrink: 0,
        background: 'var(--color-surface-50)',
      }}>
        <button
          type="button"
          onClick={handleBack}
          style={{
            padding: '10px 18px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--color-surface-300)',
            background: 'var(--color-surface-50)',
            color: 'var(--color-slate-600)',
            fontSize: 14,
            fontFamily: 'var(--font-body)',
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          {stepIndex === 0 ? 'Cancel' : 'Back'}
        </button>
        {currentStep !== 'Type' && (
          <button
            type="button"
            onClick={isLastStep ? handleSubmit : handleNext}
            style={{
              flex: 1,
              padding: '10px 18px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              background: 'var(--color-primary)',
              color: '#000',
              fontSize: 14,
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {isLastStep ? 'Create Task' : 'Next'}
          </button>
        )}
      </div>
    </div>
  )
}

/* ── Step 1: Type ─────────────────────────────────────────────────────── */
function StepType({ taskType, onSelect, error }) {
  return (
    <div>
      <p style={{ fontSize: 13, fontFamily: 'var(--font-body)', color: 'var(--color-slate-500)', marginBottom: 16, marginTop: 0 }}>
        What kind of task is this?
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {TASK_TYPES.map(({ type, icon }) => {
          const active = taskType === type
          return (
            <button
              key={type}
              type="button"
              onClick={() => onSelect(type)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: 8, padding: '18px 12px',
                borderRadius: 'var(--radius-md)',
                border: active ? '2px solid var(--color-primary)' : '2px solid var(--color-surface-300)',
                background: active ? 'rgba(19,236,19,0.08)' : 'var(--color-surface-100)',
                cursor: 'pointer',
                transition: 'all 120ms ease',
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 28, color: active ? 'var(--color-green-600)' : 'var(--color-slate-400)' }}
              >
                {icon}
              </span>
              <span style={{
                fontSize: 13, fontFamily: 'var(--font-body)', fontWeight: 600,
                color: active ? 'var(--color-green-700)' : 'var(--color-slate-700)',
              }}>
                {type}
              </span>
            </button>
          )
        })}
      </div>
      {error && <p style={{ color: 'var(--color-red-500)', fontSize: 12, marginTop: 8, fontFamily: 'var(--font-body)' }}>{error}</p>}
    </div>
  )
}

/* ── Step 2: Fields ───────────────────────────────────────────────────── */
function StepFields({ fields, selectedFieldIds, setSelectedFieldIds, error }) {
  const toggle = (id) => setSelectedFieldIds(prev =>
    prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
  )
  return (
    <div>
      <p style={{ fontSize: 13, fontFamily: 'var(--font-body)', color: 'var(--color-slate-500)', marginBottom: 12, marginTop: 0 }}>
        Tap fields on the map, or select from the list below.
      </p>
      {selectedFieldIds.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
          {selectedFieldIds.map(id => {
            const f = fields.find(ff => ff.id === id)
            return f ? (
              <span key={id} className="badge badge-healthy" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                {f.name}
                <button type="button" onClick={() => toggle(id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit', lineHeight: 1 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 12 }}>close</span>
                </button>
              </span>
            ) : null
          })}
        </div>
      )}
      <div style={{ border: '1px solid var(--color-surface-300)', borderRadius: 'var(--radius-sm)' }}>
        {fields.map((f, idx) => (
          <label
            key={f.id}
            className="flex items-center gap-2"
            style={{
              padding: '10px 12px', cursor: 'pointer',
              borderBottom: idx < fields.length - 1 ? '1px solid var(--color-surface-200)' : 'none',
              fontSize: 13, fontFamily: 'var(--font-body)', color: 'var(--color-slate-600)',
              background: selectedFieldIds.includes(f.id) ? 'rgba(78,140,53,0.04)' : 'none',
            }}
          >
            <input type="checkbox" checked={selectedFieldIds.includes(f.id)} onChange={() => toggle(f.id)} />
            <span style={{ flex: 1 }}>{f.name}</span>
            <span style={{ fontSize: 11, color: 'var(--color-slate-400)' }}>{f.usage}</span>
          </label>
        ))}
      </div>
      {error && <p style={{ color: 'var(--color-red-500)', fontSize: 12, marginTop: 8, fontFamily: 'var(--font-body)' }}>{error}</p>}
    </div>
  )
}

/* ── Step 3: Basics ───────────────────────────────────────────────────── */
function StepBasics({ form, update, dueDate, setDueDate, errors }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <label className="form-label">Task Name *</label>
        <input
          type="text"
          value={form.name}
          onChange={e => update('name', e.target.value)}
          placeholder="e.g. Apply Spring Fertiliser"
          className="form-input"
        />
        {errors.name && <p style={{ color: 'var(--color-red-500)', fontSize: 12, marginTop: 4, fontFamily: 'var(--font-body)' }}>{errors.name}</p>}
      </div>

      <div>
        <label className="form-label">Due Date *</label>
        <input
          type="date"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          className="form-input"
        />
        {errors.dueDate && <p style={{ color: 'var(--color-red-500)', fontSize: 12, marginTop: 4, fontFamily: 'var(--font-body)' }}>{errors.dueDate}</p>}
      </div>

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
    </div>
  )
}

/* ── Step 4: Planting Details ─────────────────────────────────────────── */
function StepDetails({
  plantingSubtype, setPlantingSubtype, errors,
  cropMix, setCropMix, customCropMix, setCustomCropMix,
  rate, setRate, rateUnit, setRateUnit,
  seedSource, setSeedSource, seedPrice, setSeedPrice,
  establishmentMethod, setEstablishmentMethod,
  totalAreaHa, totalSeedRequired, totalSeedCost,
  hedgePlant, setHedgePlant, customHedgePlant, setCustomHedgePlant,
  hedgeRows, setHedgeRows, plantsPerMetre, setPlantsPerMetre,
  hedgeProtection, setHedgeProtection, plantSource, setPlantSource,
  pricePerPlant, setPricePerPlant, hedgeLength, totalPlantsRequired, totalPlantCost,
  treeSpecies, setTreeSpecies, customTreeSpecies, setCustomTreeSpecies,
  treeQuantity, setTreeQuantity, stockType, setStockType,
  plantingPattern, setPlantingPattern, treeProtection, setTreeProtection,
  treeSource, setTreeSource, pricePerTree, setPricePerTree, totalTreeCost,
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Planting subtype */}
      <div>
        <label className="form-label">Planting Type *</label>
        <div className="flex gap-2" style={{ marginTop: 4 }}>
          {PLANTING_SUBTYPES.map(s => (
            <button
              key={s}
              type="button"
              onClick={() => setPlantingSubtype(s)}
              style={{ ...toggleBaseStyle, flex: 1, ...(plantingSubtype === s ? toggleActiveStyle : toggleInactiveStyle) }}
            >
              {s}
            </button>
          ))}
        </div>
        {errors.plantingSubtype && <p style={{ color: 'var(--color-red-500)', fontSize: 12, marginTop: 4, fontFamily: 'var(--font-body)' }}>{errors.plantingSubtype}</p>}
      </div>

      {/* Crop/Seed */}
      {plantingSubtype === 'Crop/Seed' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="form-label">Crop / Mix *</label>
            <select value={cropMix} onChange={e => setCropMix(e.target.value)} className="form-select">
              <option value="">Select crop...</option>
              {CROP_OPTIONS.map(c => <option key={c}>{c}</option>)}
              <option value="Other">Other (custom)</option>
            </select>
            {cropMix === 'Other' && (
              <input type="text" value={customCropMix} onChange={e => setCustomCropMix(e.target.value)}
                placeholder="Enter custom crop or mix..." className="form-input" style={{ marginTop: 8 }} />
            )}
            {errors.cropMix && <p style={{ color: 'var(--color-red-500)', fontSize: 12, marginTop: 4, fontFamily: 'var(--font-body)' }}>{errors.cropMix}</p>}
          </div>
          <div>
            <label className="form-label">Area (ha)</label>
            <ReadOnlyField>{totalAreaHa.toFixed(1)} ha</ReadOnlyField>
          </div>
          <div>
            <label className="form-label">Seed Rate *</label>
            <div className="flex gap-2" style={{ marginTop: 4 }}>
              <input type="number" value={rate} onChange={e => setRate(e.target.value)}
                placeholder="Rate" className="form-input" style={{ flex: 1 }} min="0" step="any" />
              <div className="flex" style={{ borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-surface-300)', overflow: 'hidden' }}>
                {SEED_RATE_UNITS.map(u => (
                  <button key={u} type="button" onClick={() => setRateUnit(u)}
                    style={{ padding: '6px 12px', fontSize: 12, fontFamily: 'var(--font-body)', fontWeight: 500, cursor: 'pointer', transition: 'all 120ms ease', border: 'none',
                      ...(rateUnit === u ? { background: 'rgba(78,140,53,0.15)', color: 'var(--color-green-500)' } : { background: 'var(--color-surface-50)', color: 'var(--color-slate-500)' }) }}>
                    {u}
                  </button>
                ))}
              </div>
            </div>
            {errors.rate && <p style={{ color: 'var(--color-red-500)', fontSize: 12, marginTop: 4, fontFamily: 'var(--font-body)' }}>{errors.rate}</p>}
          </div>
          <div>
            <label className="form-label">Total Seed Required</label>
            <ReadOnlyField>{rateUnit === 'kg/ha' ? `${totalSeedRequired.toFixed(1)} kg` : `${Math.round(totalSeedRequired).toLocaleString()} seeds`}</ReadOnlyField>
          </div>
          <div>
            <label className="form-label">Seed Source *</label>
            <select value={seedSource} onChange={e => setSeedSource(e.target.value)} className="form-select">
              <option value="">Select source...</option>
              {SEED_SOURCES.map(s => <option key={s}>{s}</option>)}
            </select>
            {errors.seedSource && <p style={{ color: 'var(--color-red-500)', fontSize: 12, marginTop: 4, fontFamily: 'var(--font-body)' }}>{errors.seedSource}</p>}
          </div>
          {seedSource && (
            <div>
              <label className="form-label">
                {seedSource === 'Bought' ? 'Price' : 'Cost'} {rateUnit === 'seeds/m²' ? 'per seed' : 'per tonne'}
                <span style={{ color: 'var(--color-slate-400)', textTransform: 'none', marginLeft: 4 }}>(optional)</span>
              </label>
              <div style={{ position: 'relative', marginTop: 4 }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-slate-400)', fontSize: 13 }}>£</span>
                <input type="number" value={seedPrice} onChange={e => setSeedPrice(e.target.value)}
                  placeholder="0.00" className="form-input" style={{ paddingLeft: 28 }} min="0" step="any" />
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
            <select value={establishmentMethod} onChange={e => setEstablishmentMethod(e.target.value)} className="form-select">
              <option value="">Select method...</option>
              {ESTABLISHMENT_METHODS.map(m => <option key={m}>{m}</option>)}
            </select>
            {errors.establishmentMethod && <p style={{ color: 'var(--color-red-500)', fontSize: 12, marginTop: 4, fontFamily: 'var(--font-body)' }}>{errors.establishmentMethod}</p>}
          </div>
        </div>
      )}

      {/* Hedges */}
      {plantingSubtype === 'Hedges' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="form-label">Hedge Plant *</label>
            <div className="flex flex-wrap gap-2" style={{ marginTop: 4 }}>
              {[...HEDGE_PLANTS, 'Other'].map(p => (
                <button key={p} type="button" onClick={() => setHedgePlant(p)}
                  style={hedgePlant === p ? chipActiveStyle : chipInactiveStyle}>{p}</button>
              ))}
            </div>
            {hedgePlant === 'Other' && (
              <input type="text" value={customHedgePlant} onChange={e => setCustomHedgePlant(e.target.value)}
                placeholder="Enter hedge plant..." className="form-input" style={{ marginTop: 8 }} />
            )}
            {errors.hedgePlant && <p style={{ color: 'var(--color-red-500)', fontSize: 12, marginTop: 4, fontFamily: 'var(--font-body)' }}>{errors.hedgePlant}</p>}
          </div>
          <div>
            <label className="form-label">Hedge Length (m)</label>
            <ReadOnlyField>{Math.round(hedgeLength).toLocaleString()} m</ReadOnlyField>
          </div>
          <div>
            <label className="form-label">Rows *</label>
            <div className="flex gap-2" style={{ marginTop: 4 }}>
              {HEDGE_ROWS.map(r => (
                <button key={r} type="button" onClick={() => setHedgeRows(r)}
                  style={{ ...toggleBaseStyle, flex: 1, ...(hedgeRows === r ? toggleActiveStyle : toggleInactiveStyle) }}>{r}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="form-label">Plants per Metre *</label>
            <input type="number" value={plantsPerMetre} onChange={e => setPlantsPerMetre(e.target.value)}
              placeholder="e.g. 6" className="form-input" min="0" step="any" />
            {errors.plantsPerMetre && <p style={{ color: 'var(--color-red-500)', fontSize: 12, marginTop: 4, fontFamily: 'var(--font-body)' }}>{errors.plantsPerMetre}</p>}
          </div>
          <div>
            <label className="form-label">Total Plants Required</label>
            <ReadOnlyField>{totalPlantsRequired.toLocaleString()}</ReadOnlyField>
          </div>
          <div>
            <label className="form-label">Protection *</label>
            <select value={hedgeProtection} onChange={e => setHedgeProtection(e.target.value)} className="form-select">
              <option value="">Select protection...</option>
              {HEDGE_PROTECTION.map(p => <option key={p}>{p}</option>)}
            </select>
            {errors.hedgeProtection && <p style={{ color: 'var(--color-red-500)', fontSize: 12, marginTop: 4, fontFamily: 'var(--font-body)' }}>{errors.hedgeProtection}</p>}
          </div>
          <div>
            <label className="form-label">Plant Source *</label>
            <div className="flex gap-2" style={{ marginTop: 4 }}>
              {HEDGE_SOURCES.map(s => (
                <button key={s} type="button"
                  onClick={() => { setPlantSource(s); if (s !== 'Bought') setPricePerPlant('') }}
                  style={{ ...toggleBaseStyle, flex: 1, ...(plantSource === s ? toggleActiveStyle : toggleInactiveStyle) }}>{s}</button>
              ))}
            </div>
            {errors.plantSource && <p style={{ color: 'var(--color-red-500)', fontSize: 12, marginTop: 4, fontFamily: 'var(--font-body)' }}>{errors.plantSource}</p>}
          </div>
          {plantSource === 'Bought' && (
            <div>
              <label className="form-label">Price per Plant <span style={{ color: 'var(--color-slate-400)', textTransform: 'none' }}>(optional)</span></label>
              <div style={{ position: 'relative', marginTop: 4 }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-slate-400)', fontSize: 13 }}>£</span>
                <input type="number" value={pricePerPlant} onChange={e => setPricePerPlant(e.target.value)}
                  placeholder="0.00" className="form-input" style={{ paddingLeft: 28 }} min="0" step="any" />
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

      {/* Trees */}
      {plantingSubtype === 'Trees' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="form-label">Tree Species *</label>
            <div className="flex flex-wrap gap-2" style={{ marginTop: 4 }}>
              {[...TREE_SPECIES, 'Other'].map(s => (
                <button key={s} type="button" onClick={() => setTreeSpecies(s)}
                  style={treeSpecies === s ? chipActiveStyle : chipInactiveStyle}>{s}</button>
              ))}
            </div>
            {treeSpecies === 'Other' && (
              <input type="text" value={customTreeSpecies} onChange={e => setCustomTreeSpecies(e.target.value)}
                placeholder="Enter tree species..." className="form-input" style={{ marginTop: 8 }} />
            )}
            {errors.treeSpecies && <p style={{ color: 'var(--color-red-500)', fontSize: 12, marginTop: 4, fontFamily: 'var(--font-body)' }}>{errors.treeSpecies}</p>}
          </div>
          <div>
            <label className="form-label">Quantity *</label>
            <input type="number" value={treeQuantity} onChange={e => setTreeQuantity(e.target.value)}
              placeholder="e.g. 500" className="form-input" min="1" />
            {errors.treeQuantity && <p style={{ color: 'var(--color-red-500)', fontSize: 12, marginTop: 4, fontFamily: 'var(--font-body)' }}>{errors.treeQuantity}</p>}
          </div>
          <div>
            <label className="form-label">Stock Type *</label>
            <select value={stockType} onChange={e => setStockType(e.target.value)} className="form-select">
              <option value="">Select stock type...</option>
              {TREE_STOCK_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
            {errors.stockType && <p style={{ color: 'var(--color-red-500)', fontSize: 12, marginTop: 4, fontFamily: 'var(--font-body)' }}>{errors.stockType}</p>}
          </div>
          <div>
            <label className="form-label">Planting Pattern *</label>
            <select value={plantingPattern} onChange={e => setPlantingPattern(e.target.value)} className="form-select">
              <option value="">Select pattern...</option>
              {TREE_PATTERNS.map(p => <option key={p}>{p}</option>)}
            </select>
            {errors.plantingPattern && <p style={{ color: 'var(--color-red-500)', fontSize: 12, marginTop: 4, fontFamily: 'var(--font-body)' }}>{errors.plantingPattern}</p>}
          </div>
          <div>
            <label className="form-label">Protection *</label>
            <select value={treeProtection} onChange={e => setTreeProtection(e.target.value)} className="form-select">
              <option value="">Select protection...</option>
              {TREE_PROTECTION.map(p => <option key={p}>{p}</option>)}
            </select>
            {errors.treeProtection && <p style={{ color: 'var(--color-red-500)', fontSize: 12, marginTop: 4, fontFamily: 'var(--font-body)' }}>{errors.treeProtection}</p>}
          </div>
          <div>
            <label className="form-label">Source *</label>
            <div className="flex gap-2" style={{ marginTop: 4 }}>
              {TREE_SOURCES.map(s => (
                <button key={s} type="button"
                  onClick={() => { setTreeSource(s); if (s !== 'Bought') setPricePerTree('') }}
                  style={{ ...toggleBaseStyle, flex: 1, ...(treeSource === s ? toggleActiveStyle : toggleInactiveStyle) }}>{s}</button>
              ))}
            </div>
            {errors.treeSource && <p style={{ color: 'var(--color-red-500)', fontSize: 12, marginTop: 4, fontFamily: 'var(--font-body)' }}>{errors.treeSource}</p>}
          </div>
          {treeSource === 'Bought' && (
            <div>
              <label className="form-label">Price per Tree <span style={{ color: 'var(--color-slate-400)', textTransform: 'none' }}>(optional)</span></label>
              <div style={{ position: 'relative', marginTop: 4 }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-slate-400)', fontSize: 13 }}>£</span>
                <input type="number" value={pricePerTree} onChange={e => setPricePerTree(e.target.value)}
                  placeholder="0.00" className="form-input" style={{ paddingLeft: 28 }} min="0" step="any" />
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
    </div>
  )
}

/* ── Step 5: Resources ────────────────────────────────────────────────── */
function StepResources({
  staffByTeam, orderedTeams, selectedNames, expandedTeams,
  isTeamFull, isTeamPartial, toggleTeamSelection, toggleMember, toggleTeamExpanded,
  machinery, selectedMachinery, toggleMachinery,
  labourEnabled, setLabourEnabled, labourType, setLabourType,
  labourPricingMethod, setLabourPricingMethod, labourRate, setLabourRate,
  labourLength, setLabourLength, labourPricingOptions,
  effectiveLabourLength, labourCost, totalTaskCost,
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Staff */}
      <div>
        <label className="form-label">Assign Staff</label>
        <div style={{ border: '1px solid var(--color-surface-300)', borderRadius: 'var(--radius-sm)', marginTop: 4 }}>
          {orderedTeams.map((team, idx) => {
            const members = staffByTeam[team]
            const full = isTeamFull(team)
            const partial = isTeamPartial(team)
            const open = expandedTeams.has(team)
            const isLast = idx === orderedTeams.length - 1
            return (
              <div key={team}>
                <div className="flex items-center gap-2" style={{
                  padding: '8px 12px',
                  borderBottom: (!isLast || open) ? '1px solid var(--color-surface-200)' : 'none',
                  background: full ? 'rgba(78,140,53,0.04)' : 'none',
                }}>
                  <input type="checkbox"
                    ref={el => { if (el) el.indeterminate = partial }}
                    checked={full}
                    onChange={() => toggleTeamSelection(team)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span style={{ flex: 1, fontSize: 13, fontFamily: 'var(--font-body)', fontWeight: 600, color: 'var(--color-slate-700)' }}>{team}</span>
                  <span style={{ fontSize: 11, color: 'var(--color-slate-400)', marginRight: 4 }}>
                    {partial ? `${members.filter(s => selectedNames.has(s.name)).length}/` : ''}{members.length}
                  </span>
                  <button type="button" onClick={() => toggleTeamExpanded(team)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, color: 'var(--color-slate-400)', display: 'flex', alignItems: 'center' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16, transition: 'transform 120ms ease', transform: open ? 'rotate(180deg)' : 'none' }}>
                      expand_more
                    </span>
                  </button>
                </div>
                {open && members.map((s, mIdx) => (
                  <label key={s.id} className="flex items-center gap-2" style={{
                    padding: '7px 12px 7px 32px', cursor: 'pointer',
                    borderBottom: (mIdx < members.length - 1 || !isLast) ? '1px solid var(--color-surface-200)' : 'none',
                    fontSize: 13, fontFamily: 'var(--font-body)', color: 'var(--color-slate-600)',
                    background: selectedNames.has(s.name) ? 'rgba(78,140,53,0.04)' : 'none',
                  }}>
                    <input type="checkbox" checked={selectedNames.has(s.name)} onChange={() => toggleMember(s.name)} />
                    <span style={{ flex: 1 }}>{s.name}</span>
                    <span style={{ fontSize: 11, color: 'var(--color-slate-400)' }}>{s.role}</span>
                  </label>
                ))}
              </div>
            )
          })}
        </div>
      </div>

      {/* Machinery */}
      <div>
        <label className="form-label">Assign Machinery</label>
        <div style={{ border: '1px solid var(--color-surface-300)', borderRadius: 'var(--radius-sm)', marginTop: 4 }}>
          {machinery.map((m, idx) => (
            <label key={m.id} className="flex items-center gap-2" style={{
              padding: '8px 12px', cursor: 'pointer',
              borderBottom: idx < machinery.length - 1 ? '1px solid var(--color-surface-200)' : 'none',
              fontSize: 13, fontFamily: 'var(--font-body)', color: 'var(--color-slate-600)',
              background: selectedMachinery.has(m.name) ? 'rgba(78,140,53,0.04)' : 'none',
            }}>
              <input type="checkbox" checked={selectedMachinery.has(m.name)} onChange={() => toggleMachinery(m.name)} />
              <span style={{ flex: 1 }}>{m.name}</span>
              <span style={{ fontSize: 11, color: 'var(--color-slate-400)' }}>{m.type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Labour toggle */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
          <div
            onClick={() => {
              setLabourEnabled(!labourEnabled)
              if (labourEnabled) { setLabourType(''); setLabourPricingMethod(''); setLabourRate(''); setLabourLength('') }
            }}
            style={{
              position: 'relative', width: 40, height: 20, borderRadius: 10,
              transition: 'background 120ms ease',
              background: labourEnabled ? 'var(--color-green-500)' : 'var(--color-surface-300)',
              cursor: 'pointer',
            }}
          >
            <div style={{
              position: 'absolute', top: 2,
              left: labourEnabled ? 22 : 2,
              width: 16, height: 16, borderRadius: '50%',
              background: 'white', transition: 'left 120ms ease',
            }} />
          </div>
          <span className="text-body" style={{ fontWeight: 600, color: 'var(--color-slate-600)' }}>Add Labour Costs</span>
        </label>

        {labourEnabled && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: 14, background: 'var(--color-surface-100)', border: '1px solid var(--color-surface-300)', borderRadius: 'var(--radius-md)' }}>
            <div>
              <label className="form-label">Labour Type</label>
              <div className="flex gap-2" style={{ marginTop: 4 }}>
                {LABOUR_TYPES.map(t => (
                  <button key={t} type="button" onClick={() => setLabourType(t)}
                    style={{ ...toggleBaseStyle, flex: 1, ...(labourType === t ? toggleActiveStyle : toggleInactiveStyle) }}>{t}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="form-label">Pricing Method</label>
              <select value={labourPricingMethod} onChange={e => setLabourPricingMethod(e.target.value)} className="form-select">
                <option value="">Select method...</option>
                {labourPricingOptions.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            {labourPricingMethod && (
              <div>
                <label className="form-label">
                  Rate ({labourPricingMethod === 'Per Hour' ? '£/hour' : labourPricingMethod === 'Per Day' ? '£/day' : labourPricingMethod === 'Per Tree' ? '£/tree' : '£/plant'})
                </label>
                <div style={{ position: 'relative', marginTop: 4 }}>
                  <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-slate-400)', fontSize: 13 }}>£</span>
                  <input type="number" value={labourRate} onChange={e => setLabourRate(e.target.value)}
                    placeholder="0.00" className="form-input" style={{ paddingLeft: 28 }} min="0" step="any" />
                </div>
              </div>
            )}
            {labourPricingMethod && (
              <div>
                <label className="form-label">
                  {labourPricingMethod === 'Per Hour' ? 'Hours' : labourPricingMethod === 'Per Day' ? 'Days' : labourPricingMethod === 'Per Tree' ? 'Number of Trees' : 'Number of Plants'}
                </label>
                {labourPricingMethod === 'Per Tree' || labourPricingMethod === 'Per Plant / Whip' ? (
                  <ReadOnlyField>{effectiveLabourLength.toLocaleString()}</ReadOnlyField>
                ) : (
                  <input type="number" value={labourLength} onChange={e => setLabourLength(e.target.value)}
                    placeholder="e.g. 5" className="form-input" min="0" step="any" />
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
    </div>
  )
}
