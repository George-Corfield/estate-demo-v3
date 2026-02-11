export const initialFields = [
  // === ARABLE (9 fields) ===
  {
    id: 'field-01', name: 'North Field', category: 'Arable',
    sizeAcres: 45.2, sizeHectares: 18.3, soilType: 'Clay Loam', drainage: 'Good',
    currentCrop: 'Winter Wheat', livestock: null, lastWorked: '2026-02-05',
    description: 'Primary arable field on the northern boundary. Well-drained clay loam, excellent for winter cereals.',
    mapPosition: { top: 5, left: 20, width: 18, height: 16 },
    activities: [
      { id: 'a-01', date: '2026-02-05', title: 'Fertiliser Application', details: 'Applied NPK compound at 250kg/ha across full field.', user: 'John Smith' },
      { id: 'a-02', date: '2026-01-15', title: 'Soil Sampling', details: 'Took 20 core samples for nutrient analysis. Results pending.', user: 'Emma Brown' },
    ],
  },
  {
    id: 'field-02', name: 'Top Acres', category: 'Arable',
    sizeAcres: 38.7, sizeHectares: 15.7, soilType: 'Sandy Loam', drainage: 'Excellent',
    currentCrop: 'Winter Wheat', livestock: null, lastWorked: '2026-01-28',
    description: 'Elevated field with free-draining sandy loam. Consistent yields for wheat.',
    mapPosition: { top: 3, left: 42, width: 16, height: 14 },
    activities: [
      { id: 'a-03', date: '2026-01-28', title: 'Herbicide Application', details: 'Applied selective herbicide for broad-leaved weed control.', user: 'David Jones' },
    ],
  },
  {
    id: 'field-03', name: 'Church Field', category: 'Arable',
    sizeAcres: 52.1, sizeHectares: 21.1, soilType: 'Clay Loam', drainage: 'Good',
    currentCrop: 'Winter Wheat', livestock: null, lastWorked: '2026-02-01',
    description: 'Large field adjacent to the parish church. Reliable producer.',
    mapPosition: { top: 22, left: 55, width: 20, height: 15 },
    activities: [
      { id: 'a-04', date: '2026-02-01', title: 'Crop Inspection', details: 'Checked crop emergence. Good even coverage, no bare patches.', user: 'John Smith' },
    ],
  },
  {
    id: 'field-04', name: 'Mill Field', category: 'Arable',
    sizeAcres: 32.5, sizeHectares: 13.2, soilType: 'Silty Loam', drainage: 'Fair',
    currentCrop: 'Spring Barley', livestock: null, lastWorked: '2026-01-20',
    description: 'Near the old mill site. Slightly heavier soil, suits spring-sown crops.',
    mapPosition: { top: 25, left: 5, width: 14, height: 18 },
    activities: [
      { id: 'a-05', date: '2026-01-20', title: 'Ploughing', details: 'Autumn ploughing completed. Ready for spring drilling.', user: 'David Jones' },
    ],
  },
  {
    id: 'field-05', name: 'Long Furlong', category: 'Arable',
    sizeAcres: 41.3, sizeHectares: 16.7, soilType: 'Sandy Loam', drainage: 'Excellent',
    currentCrop: 'Spring Barley', livestock: null, lastWorked: '2026-01-18',
    description: 'Long narrow field running east-west. Named after the medieval strip farming pattern.',
    mapPosition: { top: 40, left: 20, width: 25, height: 8 },
    activities: [
      { id: 'a-06', date: '2026-01-18', title: 'Lime Application', details: 'Applied 2.5t/ha agricultural lime to correct pH.', user: 'Mike Williams' },
    ],
  },
  {
    id: 'field-06', name: 'Brook Field', category: 'Arable',
    sizeAcres: 28.4, sizeHectares: 11.5, soilType: 'Clay Loam', drainage: 'Fair',
    currentCrop: 'Oilseed Rape', livestock: null, lastWorked: '2026-02-03',
    description: 'Borders the brook on the eastern boundary. Good break crop field.',
    mapPosition: { top: 50, left: 60, width: 15, height: 14 },
    activities: [
      { id: 'a-07', date: '2026-02-03', title: 'Pest Monitoring', details: 'Checked for cabbage stem flea beetle. Threshold not reached.', user: 'Emma Brown' },
    ],
  },
  {
    id: 'field-07', name: 'Warren Piece', category: 'Arable',
    sizeAcres: 33.8, sizeHectares: 13.7, soilType: 'Chalk', drainage: 'Excellent',
    currentCrop: 'Oilseed Rape', livestock: null, lastWorked: '2026-01-25',
    description: 'Chalky soil on the hillside. Named after the old rabbit warren.',
    mapPosition: { top: 12, left: 65, width: 14, height: 12 },
    activities: [
      { id: 'a-08', date: '2026-01-25', title: 'Fungicide Application', details: 'Applied fungicide for light leaf spot prevention.', user: 'David Jones' },
    ],
  },
  {
    id: 'field-08', name: 'Home Field', category: 'Arable',
    sizeAcres: 42.0, sizeHectares: 17.0, soilType: 'Clay Loam', drainage: 'Good',
    currentCrop: 'Winter Wheat', livestock: null, lastWorked: '2026-02-08',
    description: 'Closest arable field to the farmstead. Convenient for trial plots.',
    mapPosition: { top: 45, left: 38, width: 16, height: 12 },
    activities: [
      { id: 'a-09', date: '2026-02-08', title: 'Drainage Check', details: 'Inspected field drains after heavy rain. All flowing well.', user: 'Tom Taylor' },
    ],
  },
  {
    id: 'field-09', name: 'Gallows Hill', category: 'Arable',
    sizeAcres: 38.5, sizeHectares: 15.6, soilType: 'Sandy Clay', drainage: 'Fair',
    currentCrop: 'Winter Wheat', livestock: null, lastWorked: '2026-01-30',
    description: 'Hilltop field with mixed soil. Can be challenging in wet years.',
    mapPosition: { top: 8, left: 82, width: 12, height: 15 },
    activities: [],
  },

  // === PASTORAL (6 fields) ===
  {
    id: 'field-10', name: 'Home Pasture', category: 'Pastoral',
    sizeAcres: 55.0, sizeHectares: 22.3, soilType: 'Clay Loam', drainage: 'Good',
    currentCrop: null, livestock: 'Dairy Cattle (45 head)', lastWorked: '2026-02-10',
    description: 'Main grazing pasture for the dairy herd. Close to milking parlour.',
    mapPosition: { top: 58, left: 25, width: 18, height: 16 },
    activities: [
      { id: 'a-10', date: '2026-02-10', title: 'Livestock Count', details: 'All 45 dairy cattle accounted for. 2 calves expected next week.', user: 'Sarah Wilson' },
    ],
  },
  {
    id: 'field-11', name: 'Bottom Meadow', category: 'Pastoral',
    sizeAcres: 42.0, sizeHectares: 17.0, soilType: 'Silty Loam', drainage: 'Fair',
    currentCrop: null, livestock: 'Beef Cattle (30 head)', lastWorked: '2026-02-06',
    description: 'Low-lying meadow, can be wet in winter. Summer grazing for beef cattle.',
    mapPosition: { top: 72, left: 45, width: 20, height: 14 },
    activities: [
      { id: 'a-11', date: '2026-02-06', title: 'Fence Inspection', details: 'Checked perimeter fencing. Section near the brook needs repair.', user: 'Mike Williams' },
    ],
  },
  {
    id: 'field-12', name: 'Sheep Down', category: 'Pastoral',
    sizeAcres: 48.0, sizeHectares: 19.4, soilType: 'Chalk', drainage: 'Excellent',
    currentCrop: null, livestock: 'Sheep (120 ewes)', lastWorked: '2026-02-09',
    description: 'Chalk downland, traditional sheep grazing. Excellent natural drainage.',
    mapPosition: { top: 28, left: 80, width: 16, height: 18 },
    activities: [
      { id: 'a-12', date: '2026-02-09', title: 'Lambing Preparation', details: 'Set up lambing pens and checked supplies. Lambing starts mid-March.', user: 'Sarah Wilson' },
    ],
  },
  {
    id: 'field-13', name: 'Ox Close', category: 'Pastoral',
    sizeAcres: 35.0, sizeHectares: 14.2, soilType: 'Clay Loam', drainage: 'Good',
    currentCrop: null, livestock: 'Young Stock (18 head)', lastWorked: '2026-01-22',
    description: 'Enclosed paddock for young cattle. Good shelter from the tree line.',
    mapPosition: { top: 60, left: 5, width: 14, height: 16 },
    activities: [],
  },
  {
    id: 'field-14', name: 'Leys Paddock', category: 'Pastoral',
    sizeAcres: 38.0, sizeHectares: 15.4, soilType: 'Sandy Loam', drainage: 'Good',
    currentCrop: null, livestock: 'Dairy Cattle (20 head)', lastWorked: '2026-02-04',
    description: 'Rotational paddock for dairy heifers. Recently reseeded.',
    mapPosition: { top: 76, left: 10, width: 16, height: 12 },
    activities: [
      { id: 'a-13', date: '2026-02-04', title: 'Water Trough Check', details: 'All troughs clean and flowing. Ball valve replaced on north trough.', user: 'Tom Taylor' },
    ],
  },
  {
    id: 'field-15', name: 'Horse Paddock', category: 'Pastoral',
    sizeAcres: 42.0, sizeHectares: 17.0, soilType: 'Loamy Sand', drainage: 'Excellent',
    currentCrop: null, livestock: 'Horses (4)', lastWorked: '2026-01-30',
    description: 'Post-and-rail fenced paddock for estate horses.',
    mapPosition: { top: 50, left: 78, width: 14, height: 12 },
    activities: [],
  },

  // === GRASSLAND (7 fields) ===
  {
    id: 'field-16', name: 'Big Meadow', category: 'Grassland',
    sizeAcres: 62.0, sizeHectares: 25.1, soilType: 'Clay Loam', drainage: 'Good',
    currentCrop: 'Permanent Grass', livestock: null, lastWorked: '2026-01-12',
    description: 'Largest grass field on the estate. Used for hay and silage.',
    mapPosition: { top: 65, left: 58, width: 20, height: 14 },
    activities: [
      { id: 'a-14', date: '2026-01-12', title: 'Mole Drainage', details: 'Ran mole plough across wettest sections to improve drainage.', user: 'David Jones' },
    ],
  },
  {
    id: 'field-17', name: 'The Ley', category: 'Grassland',
    sizeAcres: 48.0, sizeHectares: 19.4, soilType: 'Sandy Loam', drainage: 'Good',
    currentCrop: 'Temporary Ley (2-year)', livestock: null, lastWorked: '2026-02-07',
    description: 'Temporary grass ley in rotation. Italian ryegrass and clover mix.',
    mapPosition: { top: 35, left: 48, width: 14, height: 10 },
    activities: [
      { id: 'a-15', date: '2026-02-07', title: 'Growth Assessment', details: 'Measured grass height at 8cm. Growth starting to pick up.', user: 'John Smith' },
    ],
  },
  {
    id: 'field-18', name: 'Hay Meadow', category: 'Grassland',
    sizeAcres: 35.3, sizeHectares: 14.3, soilType: 'Silty Loam', drainage: 'Fair',
    currentCrop: 'Traditional Hay Meadow', livestock: null, lastWorked: '2026-01-05',
    description: 'Species-rich traditional hay meadow. HLS agreement.',
    mapPosition: { top: 82, left: 30, width: 18, height: 10 },
    activities: [
      { id: 'a-16', date: '2026-01-05', title: 'Wildflower Survey', details: 'Winter survey completed. 32 grass and wildflower species recorded.', user: 'Emma Brown' },
    ],
  },
  {
    id: 'field-19', name: 'Park Field', category: 'Grassland',
    sizeAcres: 40.0, sizeHectares: 16.2, soilType: 'Clay Loam', drainage: 'Good',
    currentCrop: 'Permanent Grass', livestock: null, lastWorked: '2026-01-28',
    description: 'Former parkland with scattered mature trees. Amenity grassland.',
    mapPosition: { top: 48, left: 50, width: 12, height: 10 },
    activities: [],
  },
  {
    id: 'field-20', name: 'Clover Piece', category: 'Grassland',
    sizeAcres: 28.0, sizeHectares: 11.3, soilType: 'Sandy Loam', drainage: 'Good',
    currentCrop: 'Clover Ley', livestock: null, lastWorked: '2026-02-02',
    description: 'Nitrogen-fixing clover ley as part of the arable rotation.',
    mapPosition: { top: 18, left: 35, width: 12, height: 10 },
    activities: [
      { id: 'a-17', date: '2026-02-02', title: 'Clover Assessment', details: 'Good clover establishment at 60% ground cover.', user: 'John Smith' },
    ],
  },
  {
    id: 'field-21', name: 'River Meadow', category: 'Grassland',
    sizeAcres: 52.0, sizeHectares: 21.0, soilType: 'Peat', drainage: 'Poor',
    currentCrop: 'Wet Grassland', livestock: null, lastWorked: '2025-12-15',
    description: 'Flood meadow along the river. Environmental stewardship land.',
    mapPosition: { top: 88, left: 55, width: 22, height: 8 },
    activities: [
      { id: 'a-18', date: '2025-12-15', title: 'Bird Survey', details: 'Winter bird count. Snipe, lapwing, and redshank recorded.', user: 'Emma Brown' },
    ],
  },
  {
    id: 'field-22', name: 'Triangle', category: 'Grassland',
    sizeAcres: 41.0, sizeHectares: 16.6, soilType: 'Clay Loam', drainage: 'Fair',
    currentCrop: 'Temporary Ley (3-year)', livestock: null, lastWorked: '2026-01-20',
    description: 'Triangular field at the road junction. Good access from two sides.',
    mapPosition: { top: 78, left: 75, width: 14, height: 12 },
    activities: [],
  },

  // === FORESTRY (3 fields) ===
  {
    id: 'field-23', name: 'Badger Wood', category: 'Forestry',
    sizeAcres: 86.5, sizeHectares: 35.0, soilType: 'Clay Loam', drainage: 'Good',
    currentCrop: 'Ancient Woodland (Oak/Ash)', livestock: null, lastWorked: '2026-01-10',
    description: 'Ancient semi-natural woodland. SSSI designation. Oak and ash canopy with hazel coppice.',
    mapPosition: { top: 2, left: 2, width: 16, height: 20 },
    activities: [
      { id: 'a-19', date: '2026-01-10', title: 'Coppice Management', details: 'Coppiced 0.5ha of hazel. Regrowth from previous years looking strong.', user: 'Mike Williams' },
    ],
  },
  {
    id: 'field-24', name: 'New Plantation', category: 'Forestry',
    sizeAcres: 49.4, sizeHectares: 20.0, soilType: 'Sandy Loam', drainage: 'Good',
    currentCrop: 'Mixed Native (5-year)', livestock: null, lastWorked: '2026-02-01',
    description: 'New native woodland planting from 2021. Oak, birch, and wild cherry.',
    mapPosition: { top: 60, left: 82, width: 14, height: 16 },
    activities: [
      { id: 'a-20', date: '2026-02-01', title: 'Tree Guard Check', details: 'Inspected all tree guards. Replaced 15 damaged guards. Survival rate 94%.', user: 'Mike Williams' },
    ],
  },
  {
    id: 'field-25', name: 'Spinney', category: 'Forestry',
    sizeAcres: 24.7, sizeHectares: 10.0, soilType: 'Clay Loam', drainage: 'Fair',
    currentCrop: 'Mixed Plantation (10-year)', livestock: null, lastWorked: '2025-12-20',
    description: 'Small copse established for game cover and biodiversity. Maturing well.',
    mapPosition: { top: 35, left: 2, width: 10, height: 14 },
    activities: [
      { id: 'a-21', date: '2025-12-20', title: 'Ride Maintenance', details: 'Cleared rides and firebreaks. Chipped brash for paths.', user: 'Tom Taylor' },
    ],
  },
]
