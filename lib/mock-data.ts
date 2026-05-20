export interface VehicleIssue {
  id: string;
  title: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  repairEstimate: number;
  location: string;
  description: string;
}

export const VEHICLE_ISSUES: VehicleIssue[] = [
  { id: '1', title: 'Front bumper scratch detected', severity: 'medium', confidence: 94, repairEstimate: 180, location: 'Front', description: 'Surface scratch on front bumper, approximately 15cm in length' },
  { id: '2', title: 'Tire wear detected', severity: 'high', confidence: 91, repairEstimate: 320, location: 'Wheels', description: 'Significant tread wear on front left tire, below legal limit' },
  { id: '3', title: 'Left side dent detected', severity: 'medium', confidence: 88, repairEstimate: 250, location: 'Left Side', description: 'Minor dent on left door panel, approximately 5cm diameter' },
  { id: '4', title: 'Rust near wheel arch detected', severity: 'high', confidence: 86, repairEstimate: 400, location: 'Underbody', description: 'Surface rust forming near rear left wheel arch' },
  { id: '5', title: 'Paint inconsistency detected', severity: 'low', confidence: 82, repairEstimate: 150, location: 'Right Side', description: 'Paint thickness variation suggesting previous repair' },
  { id: '6', title: 'Rear bumper crack detected', severity: 'medium', confidence: 90, repairEstimate: 280, location: 'Rear', description: 'Hairline crack on rear bumper lower section' },
  { id: '7', title: 'Windshield chip detected', severity: 'medium', confidence: 93, repairEstimate: 120, location: 'Front', description: 'Small chip on windshield, driver side area' },
  { id: '8', title: 'Headlight condensation detected', severity: 'low', confidence: 79, repairEstimate: 200, location: 'Front', description: 'Moisture buildup inside right headlight assembly' },
  { id: '9', title: 'Brake pad wear detected', severity: 'critical', confidence: 96, repairEstimate: 350, location: 'Brakes', description: 'Front brake pads below minimum thickness, immediate replacement needed' },
  { id: '10', title: 'Exhaust leak detected', severity: 'high', confidence: 85, repairEstimate: 450, location: 'Underbody', description: 'Minor exhaust leak detected near catalytic converter' },
  { id: '11', title: 'Suspension noise detected', severity: 'medium', confidence: 77, repairEstimate: 380, location: 'Suspension', description: 'Unusual noise from front suspension over bumps' },
  { id: '12', title: 'Battery corrosion detected', severity: 'low', confidence: 83, repairEstimate: 60, location: 'Engine', description: 'Corrosion buildup on battery terminals' },
  { id: '13', title: 'Oil leak detected', severity: 'high', confidence: 89, repairEstimate: 520, location: 'Engine', description: 'Minor oil seepage from valve cover gasket' },
  { id: '14', title: 'Transmission fluid low', severity: 'medium', confidence: 81, repairEstimate: 90, location: 'Transmission', description: 'Transmission fluid level below recommended minimum' },
  { id: '15', title: 'AC compressor noise', severity: 'low', confidence: 74, repairEstimate: 600, location: 'Engine', description: 'Intermittent noise from AC compressor clutch' },
  { id: '16', title: 'Wheel alignment issue', severity: 'medium', confidence: 87, repairEstimate: 80, location: 'Wheels', description: 'Steering pull detected, alignment likely required' },
  { id: '17', title: 'Cabin air filter clogged', severity: 'low', confidence: 92, repairEstimate: 35, location: 'Interior', description: 'Reduced airflow from HVAC, filter replacement needed' },
  { id: '18', title: 'Rust on brake rotors', severity: 'medium', confidence: 78, repairEstimate: 300, location: 'Brakes', description: 'Surface rust on rear brake rotors from moisture exposure' },
  { id: '19', title: 'Power steering fluid leak', severity: 'high', confidence: 84, repairEstimate: 280, location: 'Steering', description: 'Slow leak in power steering rack boot' },
  { id: '20', title: 'Catalytic converter efficiency', severity: 'high', confidence: 80, repairEstimate: 800, location: 'Exhaust', description: 'Catalytic converter operating below efficiency threshold' },
  { id: '21', title: 'Coolant reservoir crack', severity: 'medium', confidence: 76, repairEstimate: 120, location: 'Engine', description: 'Hairline crack in coolant overflow reservoir' },
  { id: '22', title: 'Wiper blade deterioration', severity: 'low', confidence: 95, repairEstimate: 30, location: 'Front', description: 'Wiper blades showing signs of cracking and reduced performance' },
  { id: '23', title: 'Door seal wear detected', severity: 'low', confidence: 73, repairEstimate: 100, location: 'Interior', description: 'Weather stripping on driver door showing age deterioration' },
  { id: '24', title: 'Fuel line corrosion', severity: 'critical', confidence: 88, repairEstimate: 450, location: 'Underbody', description: 'Surface corrosion on fuel line near tank, requires inspection' },
  { id: '25', title: 'Alternator output low', severity: 'high', confidence: 82, repairEstimate: 380, location: 'Engine', description: 'Alternator output below specification at idle' },
  { id: '26', title: 'Rear shock absorber wear', severity: 'medium', confidence: 79, repairEstimate: 340, location: 'Suspension', description: 'Rear shock absorbers showing reduced damping performance' },
  { id: '27', title: 'Timing belt age indicator', severity: 'high', confidence: 71, repairEstimate: 650, location: 'Engine', description: 'Timing belt approaching recommended replacement interval' },
  { id: '28', title: 'Radiator fin damage', severity: 'medium', confidence: 75, repairEstimate: 220, location: 'Engine', description: 'Bent radiator fins reducing cooling efficiency' },
  { id: '29', title: 'Seat belt retractor slow', severity: 'medium', confidence: 86, repairEstimate: 180, location: 'Interior', description: 'Driver seat belt retractor showing slow return speed' },
  { id: '30', title: 'EVAP system leak', severity: 'low', confidence: 68, repairEstimate: 150, location: 'Emissions', description: 'Small leak detected in evaporative emission control system' },
  { id: '31', title: 'Wheel bearing noise', severity: 'high', confidence: 83, repairEstimate: 420, location: 'Wheels', description: 'Grinding noise from front right wheel bearing' },
  { id: '32', title: 'Thermostat sticking', severity: 'medium', confidence: 77, repairEstimate: 160, location: 'Engine', description: 'Engine temperature fluctuations suggesting thermostat issue' },
  { id: '33', title: 'Mirror housing crack', severity: 'low', confidence: 91, repairEstimate: 140, location: 'Exterior', description: 'Small crack in side mirror housing' },
];

export const SCAN_STEPS = [
  'Uploading vehicle images...',
  'Initializing AI engine...',
  'Analyzing vehicle health...',
  'Detecting damages...',
  'Scanning structural condition...',
  'Running AI diagnostics...',
  'Calculating condition score...',
  'Generating Full AI Report...',
];

export const UPLOAD_SLOTS = [
  { id: 'front', label: 'Front', icon: 'car-front' },
  { id: 'rear', label: 'Rear', icon: 'car-rear' },
  { id: 'left', label: 'Left Side', icon: 'car-side' },
  { id: 'right', label: 'Right Side', icon: 'car-side' },
  { id: 'interior', label: 'Interior', icon: 'car-interior' },
  { id: 'engine', label: 'Engine Bay', icon: 'engine' },
];

export const PRICING_PLANS = [
  {
    id: 'basic',
    name: 'Basic Health Scan',
    price: 50,
    description: 'Essential AI vehicle scanning for quick health overview',
    features: [
      'AI damage detection scan',
      'Basic condition score',
      'Up to 10 issue detections',
      'Standard AI report format',
      'Email delivery',
    ],
    popular: false,
  },
  {
    id: 'advanced',
    name: 'Advanced Condition Report',
    price: 70,
    description: 'Comprehensive AI analysis with detailed diagnostics',
    features: [
      'Full AI damage detection',
      'Advanced condition scoring',
      'Up to 25 issue detections',
      'Repair cost estimates',
      'Risk prediction analysis',
      'Priority processing',
      'PDF & online report',
    ],
    popular: true,
  },
  {
    id: 'complete',
    name: 'Complete Inspection Summary',
    price: 80,
    description: 'Ultimate AI intelligence with full vehicle insights',
    features: [
      'Complete AI damage detection',
      'Premium condition scoring',
      'Unlimited issue detections',
      'Detailed repair estimates',
      'Accident risk analysis',
      'Structural integrity check',
      'Priority processing',
      'PDF & online report',
      '30-day report access',
      'Expert AI recommendations',
    ],
    popular: false,
  },
];

export const DASHBOARD_STATS = [
  { label: 'Total Reports', value: '12,847', change: '+12.5%', trend: 'up' as const },
  { label: 'Revenue', value: '£89,420', change: '+8.2%', trend: 'up' as const },
  { label: 'Active Users', value: '3,241', change: '+15.3%', trend: 'up' as const },
  { label: 'AI Scans Today', value: '847', change: '+22.1%', trend: 'up' as const },
];

export const RECENT_ACTIVITY = [
  { id: '1', user: 'James Wilson', action: 'Generated Full AI Report', vehicle: 'BMW 3 Series 2021', time: '2 min ago', status: 'completed' },
  { id: '2', user: 'Sarah Chen', action: 'Purchased Advanced Report', vehicle: 'Audi A4 2022', time: '5 min ago', status: 'completed' },
  { id: '3', user: 'Michael Brown', action: 'AI Scan in Progress', vehicle: 'Mercedes C-Class 2020', time: '8 min ago', status: 'processing' },
  { id: '4', user: 'Emma Davis', action: 'Uploaded Vehicle Images', vehicle: 'Volkswagen Golf 2023', time: '12 min ago', status: 'processing' },
  { id: '5', user: 'Robert Taylor', action: 'Payment Received', vehicle: 'Ford Focus 2019', time: '15 min ago', status: 'completed' },
  { id: '6', user: 'Lisa Anderson', action: 'Generated Full AI Report', vehicle: 'Toyota Corolla 2021', time: '18 min ago', status: 'completed' },
  { id: '7', user: 'David Martinez', action: 'Requested Refund', vehicle: 'Honda Civic 2022', time: '25 min ago', status: 'pending' },
  { id: '8', user: 'Anna White', action: 'Purchased Complete Report', vehicle: 'Hyundai Tucson 2023', time: '30 min ago', status: 'completed' },
];

export const REPORTS_TABLE = [
  { id: 'RPT-001', vehicle: 'BMW 3 Series 2021', customer: 'James Wilson', plan: 'Complete', amount: '£80', status: 'delivered' as const, date: '2026-05-11' },
  { id: 'RPT-002', vehicle: 'Audi A4 2022', customer: 'Sarah Chen', plan: 'Advanced', amount: '£70', status: 'delivered' as const, date: '2026-05-11' },
  { id: 'RPT-003', vehicle: 'Mercedes C-Class 2020', customer: 'Michael Brown', plan: 'Complete', amount: '£80', status: 'processing' as const, date: '2026-05-11' },
  { id: 'RPT-004', vehicle: 'Volkswagen Golf 2023', customer: 'Emma Davis', plan: 'Basic', amount: '£50', status: 'processing' as const, date: '2026-05-10' },
  { id: 'RPT-005', vehicle: 'Ford Focus 2019', customer: 'Robert Taylor', plan: 'Advanced', amount: '£70', status: 'delivered' as const, date: '2026-05-10' },
  { id: 'RPT-006', vehicle: 'Toyota Corolla 2021', customer: 'Lisa Anderson', plan: 'Complete', amount: '£80', status: 'delivered' as const, date: '2026-05-10' },
  { id: 'RPT-007', vehicle: 'Honda Civic 2022', customer: 'David Martinez', plan: 'Basic', amount: '£50', status: 'refunded' as const, date: '2026-05-09' },
  { id: 'RPT-008', vehicle: 'Hyundai Tucson 2023', customer: 'Anna White', plan: 'Complete', amount: '£80', status: 'delivered' as const, date: '2026-05-09' },
];

export const REVENUE_DATA = [
  { month: 'Jan', revenue: 4200, reports: 68 },
  { month: 'Feb', revenue: 5100, reports: 82 },
  { month: 'Mar', revenue: 4800, reports: 76 },
  { month: 'Apr', revenue: 6200, reports: 98 },
  { month: 'May', revenue: 7100, reports: 112 },
  { month: 'Jun', revenue: 6800, reports: 108 },
  { month: 'Jul', revenue: 7900, reports: 126 },
  { month: 'Aug', revenue: 8200, reports: 132 },
  { month: 'Sep', revenue: 7600, reports: 120 },
  { month: 'Oct', revenue: 8800, reports: 140 },
  { month: 'Nov', revenue: 9200, reports: 148 },
  { month: 'Dec', revenue: 10400, reports: 166 },
];
