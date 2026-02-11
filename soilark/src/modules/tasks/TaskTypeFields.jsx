import { formatGBP } from '../../utils/currency'

export default function TaskTypeFields({ task }) {
  const tf = task.typeFields
  if (!tf) {
    return <p className="text-sm text-slate-400">No type-specific fields for this task.</p>
  }

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
      return (
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Planting Details</h3>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Purpose" value={tf.purpose} />
            <Field label="Planting Type" value={tf.plantingType} />
            <Field label="Crop Mix" value={tf.cropMix} />
            <Field label="Area" value={`${tf.area} ha`} />
            <Field label="Seed Rate" value={`${tf.seedRate} ${tf.rateUnit}`} />
            <Field label="Total Seeds" value={`${tf.totalSeeds} kg`} />
            <Field label="Source" value={tf.source} />
            <Field label="Price" value={formatGBP(tf.price)} />
            <Field label="Total Cost" value={formatGBP(tf.totalCost)} />
            <Field label="Method" value={tf.establishmentMethod} />
          </div>
        </div>
      )

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

function Field({ label, value }) {
  return (
    <div className="p-3 bg-slate-50 rounded-lg">
      <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">{label}</p>
      <p className="text-sm font-medium text-slate-800">{value}</p>
    </div>
  )
}
