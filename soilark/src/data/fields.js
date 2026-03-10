export const initialFields = [
  // === WHEAT (4 fields) ===
  {
    id: 'field-01', name: 'North Field', usage: 'Wheat',
    sizeAcres: 45.2, sizeHectares: 18.3, soilType: 'Clay', drainage: 'Good',
    currentCrop: 'Wheat', livestock: null, lastWorked: '2026-02-05',
    description: 'Primary wheat field on the northern boundary. Heavy clay soil retains moisture well for winter wheat.',
    mapPosition: { top: 5, left: 20, width: 18, height: 16 },
    activities: [
      { id: 'a-01', date: '2026-02-05', title: 'Fertiliser Application', details: 'Applied NPK compound at 250kg/ha across full field.', user: 'John Smith' },
      { id: 'a-02', date: '2026-01-15', title: 'Soil Sampling', details: 'Took 20 core samples for nutrient analysis. Results pending.', user: 'Emma Brown' },
    ],
  },
  {
    id: 'field-02', name: 'Top Acres', usage: 'Wheat',
    sizeAcres: 38.7, sizeHectares: 15.7, soilType: 'Loam', drainage: 'Very Good',
    currentCrop: 'Wheat', livestock: null, lastWorked: '2026-01-28',
    description: 'Elevated field with rich loam soil. Consistent wheat yields year on year.',
    mapPosition: { top: 3, left: 42, width: 16, height: 14 },
    activities: [
      { id: 'a-03', date: '2026-01-28', title: 'Herbicide Application', details: 'Applied selective herbicide for broad-leaved weed control.', user: 'David Jones' },
    ],
  },
  {
    id: 'field-03', name: 'Church Field', usage: 'Wheat',
    sizeAcres: 52.1, sizeHectares: 21.1, soilType: 'Clay', drainage: 'Good',
    currentCrop: 'Wheat', livestock: null, lastWorked: '2026-02-01',
    description: 'Large field adjacent to the parish church. Reliable wheat producer with deep clay.',
    mapPosition: { top: 22, left: 55, width: 20, height: 15 },
    activities: [
      { id: 'a-04', date: '2026-02-01', title: 'Crop Inspection', details: 'Checked crop emergence. Good even coverage, no bare patches.', user: 'John Smith' },
      { id: 'a-05', date: '2026-01-10', title: 'Drainage Check', details: 'Inspected field drains after heavy rain. All flowing well.', user: 'Tom Taylor' },
    ],
  },
  {
    id: 'field-04', name: 'Home Field', usage: 'Wheat',
    sizeAcres: 42.0, sizeHectares: 17.0, soilType: 'Loam', drainage: 'Good',
    currentCrop: 'Wheat', livestock: null, lastWorked: '2026-02-08',
    description: 'Closest arable field to the farmstead. Convenient for trial plots and monitoring.',
    mapPosition: { top: 45, left: 38, width: 16, height: 12 },
    activities: [
      { id: 'a-06', date: '2026-02-08', title: 'Fungicide Application', details: 'Applied T1 fungicide for septoria control.', user: 'David Jones' },
      { id: 'a-07', date: '2026-01-20', title: 'Slug Pellets', details: 'Applied slug pellets to headlands where damage observed.', user: 'Mike Williams' },
      { id: 'a-08', date: '2026-01-05', title: 'Soil Sampling', details: 'Baseline soil analysis taken. pH 6.8, adequate P and K.', user: 'Emma Brown' },
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
      { id: 'a-09', date: '2026-01-20', title: 'Ploughing', details: 'Autumn ploughing completed. Ready for spring drilling.', user: 'David Jones' },
      { id: 'a-10', date: '2026-01-08', title: 'Lime Application', details: 'Applied 2t/ha agricultural lime to correct pH to 6.5.', user: 'Mike Williams' },
    ],
  },
  {
    id: 'field-06', name: 'Long Furlong', usage: 'Barley',
    sizeAcres: 41.3, sizeHectares: 16.7, soilType: 'Sandy', drainage: 'Very Good',
    currentCrop: 'Barley', livestock: null, lastWorked: '2026-01-18',
    description: 'Long narrow field running east-west. Light sandy soil ideal for malting barley.',
    mapPosition: { top: 40, left: 20, width: 25, height: 8 },
    activities: [
      { id: 'a-11', date: '2026-01-18', title: 'Seed Bed Preparation', details: 'Power harrowed to create fine tilth for spring drilling.', user: 'Tom Taylor' },
    ],
  },
  {
    id: 'field-07', name: 'Gallows Hill', usage: 'Barley',
    sizeAcres: 38.5, sizeHectares: 15.6, soilType: 'Loam', drainage: 'Fair',
    currentCrop: 'Barley', livestock: null, lastWorked: '2026-01-30',
    description: 'Hilltop field with good loam. Winter barley performing well this season.',
    mapPosition: { top: 8, left: 82, width: 12, height: 15 },
    activities: [
      { id: 'a-12', date: '2026-01-30', title: 'Crop Walk', details: 'Winter barley at GS25. Good tiller count, no disease visible.', user: 'John Smith' },
      { id: 'a-13', date: '2026-01-12', title: 'Fertiliser Application', details: 'First nitrogen application at 40kg N/ha.', user: 'Sarah Wilson' },
    ],
  },
  {
    id: 'field-08', name: 'Warren Piece', usage: 'Barley',
    sizeAcres: 33.8, sizeHectares: 13.7, soilType: 'Chalk', drainage: 'Very Good',
    currentCrop: 'Barley', livestock: null, lastWorked: '2026-01-25',
    description: 'Chalky soil on the hillside. Named after the old rabbit warren. Good for spring barley.',
    mapPosition: { top: 12, left: 65, width: 14, height: 12 },
    activities: [
      { id: 'a-14', date: '2026-01-25', title: 'Rolling', details: 'Cambridge rolled to consolidate seedbed and push stones.', user: 'Tom Taylor' },
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
      { id: 'a-15', date: '2026-02-06', title: 'Soil Temperature Check', details: 'Soil at 8°C at 10cm depth. Need 10°C for drilling.', user: 'Emma Brown' },
      { id: 'a-16', date: '2026-01-22', title: 'Muck Spreading', details: 'Applied 30t/ha FYM for organic matter and nutrients.', user: 'Mike Williams' },
    ],
  },
  {
    id: 'field-10', name: 'Ox Close', usage: 'Maize',
    sizeAcres: 35.0, sizeHectares: 14.2, soilType: 'Loam', drainage: 'Good',
    currentCrop: 'Maize', livestock: null, lastWorked: '2026-01-22',
    description: 'Enclosed field with good shelter from the tree line. Warm microclimate for maize.',
    mapPosition: { top: 60, left: 5, width: 14, height: 16 },
    activities: [
      { id: 'a-17', date: '2026-01-22', title: 'Cover Crop Destruction', details: 'Sprayed off mustard cover crop ahead of maize drilling.', user: 'David Jones' },
    ],
  },
  {
    id: 'field-11', name: 'Leys Paddock', usage: 'Maize',
    sizeAcres: 38.0, sizeHectares: 15.4, soilType: 'Sandy', drainage: 'Good',
    currentCrop: 'Maize', livestock: null, lastWorked: '2026-02-04',
    description: 'Free-draining sandy field. Warms up quickly in spring for early maize drilling.',
    mapPosition: { top: 76, left: 10, width: 16, height: 12 },
    activities: [
      { id: 'a-18', date: '2026-02-04', title: 'Ploughing', details: 'Ploughed and pressed ready for spring. Good clod break-up.', user: 'Tom Taylor' },
      { id: 'a-19', date: '2026-01-15', title: 'Herbicide Application', details: 'Pre-emergence herbicide applied for annual meadow grass.', user: 'Sarah Wilson' },
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
      { id: 'a-20', date: '2026-01-28', title: 'Seed Bed Preparation', details: 'Disc harrowed to incorporate crop residues.', user: 'David Jones' },
      { id: 'a-21', date: '2026-01-10', title: 'Soil Sampling', details: 'pH 6.2 — slightly acidic, may need lime next rotation.', user: 'Emma Brown' },
    ],
  },
  {
    id: 'field-13', name: 'Clover Piece', usage: 'Oats',
    sizeAcres: 28.0, sizeHectares: 11.3, soilType: 'Sandy', drainage: 'Good',
    currentCrop: 'Oats', livestock: null, lastWorked: '2026-02-02',
    description: 'Previously a clover ley providing good nitrogen base for oats.',
    mapPosition: { top: 18, left: 35, width: 12, height: 10 },
    activities: [
      { id: 'a-22', date: '2026-02-02', title: 'Drilling', details: 'Drilled spring oats at 160kg/ha. Good soil conditions.', user: 'John Smith' },
    ],
  },
  {
    id: 'field-14', name: 'Triangle', usage: 'Oats',
    sizeAcres: 41.0, sizeHectares: 16.6, soilType: 'Clay', drainage: 'Fair',
    currentCrop: 'Oats', livestock: null, lastWorked: '2026-01-20',
    description: 'Triangular field at the road junction. Heavier clay but oats handle it well.',
    mapPosition: { top: 78, left: 75, width: 14, height: 12 },
    activities: [
      { id: 'a-23', date: '2026-01-20', title: 'Ploughing', details: 'Autumn ploughed to allow frost to break down clay clods.', user: 'Tom Taylor' },
      { id: 'a-24', date: '2026-01-05', title: 'Drainage Assessment', details: 'Checked tile drains. Two outlets blocked — cleared.', user: 'Mike Williams' },
      { id: 'a-25', date: '2025-12-18', title: 'Muck Spreading', details: 'Applied 25t/ha cattle muck before ploughing.', user: 'Sarah Wilson' },
    ],
  },
  {
    id: 'field-15', name: 'Sheep Down', usage: 'Oats',
    sizeAcres: 48.0, sizeHectares: 19.4, soilType: 'Chalk', drainage: 'Very Good',
    currentCrop: 'Oats', livestock: null, lastWorked: '2026-02-09',
    description: 'Chalk downland with excellent natural drainage. Light oat variety performing well.',
    mapPosition: { top: 28, left: 80, width: 16, height: 18 },
    activities: [
      { id: 'a-26', date: '2026-02-09', title: 'Crop Walk', details: 'Spring oats emerging well. Even plant population.', user: 'John Smith' },
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
      { id: 'a-27', date: '2026-01-12', title: 'Mole Drainage', details: 'Ran mole plough across wettest sections to improve drainage.', user: 'David Jones' },
      { id: 'a-28', date: '2025-12-20', title: 'Fertiliser Application', details: 'Applied P and K maintenance dressing.', user: 'Sarah Wilson' },
    ],
  },
  {
    id: 'field-17', name: 'The Ley', usage: 'Grass',
    sizeAcres: 48.0, sizeHectares: 19.4, soilType: 'Loam', drainage: 'Good',
    currentCrop: 'Grass', livestock: null, lastWorked: '2026-02-07',
    description: 'Temporary grass ley in rotation. Italian ryegrass and clover mix.',
    mapPosition: { top: 35, left: 48, width: 14, height: 10 },
    activities: [
      { id: 'a-29', date: '2026-02-07', title: 'Growth Assessment', details: 'Measured grass height at 8cm. Growth starting to pick up.', user: 'John Smith' },
    ],
  },
  {
    id: 'field-18', name: 'Hay Meadow', usage: 'Grass',
    sizeAcres: 35.3, sizeHectares: 14.3, soilType: 'Silt', drainage: 'Fair',
    currentCrop: 'Grass', livestock: null, lastWorked: '2026-01-05',
    description: 'Species-rich traditional hay meadow under environmental stewardship.',
    mapPosition: { top: 82, left: 30, width: 18, height: 10 },
    activities: [
      { id: 'a-30', date: '2026-01-05', title: 'Wildflower Survey', details: 'Winter survey completed. 32 grass and wildflower species recorded.', user: 'Emma Brown' },
      { id: 'a-31', date: '2025-12-10', title: 'Fence Repair', details: 'Replaced 20m of post and wire along road boundary.', user: 'Mike Williams' },
    ],
  },
  {
    id: 'field-19', name: 'River Meadow', usage: 'Grass',
    sizeAcres: 52.0, sizeHectares: 21.0, soilType: 'Peat', drainage: 'Poor',
    currentCrop: 'Grass', livestock: null, lastWorked: '2025-12-15',
    description: 'Flood meadow along the river. Wet grassland managed for conservation.',
    mapPosition: { top: 88, left: 55, width: 22, height: 8 },
    activities: [
      { id: 'a-32', date: '2025-12-15', title: 'Bird Survey', details: 'Winter bird count. Snipe, lapwing, and redshank recorded.', user: 'Emma Brown' },
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
      { id: 'a-33', date: '2026-02-10', title: 'De-stoning', details: 'Stone separated and windrowed. Bed ready for planting.', user: 'Tom Taylor' },
      { id: 'a-34', date: '2026-01-25', title: 'Soil Sampling', details: 'PCN test results clear. Safe for potato cropping.', user: 'Emma Brown' },
      { id: 'a-35', date: '2026-01-10', title: 'Ploughing', details: 'Deep ploughed to 12 inches for good root development.', user: 'David Jones' },
    ],
  },
  {
    id: 'field-21', name: 'Horse Paddock', usage: 'Potatoes',
    sizeAcres: 42.0, sizeHectares: 17.0, soilType: 'Loam', drainage: 'Very Good',
    currentCrop: 'Potatoes', livestock: null, lastWorked: '2026-01-30',
    description: 'Well-drained loam field. Excellent potato land with good tilth.',
    mapPosition: { top: 50, left: 78, width: 14, height: 12 },
    activities: [
      { id: 'a-36', date: '2026-01-30', title: 'Bed Formation', details: 'Formed beds at 90cm spacing ready for planting.', user: 'Mike Williams' },
      { id: 'a-37', date: '2026-01-15', title: 'Fertiliser Application', details: 'Applied 200kg/ha compound fertiliser in beds.', user: 'Sarah Wilson' },
    ],
  },
  {
    id: 'field-22', name: 'Brook Field', usage: 'Potatoes',
    sizeAcres: 28.4, sizeHectares: 11.5, soilType: 'Sandy', drainage: 'Good',
    currentCrop: 'Potatoes', livestock: null, lastWorked: '2026-02-03',
    description: 'Borders the brook on the eastern boundary. Light soil warms quickly for earlies.',
    mapPosition: { top: 50, left: 60, width: 15, height: 14 },
    activities: [
      { id: 'a-38', date: '2026-02-03', title: 'Irrigation Check', details: 'Tested reel and boom irrigator. Ready for season.', user: 'Tom Taylor' },
      { id: 'a-39', date: '2026-01-18', title: 'Seed Potato Delivery', details: 'Received 3t Maris Piper seed. Stored in chitting trays.', user: 'John Smith' },
      { id: 'a-40', date: '2026-01-05', title: 'Ploughing', details: 'Autumn ploughed with skim coulters for clean finish.', user: 'David Jones' },
      { id: 'a-41', date: '2025-12-20', title: 'Soil Analysis', details: 'Full nutrient analysis. Good P and K indices.', user: 'Emma Brown' },
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
      { id: 'a-42', date: '2026-02-03', title: 'Pest Monitoring', details: 'Checked for cabbage stem flea beetle. Threshold not reached.', user: 'Emma Brown' },
      { id: 'a-43', date: '2026-01-15', title: 'Fungicide Application', details: 'Applied fungicide for light leaf spot prevention.', user: 'David Jones' },
      { id: 'a-44', date: '2026-01-02', title: 'Crop Walk', details: 'Plants at green area index 0.8. Good canopy development.', user: 'John Smith' },
    ],
  },
  {
    id: 'field-24', name: 'New Plantation', usage: 'Oilseed rape',
    sizeAcres: 49.4, sizeHectares: 20.0, soilType: 'Loam', drainage: 'Good',
    currentCrop: 'Oilseed rape', livestock: null, lastWorked: '2026-02-01',
    description: 'Good deep loam. Autumn-sown OSR with vigorous establishment.',
    mapPosition: { top: 60, left: 82, width: 14, height: 16 },
    activities: [
      { id: 'a-45', date: '2026-02-01', title: 'Nitrogen Application', details: 'First split of nitrogen at 60kg N/ha.', user: 'Sarah Wilson' },
      { id: 'a-46', date: '2026-01-10', title: 'Pigeon Scaring', details: 'Erected additional pigeon scarers. Moderate damage on headlands.', user: 'Mike Williams' },
    ],
  },
  {
    id: 'field-25', name: 'Spinney', usage: 'Oilseed rape',
    sizeAcres: 34.7, sizeHectares: 14.0, soilType: 'Chalk', drainage: 'Fair',
    currentCrop: 'Oilseed rape', livestock: null, lastWorked: '2026-01-20',
    description: 'Chalky field beside the spinney copse. OSR benefits from the free lime.',
    mapPosition: { top: 35, left: 2, width: 10, height: 14 },
    activities: [
      { id: 'a-47', date: '2026-01-20', title: 'Slug Monitoring', details: 'Set traps — below threshold. No treatment required.', user: 'Tom Taylor' },
      { id: 'a-48', date: '2025-12-20', title: 'Crop Inspection', details: 'Plants well established with 6-8 true leaves. No pigeon damage.', user: 'John Smith' },
    ],
  },
]
