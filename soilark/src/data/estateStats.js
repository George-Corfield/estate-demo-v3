export const estateStats = {
  name: 'Landark Estate',
  totalHectares: 418,
  categories: [
    {
      name: 'Cereals',
      hectares: 214,
      subcategories: [
        { name: 'Wheat', hectares: 72, fieldCount: 4 },
        { name: 'Barley', hectares: 59, fieldCount: 4 },
        { name: 'Oats', hectares: 64, fieldCount: 4 },
        { name: 'Maize', hectares: 47, fieldCount: 3 },
      ],
    },
    {
      name: 'Grass',
      hectares: 80,
      subcategories: [
        { name: 'Silage & Hay', hectares: 39, fieldCount: 2 },
        { name: 'Meadow & Conservation', hectares: 35, fieldCount: 2 },
      ],
    },
    {
      name: 'Root & Industrial Crops',
      hectares: 104,
      subcategories: [
        { name: 'Potatoes', hectares: 51, fieldCount: 3 },
        { name: 'Oilseed Rape', hectares: 53, fieldCount: 3 },
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
