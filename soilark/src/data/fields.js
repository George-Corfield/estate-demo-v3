export const initialFields = [
  // === WHEAT (4 fields) ===
  {
    id: 'field-01', name: 'North Field', usage: 'Wheat',
    sizeAcres: 45.2, sizeHectares: 18.3, soilType: 'Clay', drainage: 'Good',
    scheme: 'None', livestock: null, lastWorked: '2026-02-05',
    description: 'Primary wheat field on the northern boundary. Heavy clay soil retains moisture well for winter wheat.',
    mapPosition: { top: 5, left: 20, width: 18, height: 16 },
    observations: [
      { id: 'obs-field01-1', timestamp: '2026-02-12T08:15:00', authorId: 'staff-01', authorName: 'John Smith', authorInitials: 'JS', text: 'Walked the north boundary — hedge needs attention on the eastern section. Will schedule maintenance after spring drilling is complete.', attachment: null },
    ],
    activities: [
      { id: 'a-01', timestamp: '2026-02-05T10:30:00', type: 'observation', title: 'Fertiliser Application — NPK', completedBy: 'David Jones', details: 'Applied NPK 20-10-10 compound at 250kg/ha across full field. Even spread confirmed — no striping visible on return pass check. Wind <10mph, ideal conditions.', notes: 'Spreader calibrated before run. Vane test passed.', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: 'Amazone Centaur 6001', inputUsed: 'NPK 20-10-10', quantity: 250, rate: 250, units: 'kg/ha', evidence: [{ name: 'spreader-calibration-cert.pdf', type: 'pdf' }, { name: 'application-map-north-field.png', type: 'image' }], source: 'manual' },
      { id: 'a-02', timestamp: '2026-01-22T14:15:00', type: 'observation', title: 'Crop Walk — Winter Wheat GS23', completedBy: 'John Smith', details: 'Winter wheat at GS23 (main shoot + 3 tillers). Even plant population across the field at ~280 plants/m². No signs of septoria, yellow rust, or eyespot. Canopy colour healthy dark green.', notes: 'Tramlines holding well despite recent rain', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'north-field-crop-GS23.jpg', type: 'image' }, { name: 'north-field-canopy-close-up.jpg', type: 'image' }], source: 'manual' },
      { id: 'a-50', timestamp: '2026-01-15T09:00:00', type: 'observation', title: 'Soil Sampling — Nutrient Analysis', completedBy: 'Emma Brown', details: 'Took 20 W-pattern core samples at 0-15cm and 15-30cm depths. Samples bagged, labelled, and sent to NRM lab. GPS waypoints recorded for each sampling point.', notes: 'Lab results expected by end of January. Previous pH was 7.1 — expecting similar.', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'soil-sample-map-north-field.pdf', type: 'pdf' }, { name: 'sampling-points-GPS.jpg', type: 'image' }], source: 'manual' },
      { id: 'a-59', timestamp: '2026-01-04T08:20:00', type: 'observation', title: 'Waterlogging Check After Storm', completedBy: 'Tom Taylor', details: 'Walked field after 35mm overnight rain. Surface water pooling in NE corner near gateway — drains running but slowly. Rest of field draining well. No crop yellowing yet.', notes: 'Gateway needs resurfacing in spring. Consider mole draining NE corner.', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'waterlogging-NE-corner.jpg', type: 'image' }, { name: 'drain-outfall-check.jpg', type: 'image' }], source: 'manual' },
    ],
  },
  {
    id: 'field-02', name: 'Top Acres', usage: 'Wheat',
    sizeAcres: 38.7, sizeHectares: 15.7, soilType: 'Loam', drainage: 'Very Good',
    scheme: 'None', livestock: null, lastWorked: '2026-01-28',
    description: 'Elevated field with rich loam soil. Consistent wheat yields year on year.',
    mapPosition: { top: 3, left: 42, width: 16, height: 14 },
    observations: [],
    activities: [
      { id: 'a-03', timestamp: '2026-01-28T08:45:00', type: 'observation', title: 'Herbicide Application — Broad-leaved Weeds', completedBy: 'David Jones', details: 'Applied Fluroxypyr at 1.0 L/ha for cleavers and chickweed control. Nozzle: 03-F110 flat fan at 2.5 bar. Water volume 200 L/ha. Crop at GS22, weeds actively growing.', notes: 'Wind picked up after 11am — finished by 10:30. Good timing.', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: 'Amazone Centaur 6001', inputUsed: 'Fluroxypyr', quantity: 15.7, rate: 1.0, units: 'L/ha', evidence: [{ name: 'spray-record-top-acres-28jan.pdf', type: 'pdf' }], source: 'manual' },
      { id: 'a-60', timestamp: '2026-01-14T15:40:00', type: 'observation', title: 'Yellow Rust Scouting', completedBy: 'Emma Brown', details: 'Thorough scout for yellow rust following mild spell. Checked 5 transects across field. No pustules found on any leaves. Variety (Skyfall) has moderate resistance rating.', notes: 'Next scout due in 2 weeks or after next mild/wet period', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'top-acres-leaf-check-1.jpg', type: 'image' }, { name: 'top-acres-leaf-check-2.jpg', type: 'image' }], source: 'manual' },
    ],
  },
  {
    id: 'field-03', name: 'Church Field', usage: 'Wheat',
    sizeAcres: 52.1, sizeHectares: 21.1, soilType: 'Clay', drainage: 'Good',
    scheme: 'None', livestock: null, lastWorked: '2026-02-01',
    description: 'Large field adjacent to the parish church. Reliable wheat producer with deep clay.',
    mapPosition: { top: 22, left: 55, width: 20, height: 15 },
    observations: [],
    activities: [
      { id: 'a-04', timestamp: '2026-02-01T11:00:00', type: 'observation', title: 'Crop Emergence Check', completedBy: 'John Smith', details: 'Counted plant population in 10 random quadrats (0.5m²). Average 265 plants/m² — good even coverage, no bare patches. Seed rate was 350 seeds/m² so ~76% establishment, acceptable for clay.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'church-field-emergence-quadrat.jpg', type: 'image' }, { name: 'plant-count-data.pdf', type: 'pdf' }], source: 'manual' },
      { id: 'a-05', timestamp: '2026-01-10T15:30:00', type: 'observation', title: 'Drainage Inspection', completedBy: 'Tom Taylor', details: 'Inspected all field drains after heavy rain. Main outfall at SE corner running clear. Secondary outlet on west side flowing well. Header drain by church boundary clear — no silt build-up.', notes: 'Outfall pipe at SE corner has slight crack — monitor but not urgent', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'drain-outfall-SE.jpg', type: 'image' }, { name: 'cracked-pipe-close-up.jpg', type: 'image' }], source: 'manual' },
      { id: 'a-61', timestamp: '2025-12-28T09:45:00', type: 'observation', title: 'Rabbit Damage Assessment', completedBy: 'Mike Williams', details: 'Significant rabbit grazing damage along south boundary adjacent to churchyard. Approximately 0.8ha affected — crop grazed down to ground level in worst patches. Burrow entrances visible along hedge line.', notes: 'Need to arrange ferreting or trapping. Spoke to pest control — booking for next week.', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'rabbit-damage-overview.jpg', type: 'image' }, { name: 'rabbit-damage-close-up.jpg', type: 'image' }, { name: 'burrow-locations-map.jpg', type: 'image' }], source: 'manual' },
    ],
  },
  {
    id: 'field-04', name: 'Home Field', usage: 'Wheat',
    sizeAcres: 42.0, sizeHectares: 17.0, soilType: 'Loam', drainage: 'Good',
    scheme: 'None', livestock: null, lastWorked: '2026-02-08',
    description: 'Closest arable field to the farmstead. Convenient for trial plots and monitoring.',
    mapPosition: { top: 45, left: 38, width: 16, height: 12 },
    observations: [],
    activities: [
      { id: 'a-06', timestamp: '2026-02-08T09:30:00', type: 'observation', title: 'T1 Fungicide Application', completedBy: 'David Jones', details: 'Applied Prothioconazole at 0.8 L/ha as T1 timing for septoria control. Crop at GS31 — good uptake conditions with damp canopy drying off. Applied with 03-F110 nozzles at 200 L/ha water volume.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: 'Amazone Centaur 6001', inputUsed: 'Prothioconazole', quantity: 17.0, rate: 0.8, units: 'L/ha', evidence: [{ name: 'spray-record-home-field-08feb.pdf', type: 'pdf' }, { name: 'T1-timing-crop-photo.jpg', type: 'image' }], source: 'manual' },
      { id: 'a-07', timestamp: '2026-01-20T16:00:00', type: 'observation', title: 'Slug Damage — Headlands', completedBy: 'Mike Williams', details: 'Slug damage visible on eastern headland — grazing holes and slime trails on leaves. Set 4 refuge traps overnight to assess population. Applied Metaldehyde pellets at 5 kg/ha to worst 3ha as spot treatment.', notes: 'Traps collected next morning: average 6 slugs per trap, above threshold of 4.', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: 'Metaldehyde pellets', quantity: null, rate: 5, units: 'kg/ha', evidence: [{ name: 'slug-damage-headland.jpg', type: 'image' }, { name: 'slug-trap-count.jpg', type: 'image' }], source: 'manual' },
      { id: 'a-08', timestamp: '2026-01-05T10:00:00', type: 'observation', title: 'Soil Analysis — Baseline', completedBy: 'Emma Brown', details: 'Full baseline soil analysis complete. pH 6.8 (target 6.5-7.0 — good). P index 2, K index 2-, Mg index 2. Organic matter 4.2%. Recommendations: maintain P and K with offtake replacement.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'soil-analysis-home-field.pdf', type: 'pdf' }, { name: 'nutrient-map-home-field.png', type: 'image' }], source: 'manual' },
    ],
  },

  // === BARLEY (4 fields) ===
  {
    id: 'field-05', name: 'Mill Field', usage: 'Barley',
    sizeAcres: 32.5, sizeHectares: 13.2, soilType: 'Silt', drainage: 'Fair',
    scheme: 'None', livestock: null, lastWorked: '2026-01-20',
    description: 'Near the old mill site. Silty soil suits spring barley well.',
    mapPosition: { top: 25, left: 5, width: 14, height: 18 },
    observations: [],
    activities: [
      { id: 'a-09', timestamp: '2026-01-20T08:00:00', type: 'observation', title: 'Ploughing Complete', completedBy: 'David Jones', details: 'Autumn ploughing completed at 9-inch depth. Good inversion, trash well buried. Furrows straight and consistent. Field ready for spring cultivations once frost has broken clods down.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: 'John Deere 6155R', inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'mill-field-ploughed.jpg', type: 'image' }], source: 'manual' },
      { id: 'a-10', timestamp: '2026-01-08T11:00:00', type: 'observation', title: 'Lime Application — pH Correction', completedBy: 'Mike Williams', details: 'Applied 2 t/ha agricultural lime to correct pH from 5.9 to target 6.5. Contractor spread using 12m bout width. Even coverage confirmed with white residue visible across whole field.', notes: 'Re-sample in 12 months to confirm pH has lifted', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: 'Agricultural lime', quantity: 26.4, rate: 2, units: 't/ha', evidence: [{ name: 'lime-spreading-mill-field.jpg', type: 'image' }, { name: 'soil-pH-results-pre-lime.pdf', type: 'pdf' }], source: 'manual' },
      { id: 'a-62', timestamp: '2025-12-22T14:30:00', type: 'observation', title: 'Cover Crop Assessment', completedBy: 'Emma Brown', details: 'Mustard cover crop has reached good biomass — estimated 2.5 t/ha DM. Root structure excellent for improving soil structure in silty soil. Some phacelia patchy on north side. Will spray off in late January before cultivations.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'cover-crop-biomass.jpg', type: 'image' }, { name: 'cover-crop-roots-exposed.jpg', type: 'image' }], source: 'manual' },
    ],
  },
  {
    id: 'field-06', name: 'Long Furlong', usage: 'Barley',
    sizeAcres: 41.3, sizeHectares: 16.7, soilType: 'Sandy', drainage: 'Very Good',
    scheme: 'None', livestock: null, lastWorked: '2026-01-18',
    description: 'Long narrow field running east-west. Light sandy soil ideal for malting barley.',
    mapPosition: { top: 40, left: 20, width: 25, height: 8 },
    observations: [],
    activities: [
      { id: 'a-11', timestamp: '2026-01-18T09:15:00', type: 'observation', title: 'Seed Bed Preparation', completedBy: 'Tom Taylor', details: 'Power harrowed at 8 km/h in two passes — first diagonal, second along tramlines. Fine tilth achieved to 5cm depth. Soil moisture ideal — crumbles in hand, not smearing. Ready for spring drilling.', notes: 'Some larger stones on west end — roller pass may help after drilling', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: 'John Deere 6155R', inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'seedbed-tilth-close-up.jpg', type: 'image' }], source: 'manual' },
      { id: 'a-63', timestamp: '2026-01-06T10:00:00', type: 'observation', title: 'Wind Erosion Risk Check', completedBy: 'John Smith', details: 'Checked sandy soil surface after strong easterly winds. Light erosion/blow visible on exposed headland — thin sand drift against hedge. Main field surface protected by stale seedbed roughness. No action needed currently.', notes: 'If wind persists, may need to roll to consolidate surface', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'sand-drift-headland.jpg', type: 'image' }], source: 'manual' },
    ],
  },
  {
    id: 'field-07', name: 'Gallows Hill', usage: 'Barley',
    sizeAcres: 38.5, sizeHectares: 15.6, soilType: 'Loam', drainage: 'Fair',
    scheme: 'None', livestock: null, lastWorked: '2026-01-30',
    description: 'Hilltop field with good loam. Winter barley performing well this season.',
    mapPosition: { top: 8, left: 82, width: 12, height: 15 },
    observations: [],
    activities: [
      { id: 'a-12', timestamp: '2026-01-30T14:00:00', type: 'observation', title: 'Crop Walk — Winter Barley GS25', completedBy: 'John Smith', details: 'Winter barley at GS25 (main shoot + 5 tillers). Good tiller count, strong root anchorage. Crop colour consistent dark green. Checked lower leaves for rhynchosporium — none found. Slight frost heave on exposed hilltop but plants recovering.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'gallows-hill-GS25-overview.jpg', type: 'image' }, { name: 'barley-tiller-count.jpg', type: 'image' }, { name: 'frost-heave-hilltop.jpg', type: 'image' }], source: 'manual' },
      { id: 'a-13', timestamp: '2026-01-12T10:30:00', type: 'observation', title: 'First Nitrogen Application', completedBy: 'Sarah Wilson', details: 'Applied first split of ammonium nitrate at 40 kg N/ha. Targeting total season N of 160 kg/ha in 3 splits. Crop actively growing with soil temp at 5°C. Spread pattern good — no overlap issues on headlands.', notes: 'Second split planned for early March at GS30', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: 'Amazone Centaur 6001', inputUsed: 'Ammonium nitrate (34.5%N)', quantity: null, rate: 40, units: 'kg N/ha', evidence: [{ name: 'N-plan-gallows-hill-2026.pdf', type: 'pdf' }], source: 'manual' },
    ],
  },
  {
    id: 'field-08', name: 'Warren Piece', usage: 'Barley',
    sizeAcres: 33.8, sizeHectares: 13.7, soilType: 'Chalk', drainage: 'Very Good',
    scheme: 'None', livestock: null, lastWorked: '2026-01-25',
    description: 'Chalky soil on the hillside. Named after the old rabbit warren. Good for spring barley.',
    mapPosition: { top: 12, left: 65, width: 14, height: 12 },
    observations: [],
    activities: [
      { id: 'a-14', timestamp: '2026-01-25T08:30:00', type: 'observation', title: 'Cambridge Rolling', completedBy: 'Tom Taylor', details: 'Cambridge rolled to consolidate seedbed and push chalk stones below seed depth. Two passes in opposing directions. Surface now firm and level — good for even drilling depth.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: 'John Deere 6155R', inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'warren-piece-rolled-surface.jpg', type: 'image' }], source: 'manual' },
      { id: 'a-51', timestamp: '2026-02-10T09:00:00', type: 'task', title: 'Plant Winter Wheat — Task Created', completedBy: 'System', details: 'Task "Plant Winter Wheat" was created and linked to this field.', notes: null, linkedTaskId: 'task-03', taskAction: 'created', linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [], source: 'task-system' },
      { id: 'a-52', timestamp: '2026-02-11T07:45:00', type: 'task', title: 'Plant Winter Wheat — Started', completedBy: 'David Jones', details: 'Drilling commenced. Skyfall Winter Wheat at 180 kg/ha via direct drill.', notes: null, linkedTaskId: 'task-03', taskAction: 'started', linkedEventId: null, machineryUsed: 'John Deere 6155R', inputUsed: 'Skyfall Winter Wheat', quantity: 3060, rate: 180, units: 'kg/ha', evidence: [], source: 'task-system' },
    ],
  },

  // === MAIZE (3 fields) ===
  {
    id: 'field-09', name: 'Bottom Meadow', usage: 'Maize',
    sizeAcres: 42.0, sizeHectares: 17.0, soilType: 'Silt', drainage: 'Fair',
    scheme: 'None', livestock: null, lastWorked: '2026-02-06',
    description: 'Low-lying field with deep silty soil. Warm and sheltered, good for maize.',
    mapPosition: { top: 72, left: 45, width: 20, height: 14 },
    observations: [],
    activities: [
      { id: 'a-15', timestamp: '2026-02-06T07:30:00', type: 'observation', title: 'Soil Temperature — Pre-Drilling Check', completedBy: 'Emma Brown', details: 'Measured soil temperature at 10cm depth using probe at 8 locations across field. Average reading 8.2°C (range 7.5-8.9°C). Need consistent 10°C for maize drilling. Cooler spots in shaded NW corner near hedge.', notes: 'Will re-check in two weeks. If still below 10°C, delay drilling to late March.', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'soil-temp-readings-map.png', type: 'image' }, { name: 'soil-thermometer-reading.jpg', type: 'image' }], source: 'manual' },
      { id: 'a-16', timestamp: '2026-01-22T08:00:00', type: 'observation', title: 'FYM Application', completedBy: 'Mike Williams', details: 'Applied 30 t/ha farmyard manure for organic matter and nutrients. Contractor spread with rear-discharge spreader. Even coverage across field. Slight concern about compaction near gateway — ground soft.', notes: 'NVZ compliant — more than 12 months since last organic application', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: 'Farmyard manure', quantity: 510, rate: 30, units: 't/ha', evidence: [{ name: 'fym-spreading-bottom-meadow.jpg', type: 'image' }, { name: 'gateway-compaction.jpg', type: 'image' }], source: 'manual' },
      { id: 'a-64', timestamp: '2026-01-08T11:15:00', type: 'observation', title: 'Flood Debris Clearance', completedBy: 'Tom Taylor', details: 'Cleared flood debris from December high water. Plastic, branches, and silt deposited along southern boundary ditch. Ditch re-profiled by hand. Culvert under track checked — flowing freely.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'flood-debris-before.jpg', type: 'image' }, { name: 'ditch-cleared-after.jpg', type: 'image' }], source: 'manual' },
    ],
  },
  {
    id: 'field-10', name: 'Ox Close', usage: 'Maize',
    sizeAcres: 35.0, sizeHectares: 14.2, soilType: 'Loam', drainage: 'Good',
    scheme: 'None', livestock: null, lastWorked: '2026-01-22',
    description: 'Enclosed field with good shelter from the tree line. Warm microclimate for maize.',
    mapPosition: { top: 60, left: 5, width: 14, height: 16 },
    observations: [],
    activities: [
      { id: 'a-17', timestamp: '2026-01-22T11:00:00', type: 'observation', title: 'Cover Crop Spray-Off', completedBy: 'David Jones', details: 'Sprayed off mustard cover crop with Glyphosate at 3 L/ha ahead of maize drilling. Cover crop had reached good biomass (~3 t DM/ha). Application in calm conditions, full coverage achieved. Expect burn-down within 10-14 days.', notes: 'Allow 3 weeks before cultivation for root decomposition', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: 'Amazone Centaur 6001', inputUsed: 'Glyphosate 360g/L', quantity: null, rate: 3, units: 'L/ha', evidence: [{ name: 'cover-crop-pre-spray.jpg', type: 'image' }, { name: 'spray-record-ox-close.pdf', type: 'pdf' }], source: 'manual' },
      { id: 'a-65', timestamp: '2026-01-10T09:30:00', type: 'observation', title: 'Badger Sett Survey', completedBy: 'Emma Brown', details: 'Annual badger sett survey along NE tree line boundary. Two active setts identified — same locations as last year. Fresh spoil heaps and latrine sites confirm active use. 30m buffer zone to be maintained during any cultivation.', notes: 'Sett locations marked on farm map. Contractor briefed on exclusion zones.', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'badger-sett-entrance-1.jpg', type: 'image' }, { name: 'badger-sett-entrance-2.jpg', type: 'image' }, { name: 'sett-location-map.pdf', type: 'pdf' }], source: 'manual' },
    ],
  },
  {
    id: 'field-11', name: 'Leys Paddock', usage: 'Maize',
    sizeAcres: 38.0, sizeHectares: 15.4, soilType: 'Sandy', drainage: 'Good',
    scheme: 'None', livestock: null, lastWorked: '2026-02-04',
    description: 'Free-draining sandy field. Warms up quickly in spring for early maize drilling.',
    mapPosition: { top: 76, left: 10, width: 16, height: 12 },
    observations: [],
    activities: [
      { id: 'a-18', timestamp: '2026-02-04T08:00:00', type: 'observation', title: 'Ploughing — Spring Prep', completedBy: 'Tom Taylor', details: 'Ploughed at 10-inch depth and pressed in one pass. Good clod break-up in sandy soil — minimal secondary cultivation should be needed. Trash well incorporated. Worm count in furrow slice looked healthy.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: 'John Deere 6155R', inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'ploughed-surface-leys.jpg', type: 'image' }, { name: 'worm-count-furrow.jpg', type: 'image' }], source: 'manual' },
      { id: 'a-19', timestamp: '2026-01-15T14:00:00', type: 'observation', title: 'Pre-Emergence Herbicide', completedBy: 'Sarah Wilson', details: 'Applied pre-emergence herbicide for annual meadow-grass and broad-leaved weed control ahead of maize drilling. Applied to moist soil surface — good conditions for activation.', notes: 'Product: Pendimethalin 330g/L at 4.0 L/ha', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: 'Amazone Centaur 6001', inputUsed: 'Pendimethalin', quantity: null, rate: 4.0, units: 'L/ha', evidence: [{ name: 'spray-record-leys-paddock.pdf', type: 'pdf' }], source: 'manual' },
    ],
  },

  // === OATS (4 fields) ===
  {
    id: 'field-12', name: 'Park Field', usage: 'Oats',
    sizeAcres: 40.0, sizeHectares: 16.2, soilType: 'Loam', drainage: 'Good',
    scheme: 'None', livestock: null, lastWorked: '2026-01-28',
    description: 'Former parkland with scattered mature trees. Rich loam well suited to oats.',
    mapPosition: { top: 48, left: 50, width: 12, height: 10 },
    observations: [],
    activities: [
      { id: 'a-20', timestamp: '2026-01-28T09:00:00', type: 'observation', title: 'Disc Harrowing — Residue Incorporation', completedBy: 'David Jones', details: 'Disc harrowed in two directions to incorporate previous crop residues. Straw chopping from last harvest was good — residues breaking down well. Soil in excellent condition, crumbling nicely.', notes: 'One pass with power harrow should give drill-ready seedbed', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: 'John Deere 6155R', inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'disc-harrowed-surface.jpg', type: 'image' }], source: 'manual' },
      { id: 'a-21', timestamp: '2026-01-10T10:30:00', type: 'observation', title: 'Soil Sampling — pH Check', completedBy: 'Emma Brown', details: 'Quick pH check from 12 sample points. Average pH 6.2 — slightly below optimum for oats (6.5). Lime application not economic this season but should be factored into next rotation.', notes: 'pH trending down from 6.5 two years ago. Add to lime plan for 2027.', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'pH-test-results-park-field.pdf', type: 'pdf' }, { name: 'pH-trend-chart.png', type: 'image' }], source: 'manual' },
      { id: 'a-66', timestamp: '2025-12-30T15:00:00', type: 'observation', title: 'Tree Safety Check', completedBy: 'Mike Williams', details: 'Inspected 8 mature oaks scattered across field following Storm Eowyn. All standing, no major limb loss. One oak near south entrance has dead branch overhanging track — needs removal before harvest. No damage to crops from fallen debris.', notes: 'Arrange tree surgeon for the south entrance oak before spring.', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'dead-branch-south-oak.jpg', type: 'image' }, { name: 'oak-tree-locations-map.jpg', type: 'image' }], source: 'manual' },
    ],
  },
  {
    id: 'field-13', name: 'Clover Piece', usage: 'Oats',
    sizeAcres: 28.0, sizeHectares: 11.3, soilType: 'Sandy', drainage: 'Good',
    scheme: 'None', livestock: null, lastWorked: '2026-02-02',
    description: 'Previously a clover ley providing good nitrogen base for oats.',
    mapPosition: { top: 18, left: 35, width: 12, height: 10 },
    observations: [],
    activities: [
      { id: 'a-22', timestamp: '2026-02-02T08:30:00', type: 'observation', title: 'Spring Oat Drilling', completedBy: 'John Smith', details: 'Drilled spring oats (var. Mascani) at 160 kg/ha with 12.5cm row spacing. Seed depth 3-4cm consistently. Soil conditions excellent — crumbly tilth, adequate moisture at depth. GPS auto-steer for tramlines.', notes: 'Target population 350 plants/m². Check emergence in 10-14 days.', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: 'John Deere 6155R', inputUsed: 'Mascani spring oats', quantity: null, rate: 160, units: 'kg/ha', evidence: [{ name: 'drilling-clover-piece.jpg', type: 'image' }, { name: 'seed-depth-check.jpg', type: 'image' }, { name: 'drill-calibration-ticket.pdf', type: 'pdf' }], source: 'manual' },
    ],
  },
  {
    id: 'field-14', name: 'Triangle', usage: 'Oats',
    sizeAcres: 41.0, sizeHectares: 16.6, soilType: 'Clay', drainage: 'Fair',
    scheme: 'None', livestock: null, lastWorked: '2026-01-20',
    description: 'Triangular field at the road junction. Heavier clay but oats handle it well.',
    mapPosition: { top: 78, left: 75, width: 14, height: 12 },
    observations: [],
    activities: [
      { id: 'a-23', timestamp: '2026-01-20T08:00:00', type: 'observation', title: 'Autumn Ploughing', completedBy: 'Tom Taylor', details: 'Autumn ploughed at 10-inch depth to allow frost to break down clay clods over winter. Clean inversion, all trash buried. Clay working well despite recent rain — furrows holding shape.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: 'John Deere 6155R', inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'triangle-ploughed-aerial.jpg', type: 'image' }], source: 'manual' },
      { id: 'a-24', timestamp: '2026-01-05T13:00:00', type: 'observation', title: 'Drainage Assessment — Blocked Outlets', completedBy: 'Mike Williams', details: 'Checked tile drain outlets after persistent wet weather. Two outlets on east boundary completely blocked with silt and vegetation. Cleared by hand — good flow resumed within 10 minutes. Third outlet running slow — may need jetting.', notes: 'Scheduled follow-up check in 4 weeks. Consider full drain survey with camera in summer.', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'blocked-drain-outlet-1.jpg', type: 'image' }, { name: 'drain-flowing-after-clearance.jpg', type: 'image' }, { name: 'drain-outlet-locations.pdf', type: 'pdf' }], source: 'manual' },
      { id: 'a-25', timestamp: '2025-12-18T09:00:00', type: 'observation', title: 'Cattle FYM Applied', completedBy: 'Sarah Wilson', details: 'Applied 25 t/ha well-rotted cattle manure before ploughing. Good even spread across field. Manure well decomposed — dark, crumbly, no smell. Excellent for building organic matter in heavy clay.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: 'Cattle manure', quantity: null, rate: 25, units: 't/ha', evidence: [{ name: 'fym-spreading-triangle.jpg', type: 'image' }], source: 'manual' },
    ],
  },
  {
    id: 'field-15', name: 'Sheep Down', usage: 'Oats',
    sizeAcres: 48.0, sizeHectares: 19.4, soilType: 'Chalk', drainage: 'Very Good',
    scheme: 'None', livestock: null, lastWorked: '2026-02-09',
    description: 'Chalk downland with excellent natural drainage. Light oat variety performing well.',
    mapPosition: { top: 28, left: 80, width: 16, height: 18 },
    observations: [],
    activities: [
      { id: 'a-26', timestamp: '2026-02-09T10:00:00', type: 'observation', title: 'Crop Walk — Spring Oats Emerging', completedBy: 'John Smith', details: 'Spring oats emerging well — coleoptiles visible across majority of field. Plant population estimate 310 plants/m² from 10 quadrat counts. Even emergence despite variable chalk depth. A few thin patches on shallow chalk ridge — expected.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'oat-emergence-overview.jpg', type: 'image' }, { name: 'oat-coleoptile-close-up.jpg', type: 'image' }, { name: 'thin-patch-chalk-ridge.jpg', type: 'image' }], source: 'manual' },
      { id: 'a-53', timestamp: '2026-02-03T15:20:00', type: 'observation', title: 'Pest Sighting — Grain Aphid Colonies', completedBy: 'Emma Brown', details: 'Routine pest monitoring found small colonies of grain aphid (Sitobion avenae) on lower leaves. Checked 25 tillers across 5 locations — average 3% of tillers with aphids. Below spray threshold of 66% at this growth stage but worth close monitoring.', notes: 'Re-check in 7 days. If colonies expanding rapidly, may need Cypermethrin.', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'grain-aphid-colony-close-up.jpg', type: 'image' }, { name: 'aphid-monitoring-record.pdf', type: 'pdf' }], source: 'manual' },
    ],
  },

  // === GRASS (4 fields) ===
  {
    id: 'field-16', name: 'Big Meadow', usage: 'Grass',
    sizeAcres: 62.0, sizeHectares: 25.1, soilType: 'Clay', drainage: 'Good',
    scheme: 'None', livestock: null, lastWorked: '2026-01-12',
    description: 'Largest grass field on the estate. Used for hay and silage production.',
    mapPosition: { top: 65, left: 58, width: 20, height: 14 },
    observations: [],
    activities: [
      { id: 'a-27', timestamp: '2026-01-12T09:00:00', type: 'observation', title: 'Mole Drainage — Wet Sections', completedBy: 'David Jones', details: 'Ran mole plough at 550mm depth across 8ha of wettest sections (centre and south-west). Pulled at 2m spacing. Clay subsoil ideal for stable mole channels. Surface disturbance minimal — should settle quickly.', notes: 'Link drains to main tile system. Check channel integrity in 6 months.', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: 'John Deere 6155R', inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'mole-plough-in-action.jpg', type: 'image' }, { name: 'mole-drain-layout-map.pdf', type: 'pdf' }], source: 'manual' },
      { id: 'a-28', timestamp: '2025-12-20T11:00:00', type: 'observation', title: 'P&K Maintenance Dressing', completedBy: 'Sarah Wilson', details: 'Applied maintenance P and K to replace offtake from 3 silage cuts. Triple superphosphate at 50 kg P2O5/ha and muriate of potash at 80 kg K2O/ha. Spread in one pass, overlapping bouts checked.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: 'Amazone Centaur 6001', inputUsed: 'TSP + MOP blend', quantity: null, rate: null, units: null, evidence: [{ name: 'fertiliser-delivery-note.pdf', type: 'pdf' }], source: 'manual' },
      { id: 'a-67', timestamp: '2025-12-05T14:00:00', type: 'observation', title: 'Poaching Damage — Cattle', completedBy: 'Mike Williams', details: 'Cattle removed from Big Meadow after autumn grazing. Significant poaching damage around water trough and gateway areas — estimated 0.5ha severely damaged. Grass sward torn up, bare soil exposed. Will need re-seeding in spring.', notes: 'Move water trough to new location next autumn. Hardcore gateway.', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'poaching-damage-gateway.jpg', type: 'image' }, { name: 'poaching-damage-trough-area.jpg', type: 'image' }, { name: 'poaching-damage-aerial.jpg', type: 'image' }], source: 'manual' },
    ],
  },
  {
    id: 'field-17', name: 'The Ley', usage: 'Grass',
    sizeAcres: 48.0, sizeHectares: 19.4, soilType: 'Loam', drainage: 'Good',
    scheme: 'None', livestock: null, lastWorked: '2026-02-07',
    description: 'Temporary grass ley in rotation. Italian ryegrass and clover mix.',
    mapPosition: { top: 35, left: 48, width: 14, height: 10 },
    observations: [],
    activities: [
      { id: 'a-29', timestamp: '2026-02-07T14:30:00', type: 'observation', title: 'Grass Growth Measurement', completedBy: 'John Smith', details: 'Measured grass height with rising plate meter at 30 points across field. Average cover height 8.2cm (range 5-12cm). Growth rate estimated at 15 kg DM/ha/day — picking up after mild spell. Clover component looking healthy at ~20% of sward.', notes: 'First nitrogen application due when growth rate hits 20 kg DM/ha/day', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'plate-meter-reading.jpg', type: 'image' }, { name: 'grass-growth-chart-feb.png', type: 'image' }], source: 'manual' },
      { id: 'a-54', timestamp: '2026-02-05T17:30:00', type: 'task', title: 'Harvest Hay — Completed', completedBy: 'David Jones', details: 'Late winter hay harvest completed. 82 round bales carted to Main Barn. Grade A quality.', notes: null, linkedTaskId: 'task-04', taskAction: 'completed', linkedEventId: null, machineryUsed: 'New Holland T7.270, Krone BiG X 1180', inputUsed: null, quantity: null, rate: null, units: null, evidence: [], source: 'task-system' },
      { id: 'a-55', timestamp: '2026-02-03T07:00:00', type: 'task', title: 'Harvest Hay — Started', completedBy: 'David Jones', details: 'Hay cutting commenced on The Ley. Italian Ryegrass 1st cut (winter).', notes: null, linkedTaskId: 'task-04', taskAction: 'started', linkedEventId: null, machineryUsed: 'New Holland T7.270', inputUsed: null, quantity: null, rate: null, units: null, evidence: [], source: 'task-system' },
      { id: 'a-56', timestamp: '2026-01-28T10:00:00', type: 'task', title: 'Harvest Hay — Task Created', completedBy: 'System', details: 'Task "Harvest Hay" was created and linked to this field.', notes: null, linkedTaskId: 'task-04', taskAction: 'created', linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [], source: 'task-system' },
    ],
  },
  {
    id: 'field-18', name: 'Hay Meadow', usage: 'Grass',
    sizeAcres: 35.3, sizeHectares: 14.3, soilType: 'Silt', drainage: 'Fair',
    scheme: 'None', livestock: null, lastWorked: '2026-01-05',
    description: 'Species-rich traditional hay meadow under environmental stewardship.',
    mapPosition: { top: 82, left: 30, width: 18, height: 10 },
    observations: [],
    activities: [
      { id: 'a-30', timestamp: '2026-01-05T10:00:00', type: 'observation', title: 'Wildflower & Grass Survey', completedBy: 'Emma Brown', details: 'Winter botanical survey completed along 6 transects. 32 grass and wildflower species recorded including yellow rattle, common knapweed, ox-eye daisy, and bird\'s-foot trefoil. Species count up from 28 last year — stewardship management is working.', notes: 'Full species list submitted to Natural England as part of HLS agreement evidence.', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'wildflower-survey-2026.xlsx', type: 'spreadsheet' }, { name: 'yellow-rattle-patch.jpg', type: 'image' }, { name: 'knapweed-transect-3.jpg', type: 'image' }, { name: 'NE-monitoring-form.pdf', type: 'pdf' }], source: 'manual' },
      { id: 'a-31', timestamp: '2025-12-10T14:00:00', type: 'observation', title: 'Boundary Fence Repair', completedBy: 'Mike Williams', details: 'Replaced 20m of post and wire along road boundary where vehicle damage occurred. New chestnut posts at 3m spacing, 3 strands of barbed wire. Strainer posts concreted in. Also tightened 40m of existing fence on SE corner.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'fence-damage-before.jpg', type: 'image' }, { name: 'fence-repair-complete.jpg', type: 'image' }], source: 'manual' },
    ],
  },
  {
    id: 'field-19', name: 'River Meadow', usage: 'Grass',
    sizeAcres: 52.0, sizeHectares: 21.0, soilType: 'Peat', drainage: 'Poor',
    scheme: 'None', livestock: null, lastWorked: '2025-12-15',
    description: 'Flood meadow along the river. Wet grassland managed for conservation.',
    mapPosition: { top: 88, left: 55, width: 22, height: 8 },
    observations: [],
    activities: [
      { id: 'a-32', timestamp: '2025-12-15T09:30:00', type: 'observation', title: 'Winter Bird Survey', completedBy: 'Emma Brown', details: 'Monthly winter bird count from 3 fixed observation points. Species recorded: snipe (12), lapwing (45), redshank (8), curlew (3), teal (20+), wigeon (15). Lapwing numbers up significantly from November count. Waterlogged areas providing ideal feeding habitat.', notes: 'Curlew presence is notable — nationally declining species. Reported to BTO WeBS count.', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'lapwing-flock-river-meadow.jpg', type: 'image' }, { name: 'snipe-in-rushes.jpg', type: 'image' }, { name: 'WeBS-count-dec-2025.pdf', type: 'pdf' }, { name: 'bird-survey-spreadsheet.xlsx', type: 'spreadsheet' }], source: 'manual' },
      { id: 'a-57', timestamp: '2026-01-18T11:00:00', type: 'observation', title: 'Flood Risk Assessment', completedBy: 'Tom Taylor', details: 'Assessed water levels and bank condition following 48mm of rain over 3 days. River level 0.4m below bank top at gauge board. Some overtopping on low section of south bank — water spreading across 2ha of meadow (expected and desirable). Bank integrity good, no erosion or slumping.', notes: 'Environment Agency notified of raised levels via online portal. Photo evidence uploaded.', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'river-gauge-reading.jpg', type: 'image' }, { name: 'flood-extent-south-bank.jpg', type: 'image' }, { name: 'bank-condition-check.jpg', type: 'image' }], source: 'manual' },
    ],
  },

  // === POTATOES (3 fields) ===
  {
    id: 'field-20', name: 'Home Pasture', usage: 'Potatoes',
    sizeAcres: 55.0, sizeHectares: 22.3, soilType: 'Sandy', drainage: 'Good',
    scheme: 'None', livestock: null, lastWorked: '2026-02-10',
    description: 'Light sandy soil ideal for potato production. Easy stone picking.',
    mapPosition: { top: 58, left: 25, width: 18, height: 16 },
    observations: [],
    activities: [
      { id: 'a-33', timestamp: '2026-02-10T08:00:00', type: 'observation', title: 'De-Stoning Complete', completedBy: 'Tom Taylor', details: 'Stone separation and windrowing complete across all 22ha. Three passes with destoner — final pass very clean. Stone burden was moderate (~15 t/ha). Beds now smooth and ready for planting. No flints larger than 40mm remaining in top 30cm.', notes: 'Stones windrowed in wheelings — will need removing before harvest', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'destoned-bed-surface.jpg', type: 'image' }, { name: 'stone-windrow.jpg', type: 'image' }], source: 'manual' },
      { id: 'a-34', timestamp: '2026-01-25T10:00:00', type: 'observation', title: 'PCN Soil Test — Clear', completedBy: 'Emma Brown', details: 'Potato cyst nematode (PCN) soil test results received. Both Globodera rostochiensis and G. pallida: NOT DETECTED. Field is safe for potato cropping. Last potatoes here were 2021 — 5-year break has been effective.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'pcn-test-certificate.pdf', type: 'pdf' }, { name: 'pcn-sampling-grid.png', type: 'image' }], source: 'manual' },
      { id: 'a-35', timestamp: '2026-01-10T08:30:00', type: 'observation', title: 'Deep Ploughing', completedBy: 'David Jones', details: 'Deep ploughed to 12 inches for good root development and stone burial. Clean inversion with good trash burial. Furrows straight — GPS guidance used. Sandy soil working beautifully despite wet week.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: 'John Deere 6155R', inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'deep-ploughing-home-pasture.jpg', type: 'image' }], source: 'manual' },
    ],
  },
  {
    id: 'field-21', name: 'Horse Paddock', usage: 'Potatoes',
    sizeAcres: 42.0, sizeHectares: 17.0, soilType: 'Loam', drainage: 'Very Good',
    scheme: 'None', livestock: null, lastWorked: '2026-01-30',
    description: 'Well-drained loam field. Excellent potato land with good tilth.',
    mapPosition: { top: 50, left: 78, width: 14, height: 12 },
    observations: [],
    activities: [
      { id: 'a-36', timestamp: '2026-01-30T08:00:00', type: 'observation', title: 'Bed Formation', completedBy: 'Mike Williams', details: 'Formed beds at 90cm spacing using bed-tiller in single pass. Bed height 18-20cm, consistent profile across field. Soil tilth excellent — fine crumb structure ideal for tuber development. Wheelings clean, no compaction.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'bed-formation-profile.jpg', type: 'image' }, { name: 'bed-cross-section.jpg', type: 'image' }], source: 'manual' },
      { id: 'a-37', timestamp: '2026-01-15T10:00:00', type: 'observation', title: 'Base Fertiliser — In-Bed Placement', completedBy: 'Sarah Wilson', details: 'Applied 200 kg/ha compound fertiliser (10-24-24) placed in beds ahead of planting. Band placement at 5cm below seed tuber position. Good coverage — GPS-linked to match bed positions exactly.', notes: 'Total P and K should meet crop demand. May need top-dress N at tuber initiation.', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: 'NPK 10-24-24', quantity: null, rate: 200, units: 'kg/ha', evidence: [{ name: 'fertiliser-placement-diagram.pdf', type: 'pdf' }], source: 'manual' },
      { id: 'a-68', timestamp: '2025-12-28T11:00:00', type: 'observation', title: 'Volunteer Potato Check', completedBy: 'John Smith', details: 'Walked field checking for volunteer potatoes from 2021 crop. Found small clusters of groundkeepers in 3 locations near old clamp site. Hand-pulled approximately 40 plants. No sign of blight on volunteers.', notes: 'Mark clamp site location — always prone to volunteers', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'volunteer-potato-cluster.jpg', type: 'image' }], source: 'manual' },
    ],
  },
  {
    id: 'field-22', name: 'Brook Field', usage: 'Potatoes',
    sizeAcres: 28.4, sizeHectares: 11.5, soilType: 'Sandy', drainage: 'Good',
    scheme: 'None', livestock: null, lastWorked: '2026-02-03',
    description: 'Borders the brook on the eastern boundary. Light soil warms quickly for earlies.',
    mapPosition: { top: 50, left: 60, width: 15, height: 14 },
    observations: [],
    activities: [
      { id: 'a-38', timestamp: '2026-02-03T11:00:00', type: 'observation', title: 'Irrigation Equipment Check', completedBy: 'Tom Taylor', details: 'Pre-season check on reel and boom irrigator. Hose unwound full length — no kinks or damage. Nozzles cleaned and flow-tested. Rain gun working at correct pressure. Reel mechanism winding smoothly. Abstraction licence valid until October 2027.', notes: 'Order 2 spare nozzles for the boom — stock getting low', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'irrigator-inspection.jpg', type: 'image' }, { name: 'nozzle-flow-test-results.pdf', type: 'pdf' }, { name: 'abstraction-licence-copy.pdf', type: 'pdf' }], source: 'manual' },
      { id: 'a-39', timestamp: '2026-01-18T15:00:00', type: 'observation', title: 'Seed Potato Delivery & Chitting', completedBy: 'John Smith', details: 'Received 3 t Maris Piper seed from certified supplier. Seed inspected on arrival — good condition, no soft rots, no virus symptoms. Loaded into chitting trays with rose end up. Trays stacked in chitting house at 8-10°C with diffused light.', notes: 'Target 3-4 sturdy chits per tuber before planting in late March', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: 'Maris Piper seed (SE class)', quantity: 3, rate: null, units: 't', evidence: [{ name: 'seed-delivery-inspection.jpg', type: 'image' }, { name: 'chitting-trays-stacked.jpg', type: 'image' }, { name: 'seed-certificate.pdf', type: 'pdf' }], source: 'manual' },
      { id: 'a-40', timestamp: '2026-01-05T08:00:00', type: 'observation', title: 'Autumn Ploughing', completedBy: 'David Jones', details: 'Ploughed with skim coulters for clean finish. Sandy soil ploughing well. All previous crop residues fully incorporated. Headlands turned — clean field edges.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: 'John Deere 6155R', inputUsed: null, quantity: null, rate: null, units: null, evidence: [], source: 'manual' },
      { id: 'a-41', timestamp: '2025-12-20T10:00:00', type: 'observation', title: 'Full Nutrient Analysis', completedBy: 'Emma Brown', details: 'Comprehensive soil nutrient analysis complete. pH 6.4, P index 3 (high — reduce P application), K index 2 (maintain), Mg index 2 (adequate). Organic matter 3.8%. CEC good for sandy soil.', notes: 'High P — reduce compound fertiliser rate. Use 5-15-25 instead of 10-24-24.', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'nutrient-analysis-brook-field.pdf', type: 'pdf' }, { name: 'nutrient-indices-map.png', type: 'image' }], source: 'manual' },
    ],
  },

  // === OILSEED RAPE (3 fields) ===
  {
    id: 'field-23', name: 'Badger Wood', usage: 'Oilseed rape',
    sizeAcres: 46.5, sizeHectares: 18.8, soilType: 'Clay', drainage: 'Good',
    scheme: 'None', livestock: null, lastWorked: '2026-02-03',
    description: 'Heavy clay field adjacent to Badger Wood. OSR established well in autumn.',
    mapPosition: { top: 2, left: 2, width: 16, height: 20 },
    observations: [],
    activities: [
      { id: 'a-58', timestamp: '2026-02-12T16:00:00', type: 'observation', title: 'Storm Damage Assessment', completedBy: 'John Smith', details: 'Inspected field after Storm Eowyn (80mph gusts recorded locally). Minor waterlogging in SW corner but drains coping. No structural crop damage — plants well anchored. Some leaf scorch from wind burn on exposed hilltop edge but cosmetic only, growing points unaffected.', notes: 'SW corner has always been wet — consider additional drain run this summer', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'storm-damage-overview.jpg', type: 'image' }, { name: 'waterlogging-SW-corner.jpg', type: 'image' }, { name: 'wind-scorch-leaves.jpg', type: 'image' }], source: 'manual' },
      { id: 'a-42', timestamp: '2026-02-03T10:00:00', type: 'observation', title: 'CSFB Monitoring — Larval Check', completedBy: 'Emma Brown', details: 'Checked for cabbage stem flea beetle larvae by dissecting 25 petioles across 5 transects. Average 0.8 larvae per plant — well below threshold of 5. Adult shot-holing damage from autumn mostly grown out. Crop compensating well.', notes: 'Final CSFB check of season — no insecticide needed. Good result.', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'petiole-dissection.jpg', type: 'image' }, { name: 'CSFB-monitoring-record.pdf', type: 'pdf' }], source: 'manual' },
      { id: 'a-43', timestamp: '2026-01-15T09:30:00', type: 'observation', title: 'Fungicide — Light Leaf Spot', completedBy: 'David Jones', details: 'Applied Prothioconazole + Tebuconazole mix as preventative spray for light leaf spot. Crop at green bud stage. Applied at 200 L/ha water volume with 03-F110 nozzles. Good canopy penetration — lower leaves well covered.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: 'Amazone Centaur 6001', inputUsed: 'Prothioconazole + Tebuconazole', quantity: null, rate: null, units: null, evidence: [{ name: 'spray-record-badger-wood.pdf', type: 'pdf' }], source: 'manual' },
      { id: 'a-44', timestamp: '2026-01-02T14:00:00', type: 'observation', title: 'Crop Walk — Canopy Assessment', completedBy: 'John Smith', details: 'Measured green area index at 0.8 using visual assessment and photo comparison charts. Good canopy development for time of year — not over-thick, which would increase disease risk. Plants have 8-12 leaves, root collar diameter 10-15mm. Excellent establishment.', notes: null, linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'OSR-canopy-jan.jpg', type: 'image' }, { name: 'root-collar-measurement.jpg', type: 'image' }], source: 'manual' },
    ],
  },
  {
    id: 'field-24', name: 'New Plantation', usage: 'Oilseed rape',
    sizeAcres: 49.4, sizeHectares: 20.0, soilType: 'Loam', drainage: 'Good',
    scheme: 'None', livestock: null, lastWorked: '2026-02-01',
    description: 'Good deep loam. Autumn-sown OSR with vigorous establishment.',
    mapPosition: { top: 60, left: 82, width: 14, height: 16 },
    observations: [],
    activities: [
      { id: 'a-45', timestamp: '2026-02-01T10:00:00', type: 'observation', title: 'First Nitrogen Split', completedBy: 'Sarah Wilson', details: 'Applied first split of ammonium nitrate at 60 kg N/ha (174 kg/ha product). Targeting total season N of 200 kg/ha in 3 splits based on canopy assessment and SMN sampling. Soil surface dry enough for spreader — no wheelings.', notes: 'Second split at green/yellow bud: 80 kg N/ha. Third at full flower: 60 kg N/ha.', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: 'Amazone Centaur 6001', inputUsed: 'Ammonium nitrate (34.5%N)', quantity: null, rate: 60, units: 'kg N/ha', evidence: [{ name: 'N-plan-new-plantation-2026.pdf', type: 'pdf' }, { name: 'SMN-test-result.pdf', type: 'pdf' }], source: 'manual' },
      { id: 'a-46', timestamp: '2026-01-10T13:00:00', type: 'observation', title: 'Pigeon Damage & Scaring', completedBy: 'Mike Williams', details: 'Significant pigeon grazing damage on headlands — up to 30% leaf area lost in worst patches. Erected 6 additional bird scarers (gas guns + kites) around field perimeter. Set up decoy pattern in worst-hit NW headland. Pigeons roosting in plantation trees on north boundary.', notes: 'Monitor daily. If damage exceeds 50% leaf area, may need to shoot to reinforce scarers.', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'pigeon-damage-headland.jpg', type: 'image' }, { name: 'pigeon-damage-close-up-leaf.jpg', type: 'image' }, { name: 'bird-scarer-positions.jpg', type: 'image' }], source: 'manual' },
    ],
  },
  {
    id: 'field-25', name: 'Spinney', usage: 'Oilseed rape',
    sizeAcres: 34.7, sizeHectares: 14.0, soilType: 'Chalk', drainage: 'Fair',
    scheme: 'None', livestock: null, lastWorked: '2026-01-20',
    description: 'Chalky field beside the spinney copse. OSR benefits from the free lime.',
    mapPosition: { top: 35, left: 2, width: 10, height: 14 },
    observations: [],
    activities: [
      { id: 'a-47', timestamp: '2026-01-20T09:00:00', type: 'observation', title: 'Slug Trap Monitoring', completedBy: 'Tom Taylor', details: 'Collected 8 refuge traps set 3 days ago. Average 2.3 slugs per trap — well below treatment threshold of 4. Mix of grey field slugs and a few keeled slugs. Minimal crop damage visible. Chalk soil naturally less slug-prone.', notes: 'No treatment required. Remove traps until next monitoring in 4 weeks.', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'slug-trap-count-photo.jpg', type: 'image' }, { name: 'slug-monitoring-log.pdf', type: 'pdf' }], source: 'manual' },
      { id: 'a-48', timestamp: '2025-12-20T14:30:00', type: 'observation', title: 'Mid-Winter Crop Inspection', completedBy: 'John Smith', details: 'Thorough mid-winter check. Plants well established with 6-8 true leaves and strong tap roots. No pigeon damage (spinney provides shelter but also raptor habitat keeping pigeons away). Leaf colour healthy dark green. Some purple tinging on older leaves — cold stress, not nutrient deficiency.', notes: 'Healthiest looking OSR field on the estate this season', linkedTaskId: null, taskAction: null, linkedEventId: null, machineryUsed: null, inputUsed: null, quantity: null, rate: null, units: null, evidence: [{ name: 'OSR-spinney-overview-dec.jpg', type: 'image' }, { name: 'OSR-plant-close-up-roots.jpg', type: 'image' }, { name: 'purple-leaf-cold-stress.jpg', type: 'image' }], source: 'manual' },
    ],
  },
]
