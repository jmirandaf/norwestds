export const catalogs = {
  structureTypes: [
    { id: 'rack-selectivo', label: 'Rack selectivo' },
    { id: 'rack-drivein', label: 'Rack drive-in' },
    { id: 'mezzanine', label: 'Mezzanine' },
    { id: 'conveyor-line', label: 'Conveyor line' },
  ],
  providers: [
    { id: 'advanced', label: 'Advanced', country: 'MX', series: ['30', '40', '45'] },
    { id: 'modular',  label: 'Modular',  country: 'MX', series: ['30', '40', '45'] },
    { id: 'item',     label: 'Item',     country: 'DE', series: ['30', '40', '45'] },
  ],
  profileSeries: [
    { id: '30', label: 'Serie 30 (30×30 mm)', groove_mm: 6 },
    { id: '40', label: 'Serie 40 (40×40 mm)', groove_mm: 8 },
    { id: '45', label: 'Serie 45 (45×45 mm)', groove_mm: 10 },
  ],
  outputFormats: [
    { id: 'step', label: 'STEP' },
    { id: 'stl', label: 'STL' },
    { id: 'fbx', label: 'FBX' },
    { id: 'glb', label: 'GLB' },
    { id: 'pdf', label: 'PDF' },
  ],
  priorities: [
    { id: 'low', label: 'Baja' },
    { id: 'normal', label: 'Normal' },
    { id: 'high', label: 'Alta' },
  ],
}
