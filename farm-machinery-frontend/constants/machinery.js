export const MACHINES = [
  {
    id: 'tractor',
    label: 'Tractor',
    icon: 'tractor',
    description: 'For field preparation and towing',
  },
  {
    id: 'rotavator',
    label: 'Rotavator',
    icon: 'hammer',
    description: 'For soil cultivation',
  },
  {
    id: 'harvester',
    label: 'Harvester',
    icon: 'crop-harvest',
    description: 'For crop collection',
  },
  {
    id: 'landleveller',
    label: 'Land Leveller',
    icon: 'land-plots',
    description: 'For field leveling',
  },
  {
    id: 'seeddrill',
    label: 'Seed Drill',
    icon: 'seed',
    description: 'For precise seed placement',
  },
];

export const OPERATIONS = [
  {
    id: 'soil_preparation',
    label: 'Soil Preparation',
    machines: ['tractor', 'rotavator', 'landleveller'],
    icon: 'shovel',
  },
  {
    id: 'planting',
    label: 'Planting',
    machines: ['seeddrill'],
    icon: 'seed-outline',
  },
  {
    id: 'harvesting',
    label: 'Harvesting',
    machines: ['harvester'],
    icon: 'corn',
  },
]; 