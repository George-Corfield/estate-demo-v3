import { formatGBP } from '../../utils/currency'

export default function TaskTypeFields({ task }) {
  const tf = task.typeFields
  if (!tf || Object.keys(tf).length === 0) {
    return <p className="text-sm text-slate-400">No type-specific fields for this task.</p>
  }

  return (
    <div className="space-y-6">
      <TypeSpecificFields task={task} tf={tf} />
      {tf.labourEnabled && <LabourFields tf={tf} />}
    </div>
  )
}

function TypeSpecificFields({ task, tf }) {
  switch (task.type) {
    case 'Fertilizing':
      return (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Fertilising Details</h3>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Product" value={tf.product} />
            <Field label="Area" value={`${tf.areaHa} ha`} />
            <Field label="Application Rate" value={`${tf.applicationRate} kg/ha`} />
            <Field label="Method" value={tf.applicationMethod} />
            <Field label="Source" value={tf.source} />
            <Field label="Price/Unit" value={formatGBP(tf.pricePerUnit)} />
            <Field label="Total Applied" value={`${tf.totalApplied} kg`} />
            <Field label="Total Cost" value={formatGBP(tf.totalCost)} />
          </div>
        </div>
      )

    case 'Planting':
      return <PlantingFields tf={tf} />

    case 'Harvesting':
      return (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Harvesting Details</h3>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Expected Yield" value={tf.expectedYield} />
            <Field label="Storage Location" value={tf.storageLocation} />
            <Field label="Quality Grade" value={tf.qualityGrade} />
            <Field label="Harvest Type" value={tf.harvestType} />
            <Field label="Crop" value={tf.crop} />
            {tf.baleType && <Field label="Bale Type" value={tf.baleType} />}
            {tf.cutNumber && <Field label="Cut Number" value={tf.cutNumber} />}
            {tf.moistureContent && <Field label="Moisture" value={tf.moistureContent} />}
          </div>
        </div>
      )

    case 'Maintenance':
      return (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Maintenance Details</h3>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Est. Hours" value={`${tf.estimatedHours}h`} />
            <Field label="Urgency" value={tf.urgency} />
            <Field label="Type" value={tf.maintenanceType} />
            <Field label="Equipment" value={tf.equipment} />
          </div>
          {tf.faultDescription && (
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Fault Description</p>
              <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">{tf.faultDescription}</p>
            </div>
          )}
          {tf.partsNeeded && (
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Parts Needed</p>
              <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">{tf.partsNeeded}</p>
            </div>
          )}
        </div>
      )

    default:
      return <p className="text-sm text-slate-400">No type-specific fields for "{task.type}" tasks.</p>
  }
}

function PlantingFields({ tf }) {
  switch (tf.plantingSubtype) {
    case 'Crop/Seed':
      return (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Crop / Seed Details</h3>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Crop / Mix" value={tf.cropMix} />
            <Field label="Area" value={`${tf.area} ha`} />
            <Field label="Seed Rate" value={`${tf.rate} ${tf.rateUnit}`} />
            <Field
              label="Total Seed Required"
              value={tf.rateUnit === 'kg/ha'
                ? `${tf.totalSeedRequired?.toFixed(1)} kg`
                : `${Math.round(tf.totalSeedRequired || 0).toLocaleString()} seeds`}
            />
            <Field label="Source" value={tf.seedSource} />
            {tf.price != null && <Field label="Price" value={formatGBP(tf.price)} />}
            {tf.totalSeedCost != null && <Field label="Total Seed Cost" value={formatGBP(tf.totalSeedCost)} />}
            <Field label="Establishment Method" value={tf.establishmentMethod} />
          </div>
        </div>
      )

    case 'Hedges':
      return (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hedge Details</h3>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Hedge Plant" value={tf.hedgePlant} />
            <Field label="Hedge Length" value={`${tf.hedgeLength?.toLocaleString()} m`} />
            <Field label="Rows" value={tf.rows} />
            <Field label="Plants / m" value={tf.plantsPerMetre} />
            <Field label="Total Plants Required" value={tf.totalPlantsRequired?.toLocaleString()} />
            <Field label="Protection" value={tf.hedgeProtection} />
            <Field label="Plant Source" value={tf.plantSource} />
            {tf.pricePerPlant != null && <Field label="Price per Plant" value={formatGBP(tf.pricePerPlant)} />}
            {tf.totalPlantCost != null && <Field label="Total Plant Cost" value={formatGBP(tf.totalPlantCost)} />}
          </div>
        </div>
      )

    case 'Trees':
      return (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tree Details</h3>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tree Species" value={tf.treeSpecies} />
            <Field label="Quantity" value={tf.quantity?.toLocaleString()} />
            <Field label="Stock Type" value={tf.stockType} />
            <Field label="Planting Pattern" value={tf.plantingPattern} />
            <Field label="Protection" value={tf.treeProtection} />
            <Field label="Source" value={tf.treeSource} />
            {tf.pricePerTree != null && <Field label="Price per Tree" value={formatGBP(tf.pricePerTree)} />}
            {tf.totalTreeCost != null && <Field label="Total Tree Cost" value={formatGBP(tf.totalTreeCost)} />}
          </div>
        </div>
      )

    default:
      // Backwards compatibility — old planting tasks without subtypes
      return (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Planting Details</h3>
          <div className="grid grid-cols-2 gap-3">
            {tf.purpose && <Field label="Purpose" value={tf.purpose} />}
            {tf.plantingType && <Field label="Planting Type" value={tf.plantingType} />}
            {tf.cropMix && <Field label="Crop Mix" value={tf.cropMix} />}
            {tf.area != null && <Field label="Area" value={`${tf.area} ha`} />}
            {tf.seedRate != null && <Field label="Seed Rate" value={`${tf.seedRate} ${tf.rateUnit || 'kg/ha'}`} />}
            {tf.totalSeeds != null && <Field label="Total Seeds" value={`${tf.totalSeeds} kg`} />}
            {tf.source && <Field label="Source" value={tf.source} />}
            {tf.price != null && <Field label="Price" value={formatGBP(tf.price)} />}
            {tf.totalCost != null && <Field label="Total Cost" value={formatGBP(tf.totalCost)} />}
            {tf.establishmentMethod && <Field label="Method" value={tf.establishmentMethod} />}
          </div>
        </div>
      )
  }
}

function LabourFields({ tf }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider">Labour Details</h3>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Labour Type" value={tf.labourType} />
        <Field label="Pricing Method" value={tf.labourPricingMethod} />
        <Field label="Rate" value={formatGBP(tf.labourRate)} />
        <Field
          label={tf.labourPricingMethod === 'Per Tree' ? 'Trees' : tf.labourPricingMethod === 'Per Plant / Whip' ? 'Plants' : tf.labourPricingMethod === 'Per Hour' ? 'Hours' : 'Days'}
          value={tf.labourLength?.toLocaleString()}
        />
        <Field label="Labour Cost" value={formatGBP(tf.labourCost)} />
        <Field label="Total Task Cost" value={formatGBP(tf.totalTaskCost)} highlight />
      </div>
    </div>
  )
}

function Field({ label, value, highlight }) {
  return (
    <div className="p-3 bg-slate-50 rounded-lg">
      <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">{label}</p>
      <p className={`text-sm ${highlight ? 'font-bold text-slate-900' : 'font-medium text-slate-800'}`}>{value}</p>
    </div>
  )
}
