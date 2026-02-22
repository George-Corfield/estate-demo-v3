export const STAFF_STATUS_COLORS = {
  'On Site': 'badge-healthy',
  'Off Site': 'badge-attention',
  'Archived': 'badge-neutral',
}

export const STAFF_CATEGORY_TABS = ['All', 'On Site', 'Off Site']

export const CONTRACT_TYPES = ['Full-Time', 'Part-Time', 'Contractor']

export const PERMISSION_LEVELS = ['Admin', 'Manager', 'Standard', 'View Only']

function getDocExpiryStatus(expiryDate) {
  if (!expiryDate) return null
  const now = new Date()
  const expiry = new Date(expiryDate)
  const daysUntil = Math.round((expiry - now) / (1000 * 60 * 60 * 24))
  if (daysUntil < 0) return 'Expired'
  if (daysUntil < 30) return 'Expiring Soon'
  return 'Valid'
}

export { getDocExpiryStatus }

export const initialStaff = [
  {
    id: 'staff-01',
    name: 'John Smith',
    role: 'Farm Manager',
    initials: 'JS',
    email: 'john.smith@soilark.co.uk',
    mobile: '07700 900123',
    address: '12 Church Lane, Marlborough, Wiltshire SN8 1PA',
    emergencyContact: { name: 'Mary Smith', number: '07700 900124' },
    startDate: '2018-03-15',
    contractType: 'Full-Time',
    hoursPerWeek: 45,
    hourlyRate: 18.50,
    status: 'On Site',
    team: 'Management',
    permissionLevel: 'Admin',
    profilePic: null,
    documents: [
      { id: 'doc-01', name: 'Employment Contract', type: 'Employee Records', expiryDate: null },
      { id: 'doc-02', name: 'Right to Work', type: 'Employee Records', expiryDate: null },
      { id: 'doc-03', name: 'P45', type: 'Employee Records', expiryDate: null },
      { id: 'doc-04', name: 'PA1 Sprayer Certificate', type: 'Qualifications & Certificates', expiryDate: '2027-06-15' },
      { id: 'doc-05', name: 'First Aid Certificate', type: 'Qualifications & Certificates', expiryDate: '2026-09-01' },
    ],
  },
  {
    id: 'staff-02',
    name: 'Sarah Wilson',
    role: 'Livestock Manager',
    initials: 'SW',
    email: 'sarah.wilson@soilark.co.uk',
    mobile: '07700 900125',
    address: '4 The Green, Pewsey, Wiltshire SN9 5DB',
    emergencyContact: { name: 'Tom Wilson', number: '07700 900126' },
    startDate: '2019-09-01',
    contractType: 'Full-Time',
    hoursPerWeek: 40,
    hourlyRate: 16.00,
    status: 'On Site',
    team: 'Livestock',
    permissionLevel: 'Manager',
    profilePic: null,
    documents: [
      { id: 'doc-06', name: 'Employment Contract', type: 'Employee Records', expiryDate: null },
      { id: 'doc-07', name: 'Right to Work', type: 'Employee Records', expiryDate: null },
      { id: 'doc-08', name: 'Livestock Handling Certificate', type: 'Qualifications & Certificates', expiryDate: '2027-03-20' },
      { id: 'doc-09', name: 'Animal Welfare Diploma', type: 'Qualifications & Certificates', expiryDate: null },
    ],
  },
  {
    id: 'staff-03',
    name: 'David Jones',
    role: 'Tractor Driver',
    initials: 'DJ',
    email: 'david.jones@soilark.co.uk',
    mobile: '07700 900127',
    address: '8 Mill Road, Burbage, Wiltshire SN8 3AG',
    emergencyContact: { name: 'Karen Jones', number: '07700 900128' },
    startDate: '2020-04-12',
    contractType: 'Full-Time',
    hoursPerWeek: 42,
    hourlyRate: 14.50,
    status: 'On Site',
    team: 'Arable',
    permissionLevel: 'Standard',
    profilePic: null,
    documents: [
      { id: 'doc-10', name: 'Employment Contract', type: 'Employee Records', expiryDate: null },
      { id: 'doc-11', name: 'Right to Work', type: 'Employee Records', expiryDate: null },
      { id: 'doc-12', name: 'Category F Driving Licence', type: 'Qualifications & Certificates', expiryDate: '2028-11-30' },
      { id: 'doc-13', name: 'Telehandler Licence', type: 'Qualifications & Certificates', expiryDate: '2026-03-10' },
    ],
  },
  {
    id: 'staff-04',
    name: 'Mike Williams',
    role: 'Farm Worker',
    initials: 'MW',
    email: 'mike.williams@soilark.co.uk',
    mobile: '07700 900129',
    address: '21 High Street, Ramsbury, Wiltshire SN8 2PA',
    emergencyContact: { name: 'Jane Williams', number: '07700 900130' },
    startDate: '2022-01-10',
    contractType: 'Full-Time',
    hoursPerWeek: 40,
    hourlyRate: 12.50,
    status: 'Off Site',
    team: 'Arable',
    permissionLevel: 'Standard',
    profilePic: null,
    documents: [
      { id: 'doc-14', name: 'Employment Contract', type: 'Employee Records', expiryDate: null },
      { id: 'doc-15', name: 'Right to Work', type: 'Employee Records', expiryDate: null },
      { id: 'doc-16', name: 'P45', type: 'Employee Records', expiryDate: null },
      { id: 'doc-17', name: 'Manual Handling Certificate', type: 'Qualifications & Certificates', expiryDate: '2025-12-01' },
    ],
  },
  {
    id: 'staff-05',
    name: 'Emma Brown',
    role: 'Farm Worker',
    initials: 'EB',
    email: 'emma.brown@soilark.co.uk',
    mobile: '07700 900131',
    address: '6 Orchard Close, Aldbourne, Wiltshire SN8 2DW',
    emergencyContact: { name: 'Robert Brown', number: '07700 900132' },
    startDate: '2023-06-05',
    contractType: 'Part-Time',
    hoursPerWeek: 24,
    hourlyRate: 12.00,
    status: 'On Site',
    team: 'Livestock',
    permissionLevel: 'Standard',
    profilePic: null,
    documents: [
      { id: 'doc-18', name: 'Employment Contract', type: 'Employee Records', expiryDate: null },
      { id: 'doc-19', name: 'Right to Work', type: 'Employee Records', expiryDate: null },
      { id: 'doc-20', name: 'Food Hygiene Certificate', type: 'Qualifications & Certificates', expiryDate: '2026-06-05' },
    ],
  },
  {
    id: 'staff-06',
    name: 'Tom Taylor',
    role: 'Maintenance Technician',
    initials: 'TT',
    email: 'tom.taylor@soilark.co.uk',
    mobile: '07700 900133',
    address: '15 Station Road, Great Bedwyn, Wiltshire SN8 3PE',
    emergencyContact: { name: 'Lisa Taylor', number: '07700 900134' },
    startDate: '2021-11-20',
    contractType: 'Contractor',
    hoursPerWeek: 30,
    hourlyRate: 22.00,
    status: 'Off Site',
    team: 'Maintenance',
    permissionLevel: 'View Only',
    profilePic: null,
    documents: [
      { id: 'doc-21', name: 'Contractor Agreement', type: 'Employee Records', expiryDate: null },
      { id: 'doc-22', name: 'Right to Work', type: 'Employee Records', expiryDate: null },
      { id: 'doc-23', name: 'City & Guilds Mechanical Engineering', type: 'Qualifications & Certificates', expiryDate: null },
      { id: 'doc-24', name: 'CSCS Card', type: 'Qualifications & Certificates', expiryDate: '2026-04-15' },
    ],
  },
]
