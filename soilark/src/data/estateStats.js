export const estateStats = {
  name: 'Landark Estate',
  totalHectares: 545,
  categories: [
    {
      name: 'Grassland',
      hectares: 360,
      subcategories: [
        { name: 'Permanent Pasture', hectares: 180, fieldCount: 4 },
        { name: 'Temporary Leys', hectares: 120, fieldCount: 2 },
        { name: 'Hay Meadows', hectares: 60, fieldCount: 1 },
      ],
    },
    {
      name: 'Crops',
      hectares: 120,
      subcategories: [
        { name: 'Winter Wheat', hectares: 62, fieldCount: 3 },
        { name: 'Spring Barley', hectares: 38, fieldCount: 2 },
        { name: 'Oilseed Rape', hectares: 20, fieldCount: 2 },
      ],
    },
    {
      name: 'Forestry',
      hectares: 65,
      subcategories: [
        { name: 'Ancient Woodland', hectares: 35, fieldCount: 1 },
        { name: 'New Planting', hectares: 30, fieldCount: 2 },
      ],
    },
    {
      name: 'Buildings',
      count: 8,
      subcategories: [
        { name: 'Main Barn', count: 1 },
        { name: 'Cattle Shed', count: 2 },
        { name: 'Grain Store', count: 1 },
        { name: 'Machinery Store', count: 2 },
        { name: 'Farmhouse', count: 1 },
        { name: 'Workshop', count: 1 },
      ],
    },
  ],
}
