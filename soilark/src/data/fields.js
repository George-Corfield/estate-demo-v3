export const initialFields = [
  // === WHEAT (4 fields) ===
  {
    id: 'field-01', name: 'North Field', usage: 'Wheat',
    sizeAcres: 45.2, sizeHectares: 18.3, soilType: 'Clay', drainage: 'Good',
    currentCrop: 'Wheat', livestock: null, lastWorked: '2026-02-05',
    description: 'Primary wheat field on the northern boundary. Heavy clay soil retains moisture well for winter wheat.',
    mapPosition: { top: 5, left: 20, width: 18, height: 16 },
    activities: [
      { id: 'a-01', timestamp: '2026-02-05T10:30:00', type: 'note', title: 'Fertiliser Application', completedBy: 'John Smith', details: 'Applied NPK compound at 250kg/ha across full field.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: 'Amazone Centaur 6001', inputUsed: 'NPK 20-10-10', quantity: 250, rate: 250, units: 'kg/ha', evidence: [], source: 'manual' },
      { id: 'a-02', timestamp: '2026-01-15T09:00:00', type: 'inspection', title: 'Soil Sampling', completedBy: 'Emma Brown', details: 'Took 20 core samples for nutrient analysis. Results pending.', notes: 'Lab results expected by end of January', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'soil-sample-map.pdf', type: 'pdf' }], source: 'manual' },
      { id: 'a-50', timestamp: '2026-01-22T14:15:00', type: 'observation', title: 'Crop Walk — Winter Wheat', completedBy: 'John Smith', details: 'Winter wheat at GS23. Even plant population across the field. No signs of disease or pest damage.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [], source: 'manual' },
    ],
  },
  {
    id: 'field-02', name: 'Top Acres', usage: 'Wheat',
    sizeAcres: 38.7, sizeHectares: 15.7, soilType: 'Loam', drainage: 'Very Good',
    currentCrop: 'Wheat', livestock: null, lastWorked: '2026-01-28',
    description: 'Elevated field with rich loam soil. Consistent wheat yields year on year.',
    mapPosition: { top: 3, left: 42, width: 16, height: 14 },
    activities: [
      { id: 'a-03', timestamp: '2026-01-28T08:45:00', type: 'note', title: 'Herbicide Application', completedBy: 'David Jones', details: 'Applied selective herbicide for broad-leaved weed control.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: 'Amazone Centaur 6001', inputUsed: 'Fluroxypyr', quantity: 15.7, rate: 1.0, units: 'L/ha', evidence: [], source: 'manual' },
    ],
  },
  {
    id: 'field-03', name: 'Church Field', usage: 'Wheat',
    sizeAcres: 52.1, sizeHectares: 21.1, soilType: 'Clay', drainage: 'Good',
    currentCrop: 'Wheat', livestock: null, lastWorked: '2026-02-01',
    description: 'Large field adjacent to the parish church. Reliable wheat producer with deep clay.',
    mapPosition: { top: 22, left: 55, width: 20, height: 15 },
    activities: [
      { id: 'a-04', timestamp: '2026-02-01T11:00:00', type: 'observation', title: 'Crop Inspection', completedBy: 'John Smith', details: 'Checked crop emergence. Good even coverage, no bare patches.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [], source: 'manual' },
      { id: 'a-05', timestamp: '2026-01-10T15:30:00', type: 'inspection', title: 'Drainage Check', completedBy: 'Tom Taylor', details: 'Inspected field drains after heavy rain. All flowing well.', notes: 'Outfall at south-east corner running clear', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [], source: 'manual' },
    ],
  },
  {
    id: 'field-04', name: 'Home Field', usage: 'Wheat',
    sizeAcres: 42.0, sizeHectares: 17.0, soilType: 'Loam', drainage: 'Good',
    currentCrop: 'Wheat', livestock: null, lastWorked: '2026-02-08',
    description: 'Closest arable field to the farmstead. Convenient for trial plots and monitoring.',
    mapPosition: { top: 45, left: 38, width: 16, height: 12 },
    activities: [
      { id: 'a-06', timestamp: '2026-02-08T09:30:00', type: 'note', title: 'Fungicide Application', completedBy: 'David Jones', details: 'Applied T1 fungicide for septoria control.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: 'Prothioconazole', quantity: 17.0, rate: 0.8, units: 'L/ha', evidence: [], source: 'manual' },
      { id: 'a-07', timestamp: '2026-01-20T16:00:00', type: 'observation', title: 'Slug Damage Observed', completedBy: 'Mike Williams', details: 'Slug damage visible on headlands. Applied slug pellets to affected areas.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: 'Metaldehyde pellets', quantity: null, rate: 5, units: 'kg/ha', evidence: [], source: 'manual' },
      { id: 'a-08', timestamp: '2026-01-05T10:00:00', type: 'inspection', title: 'Soil Sampling', completedBy: 'Emma Brown', details: 'Baseline soil analysis taken. pH 6.8, adequate P and K.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'soil-analysis-report.pdf', type: 'pdf' }], source: 'manual' },
    ],
  },

  // === BARLEY (4 fields) ===
  {
    id: 'field-05', name: 'Mill Field', usage: 'Barley',
    sizeAcres: 32.5, sizeHectares: 13.2, soilType: 'Silt', drainage: 'Fair',
    currentCrop: 'Barley', livestock: null, lastWorked: '2026-01-20',
    description: 'Near the old mill site. Silty soil suits spring barley well.',
    mapPosition: { top: 25, left: 5, width: 14, height: 18 },
    activities: [
      { id: 'a-09', timestamp: '2026-01-20T08:00:00', type: 'note', title: 'Ploughing', completedBy: 'David Jones', details: 'Autumn ploughing completed. Ready for spring drilling.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: 'John Deere 6155R', inputUsed: null, quantity: null, rate: null, units: null, evidence: [], source: 'manual' },
      { id: 'a-10', timestamp: '2026-01-08T11:00:00', type: 'note', title: 'Lime Application', completedBy: 'Mike Williams', details: 'Applied 2t/ha agricultural lime to correct pH to 6.5.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: 'Agricultural lime', quantity: 26.4, rate: 2, units: 't/ha', evidence: [], source: 'manual' },
    ],
  },
  {
    id: 'field-06', name: 'Long Furlong', usage: 'Barley',
    sizeAcres: 41.3, sizeHectares: 16.7, soilType: 'Sandy', drainage: 'Very Good',
    currentCrop: 'Barley', livestock: null, lastWorked: '2026-01-18',
    description: 'Long narrow field running east-west. Light sandy soil ideal for malting barley.',
    mapPosition: { top: 40, left: 20, width: 25, height: 8 },
    activities: [
      { id: 'a-11', timestamp: '2026-01-18T09:15:00', type: 'note', title: 'Seed Bed Preparation', completedBy: 'Tom Taylor', details: 'Power harrowed to create fine tilth for spring drilling.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [], source: 'manual' },
    ],
  },
  {
    id: 'field-07', name: 'Gallows Hill', usage: 'Barley',
    sizeAcres: 38.5, sizeHectares: 15.6, soilType: 'Loam', drainage: 'Fair',
    currentCrop: 'Barley', livestock: null, lastWorked: '2026-01-30',
    description: 'Hilltop field with good loam. Winter barley performing well this season.',
    mapPosition: { top: 8, left: 82, width: 12, height: 15 },
    activities: [
      { id: 'a-12', timestamp: '2026-01-30T14:00:00', type: 'observation', title: 'Crop Walk', completedBy: 'John Smith', details: 'Winter barley at GS25. Good tiller count, no disease visible.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [], source: 'manual' },
      { id: 'a-13', timestamp: '2026-01-12T10:30:00', type: 'note', title: 'Fertiliser Application', completedBy: 'Sarah Wilson', details: 'First nitrogen application at 40kg N/ha.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: 'Ammonium nitrate', quantity: null, rate: 40, units: 'kg N/ha', evidence: [], source: 'manual' },
    ],
  },
  {
    id: 'field-08', name: 'Warren Piece', usage: 'Barley',
    sizeAcres: 33.8, sizeHectares: 13.7, soilType: 'Chalk', drainage: 'Very Good',
    currentCrop: 'Barley', livestock: null, lastWorked: '2026-01-25',
    description: 'Chalky soil on the hillside. Named after the old rabbit warren. Good for spring barley.',
    mapPosition: { top: 12, left: 65, width: 14, height: 12 },
    activities: [
      { id: 'a-14', timestamp: '2026-01-25T08:30:00', type: 'note', title: 'Rolling', completedBy: 'Tom Taylor', details: 'Cambridge rolled to consolidate seedbed and push stones.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [], source: 'manual' },
      { id: 'a-51', timestamp: '2026-02-10T09:00:00', type: 'task', title: 'Plant Winter Wheat — Task Created', completedBy: 'System', details: 'Task "Plant Winter Wheat" was created and linked to this field.', notes: null, linkedTaskId: 'task-03', taskAction: 'created', linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [], source: 'task-system' },
      { id: 'a-52', timestamp: '2026-02-11T07:45:00', type: 'task', title: 'Plant Winter Wheat — Started', completedBy: 'David Jones', details: 'Drilling commenced. Skyfall Winter Wheat at 180 kg/ha via direct drill.', notes: null, linkedTaskId: 'task-03', taskAction: 'started', linkedEventId: null, machineryUsed: 'John Deere 6155R', inputUsed: 'Skyfall Winter Wheat', quantity: 3060, rate: 180, units: 'kg/ha', evidence: [], source: 'task-system' },
    ],
  },

  // === MAIZE (3 fields) ===
  {
    id: 'field-09', name: 'Bottom Meadow', usage: 'Maize',
    sizeAcres: 42.0, sizeHectares: 17.0, soilType: 'Silt', drainage: 'Fair',
    currentCrop: 'Maize', livestock: null, lastWorked: '2026-02-06',
    description: 'Low-lying field with deep silty soil. Warm and sheltered, good for maize.',
    mapPosition: { top: 72, left: 45, width: 20, height: 14 },
    activities: [
      { id: 'a-15', timestamp: '2026-02-06T07:30:00', type: 'observation', title: 'Soil Temperature Check', completedBy: 'Emma Brown', details: 'Soil at 8°C at 10cm depth. Need 10°C for drilling.', notes: 'Will re-check in two weeks', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [], source: 'manual' },
      { id: 'a-16', timestamp: '2026-01-22T08:00:00', type: 'note', title: 'Muck Spreading', completedBy: 'Mike Williams', details: 'Applied 30t/ha FYM for organic matter and nutrients.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: 'Farmyard manure', quantity: 510, rate: 30, units: 't/ha', evidence: [], source: 'manual' },
    ],
  },
  {
    id: 'field-10', name: 'Ox Close', usage: 'Maize',
    sizeAcres: 35.0, sizeHectares: 14.2, soilType: 'Loam', drainage: 'Good',
    currentCrop: 'Maize', livestock: null, lastWorked: '2026-01-22',
    description: 'Enclosed field with good shelter from the tree line. Warm microclimate for maize.',
    mapPosition: { top: 60, left: 5, width: 14, height: 16 },
    activities: [
      { id: 'a-17', timestamp: '2026-01-22T11:00:00', type: 'note', title: 'Cover Crop Destruction', completedBy: 'David Jones', details: 'Sprayed off mustard cover crop ahead of maize drilling.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: 'Glyphosate', quantity: null, rate: 3, units: 'L/ha', evidence: [], source: 'manual' },
    ],
  },
  {
    id: 'field-11', name: 'Leys Paddock', usage: 'Maize',
    sizeAcres: 38.0, sizeHectares: 15.4, soilType: 'Sandy', drainage: 'Good',
    currentCrop: 'Maize', livestock: null, lastWorked: '2026-02-04',
    description: 'Free-draining sandy field. Warms up quickly in spring for early maize drilling.',
    mapPosition: { top: 76, left: 10, width: 16, height: 12 },
    activities: [
      { id: 'a-18', timestamp: '2026-02-04T08:00:00', type: 'note', title: 'Ploughing', completedBy: 'Tom Taylor', details: 'Ploughed and pressed ready for spring. Good clod break-up.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: 'John Deere 6155R', inputUsed: null, quantity: null, rate: null, units: null, evidence: [], source: 'manual' },
      { id: 'a-19', timestamp: '2026-01-15T14:00:00', type: 'note', title: 'Herbicide Application', completedBy: 'Sarah Wilson', details: 'Pre-emergence herbicide applied for annual meadow grass.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [], source: 'manual' },
    ],
  },

  // === OATS (4 fields) ===
  {
    id: 'field-12', name: 'Park Field', usage: 'Oats',
    sizeAcres: 40.0, sizeHectares: 16.2, soilType: 'Loam', drainage: 'Good',
    currentCrop: 'Oats', livestock: null, lastWorked: '2026-01-28',
    description: 'Former parkland with scattered mature trees. Rich loam well suited to oats.',
    mapPosition: { top: 48, left: 50, width: 12, height: 10 },
    activities: [
      { id: 'a-20', timestamp: '2026-01-28T09:00:00', type: 'note', title: 'Seed Bed Preparation', completedBy: 'David Jones', details: 'Disc harrowed to incorporate crop residues.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [], source: 'manual' },
      { id: 'a-21', timestamp: '2026-01-10T10:30:00', type: 'inspection', title: 'Soil Sampling', completedBy: 'Emma Brown', details: 'pH 6.2 — slightly acidic, may need lime next rotation.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [], source: 'manual' },
    ],
  },
  {
    id: 'field-13', name: 'Clover Piece', usage: 'Oats',
    sizeAcres: 28.0, sizeHectares: 11.3, soilType: 'Sandy', drainage: 'Good',
    currentCrop: 'Oats', livestock: null, lastWorked: '2026-02-02',
    description: 'Previously a clover ley providing good nitrogen base for oats.',
    mapPosition: { top: 18, left: 35, width: 12, height: 10 },
    activities: [
      { id: 'a-22', timestamp: '2026-02-02T08:30:00', type: 'note', title: 'Drilling', completedBy: 'John Smith', details: 'Drilled spring oats at 160kg/ha. Good soil conditions.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: 'Spring oats seed', quantity: null, rate: 160, units: 'kg/ha', evidence: [], source: 'manual' },
    ],
  },
  {
    id: 'field-14', name: 'Triangle', usage: 'Oats',
    sizeAcres: 41.0, sizeHectares: 16.6, soilType: 'Clay', drainage: 'Fair',
    currentCrop: 'Oats', livestock: null, lastWorked: '2026-01-20',
    description: 'Triangular field at the road junction. Heavier clay but oats handle it well.',
    mapPosition: { top: 78, left: 75, width: 14, height: 12 },
    activities: [
      { id: 'a-23', timestamp: '2026-01-20T08:00:00', type: 'note', title: 'Ploughing', completedBy: 'Tom Taylor', details: 'Autumn ploughed to allow frost to break down clay clods.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: 'John Deere 6155R', inputUsed: null, quantity: null, rate: null, units: null, evidence: [], source: 'manual' },
      { id: 'a-24', timestamp: '2026-01-05T13:00:00', type: 'inspection', title: 'Drainage Assessment', completedBy: 'Mike Williams', details: 'Checked tile drains. Two outlets blocked — cleared.', notes: 'Scheduled follow-up check in 4 weeks', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [], source: 'manual' },
      { id: 'a-25', timestamp: '2025-12-18T09:00:00', type: 'note', title: 'Muck Spreading', completedBy: 'Sarah Wilson', details: 'Applied 25t/ha cattle muck before ploughing.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: 'Cattle manure', quantity: null, rate: 25, units: 't/ha', evidence: [], source: 'manual' },
    ],
  },
  {
    id: 'field-15', name: 'Sheep Down', usage: 'Oats',
    sizeAcres: 48.0, sizeHectares: 19.4, soilType: 'Chalk', drainage: 'Very Good',
    currentCrop: 'Oats', livestock: null, lastWorked: '2026-02-09',
    description: 'Chalk downland with excellent natural drainage. Light oat variety performing well.',
    mapPosition: { top: 28, left: 80, width: 16, height: 18 },
    activities: [
      { id: 'a-26', timestamp: '2026-02-09T10:00:00', type: 'observation', title: 'Crop Walk', completedBy: 'John Smith', details: 'Spring oats emerging well. Even plant population.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [], source: 'manual' },
      { id: 'a-53', timestamp: '2026-02-03T15:20:00', type: 'observation', title: 'Pest Sighting — Aphids', completedBy: 'Emma Brown', details: 'Small colonies of grain aphid found on lower leaves. Below spray threshold but worth monitoring.', notes: 'Re-check in 7 days', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [], source: 'manual' },
    ],
  },

  // === GRASS (4 fields) ===
  {
    id: 'field-16', name: 'Big Meadow', usage: 'Grass',
    sizeAcres: 62.0, sizeHectares: 25.1, soilType: 'Clay', drainage: 'Good',
    currentCrop: 'Grass', livestock: null, lastWorked: '2026-01-12',
    description: 'Largest grass field on the estate. Used for hay and silage production.',
    mapPosition: { top: 65, left: 58, width: 20, height: 14 },
    activities: [
      { id: 'a-27', timestamp: '2026-01-12T09:00:00', type: 'note', title: 'Mole Drainage', completedBy: 'David Jones', details: 'Ran mole plough across wettest sections to improve drainage.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: 'John Deere 6155R', inputUsed: null, quantity: null, rate: null, units: null, evidence: [], source: 'manual' },
      { id: 'a-28', timestamp: '2025-12-20T11:00:00', type: 'note', title: 'Fertiliser Application', completedBy: 'Sarah Wilson', details: 'Applied P and K maintenance dressing.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [], source: 'manual' },
    ],
  },
  {
    id: 'field-17', name: 'The Ley', usage: 'Grass',
    sizeAcres: 48.0, sizeHectares: 19.4, soilType: 'Loam', drainage: 'Good',
    currentCrop: 'Grass', livestock: null, lastWorked: '2026-02-07',
    description: 'Temporary grass ley in rotation. Italian ryegrass and clover mix.',
    mapPosition: { top: 35, left: 48, width: 14, height: 10 },
    activities: [
      { id: 'a-29', timestamp: '2026-02-07T14:30:00', type: 'observation', title: 'Growth Assessment', completedBy: 'John Smith', details: 'Measured grass height at 8cm. Growth starting to pick up.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [], source: 'manual' },
      { id: 'a-54', timestamp: '2026-02-05T17:30:00', type: 'task', title: 'Harvest Hay — Completed', completedBy: 'David Jones', details: 'Late winter hay harvest completed. 82 round bales carted to Main Barn. Grade A quality.', notes: null, linkedTaskId: 'task-04', taskAction: 'completed', linkedEventId: null, machineryUsed: 'New Holland T7.270, Krone BiG X 1180', inputUsed: null, quantity: null, rate: null, units: null, evidence: [], source: 'task-system' },
      { id: 'a-55', timestamp: '2026-02-03T07:00:00', type: 'task', title: 'Harvest Hay — Started', completedBy: 'David Jones', details: 'Hay cutting commenced on The Ley. Italian Ryegrass 1st cut (winter).', notes: null, linkedTaskId: 'task-04', taskAction: 'started', linkedEventId: null, machineryUsed: 'New Holland T7.270', inputUsed: null, quantity: null, rate: null, units: null, evidence: [], source: 'task-system' },
      { id: 'a-56', timestamp: '2026-01-28T10:00:00', type: 'task', title: 'Harvest Hay — Task Created', completedBy: 'System', details: 'Task "Harvest Hay" was created and linked to this field.', notes: null, linkedTaskId: 'task-04', taskAction: 'created', linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [], source: 'task-system' },
    ],
  },
  {
    id: 'field-18', name: 'Hay Meadow', usage: 'Grass',
    sizeAcres: 35.3, sizeHectares: 14.3, soilType: 'Silt', drainage: 'Fair',
    currentCrop: 'Grass', livestock: null, lastWorked: '2026-01-05',
    description: 'Species-rich traditional hay meadow under environmental stewardship.',
    mapPosition: { top: 82, left: 30, width: 18, height: 10 },
    activities: [
      { id: 'a-30', timestamp: '2026-01-05T10:00:00', type: 'observation', title: 'Wildflower Survey', completedBy: 'Emma Brown', details: 'Winter survey completed. 32 grass and wildflower species recorded.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'wildflower-survey-2026.xlsx', type: 'spreadsheet' }], source: 'manual' },
      { id: 'a-31', timestamp: '2025-12-10T14:00:00', type: 'note', title: 'Fence Repair', completedBy: 'Mike Williams', details: 'Replaced 20m of post and wire along road boundary.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [], source: 'manual' },
    ],
  },
  {
    id: 'field-19', name: 'River Meadow', usage: 'Grass',
    sizeAcres: 52.0, sizeHectares: 21.0, soilType: 'Peat', drainage: 'Poor',
    currentCrop: 'Grass', livestock: null, lastWorked: '2025-12-15',
    description: 'Flood meadow along the river. Wet grassland managed for conservation.',
    mapPosition: { top: 88, left: 55, width: 22, height: 8 },
    activities: [
      { id: 'a-32', timestamp: '2025-12-15T09:30:00', type: 'observation', title: 'Bird Survey', completedBy: 'Emma Brown', details: 'Winter bird count. Snipe, lapwing, and redshank recorded.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [], source: 'manual' },
      { id: 'a-57', timestamp: '2026-01-18T11:00:00', type: 'inspection', title: 'Flood Risk Assessment', completedBy: 'Tom Taylor', details: 'Assessed water levels and bank condition following recent rain. River level 0.4m below bank top. No immediate risk.', notes: 'Environment Agency notified of raised levels', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [], source: 'manual' },
    ],
  },

  // === POTATOES (3 fields) ===
  {
    id: 'field-20', name: 'Home Pasture', usage: 'Potatoes',
    sizeAcres: 55.0, sizeHectares: 22.3, soilType: 'Sandy', drainage: 'Good',
    currentCrop: 'Potatoes', livestock: null, lastWorked: '2026-02-10',
    description: 'Light sandy soil ideal for potato production. Easy stone picking.',
    mapPosition: { top: 58, left: 25, width: 18, height: 16 },
    activities: [
      { id: 'a-33', timestamp: '2026-02-10T08:00:00', type: 'note', title: 'De-stoning', completedBy: 'Tom Taylor', details: 'Stone separated and windrowed. Bed ready for planting.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [], source: 'manual' },
      { id: 'a-34', timestamp: '2026-01-25T10:00:00', type: 'inspection', title: 'Soil Sampling — PCN Test', completedBy: 'Emma Brown', details: 'PCN test results clear. Safe for potato cropping.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'pcn-test-results.pdf', type: 'pdf' }], source: 'manual' },
      { id: 'a-35', timestamp: '2026-01-10T08:30:00', type: 'note', title: 'Ploughing', completedBy: 'David Jones', details: 'Deep ploughed to 12 inches for good root development.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: 'John Deere 6155R', inputUsed: null, quantity: null, rate: null, units: null, evidence: [], source: 'manual' },
    ],
  },
  {
    id: 'field-21', name: 'Horse Paddock', usage: 'Potatoes',
    sizeAcres: 42.0, sizeHectares: 17.0, soilType: 'Loam', drainage: 'Very Good',
    currentCrop: 'Potatoes', livestock: null, lastWorked: '2026-01-30',
    description: 'Well-drained loam field. Excellent potato land with good tilth.',
    mapPosition: { top: 50, left: 78, width: 14, height: 12 },
    activities: [
      { id: 'a-36', timestamp: '2026-01-30T08:00:00', type: 'note', title: 'Bed Formation', completedBy: 'Mike Williams', details: 'Formed beds at 90cm spacing ready for planting.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [], source: 'manual' },
      { id: 'a-37', timestamp: '2026-01-15T10:00:00', type: 'note', title: 'Fertiliser Application', completedBy: 'Sarah Wilson', details: 'Applied 200kg/ha compound fertiliser in beds.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: 'NPK compound', quantity: null, rate: 200, units: 'kg/ha', evidence: [], source: 'manual' },
    ],
  },
  {
    id: 'field-22', name: 'Brook Field', usage: 'Potatoes',
    sizeAcres: 28.4, sizeHectares: 11.5, soilType: 'Sandy', drainage: 'Good',
    currentCrop: 'Potatoes', livestock: null, lastWorked: '2026-02-03',
    description: 'Borders the brook on the eastern boundary. Light soil warms quickly for earlies.',
    mapPosition: { top: 50, left: 60, width: 15, height: 14 },
    activities: [
      { id: 'a-38', timestamp: '2026-02-03T11:00:00', type: 'inspection', title: 'Irrigation Check', completedBy: 'Tom Taylor', details: 'Tested reel and boom irrigator. Ready for season.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [], source: 'manual' },
      { id: 'a-39', timestamp: '2026-01-18T15:00:00', type: 'note', title: 'Seed Potato Delivery', completedBy: 'John Smith', details: 'Received 3t Maris Piper seed. Stored in chitting trays.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: 'Maris Piper seed', quantity: 3, rate: null, units: 't', evidence: [], source: 'manual' },
      { id: 'a-40', timestamp: '2026-01-05T08:00:00', type: 'note', title: 'Ploughing', completedBy: 'David Jones', details: 'Autumn ploughed with skim coulters for clean finish.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: 'John Deere 6155R', inputUsed: null, quantity: null, rate: null, units: null, evidence: [], source: 'manual' },
      { id: 'a-41', timestamp: '2025-12-20T10:00:00', type: 'inspection', title: 'Soil Analysis', completedBy: 'Emma Brown', details: 'Full nutrient analysis. Good P and K indices.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [], source: 'manual' },
    ],
  },

  // === OILSEED RAPE (3 fields) ===
  {
    id: 'field-23', name: 'Badger Wood', usage: 'Oilseed rape',
    sizeAcres: 46.5, sizeHectares: 18.8, soilType: 'Clay', drainage: 'Good',
    currentCrop: 'Oilseed rape', livestock: null, lastWorked: '2026-02-03',
    description: 'Heavy clay field adjacent to Badger Wood. OSR established well in autumn.',
    mapPosition: { top: 2, left: 2, width: 16, height: 20 },
    activities: [
      { id: 'a-42', timestamp: '2026-02-03T10:00:00', type: 'observation', title: 'Pest Monitoring', completedBy: 'Emma Brown', details: 'Checked for cabbage stem flea beetle. Threshold not reached.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [], source: 'manual' },
      { id: 'a-43', timestamp: '2026-01-15T09:30:00', type: 'note', title: 'Fungicide Application', completedBy: 'David Jones', details: 'Applied fungicide for light leaf spot prevention.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [], source: 'manual' },
      { id: 'a-44', timestamp: '2026-01-02T14:00:00', type: 'observation', title: 'Crop Walk', completedBy: 'John Smith', details: 'Plants at green area index 0.8. Good canopy development.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [], source: 'manual' },
      { id: 'a-58', timestamp: '2026-02-12T16:00:00', type: 'observation', title: 'Weather Damage Assessment', completedBy: 'John Smith', details: 'Inspected field after Storm Eowyn. Minor waterlogging in SW corner but no structural crop damage. Plants recovered well.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [], source: 'manual' },
    ],
  },
  {
    id: 'field-24', name: 'New Plantation', usage: 'Oilseed rape',
    sizeAcres: 49.4, sizeHectares: 20.0, soilType: 'Loam', drainage: 'Good',
    currentCrop: 'Oilseed rape', livestock: null, lastWorked: '2026-02-01',
    description: 'Good deep loam. Autumn-sown OSR with vigorous establishment.',
    mapPosition: { top: 60, left: 82, width: 14, height: 16 },
    activities: [
      { id: 'a-45', timestamp: '2026-02-01T10:00:00', type: 'note', title: 'Nitrogen Application', completedBy: 'Sarah Wilson', details: 'First split of nitrogen at 60kg N/ha.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: 'Ammonium nitrate', quantity: null, rate: 60, units: 'kg N/ha', evidence: [], source: 'manual' },
      { id: 'a-46', timestamp: '2026-01-10T13:00:00', type: 'observation', title: 'Pigeon Scaring', completedBy: 'Mike Williams', details: 'Erected additional pigeon scarers. Moderate damage on headlands.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [], source: 'manual' },
    ],
  },
  {
    id: 'field-25', name: 'Spinney', usage: 'Oilseed rape',
    sizeAcres: 34.7, sizeHectares: 14.0, soilType: 'Chalk', drainage: 'Fair',
    currentCrop: 'Oilseed rape', livestock: null, lastWorked: '2026-01-20',
    description: 'Chalky field beside the spinney copse. OSR benefits from the free lime.',
    mapPosition: { top: 35, left: 2, width: 10, height: 14 },
    activities: [
      { id: 'a-47', timestamp: '2026-01-20T09:00:00', type: 'observation', title: 'Slug Monitoring', completedBy: 'Tom Taylor', details: 'Set traps — below threshold. No treatment required.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [], source: 'manual' },
      { id: 'a-48', timestamp: '2025-12-20T14:30:00', type: 'observation', title: 'Crop Inspection', completedBy: 'John Smith', details: 'Plants well established with 6-8 true leaves. No pigeon damage.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [], source: 'manual' },
    ],
  },
]
