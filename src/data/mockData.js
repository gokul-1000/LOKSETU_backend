// ─────────────────────────────────────────────────────────────────────────────
// LOKSETU DELHI — Complete Mock Data
// Replace with real Prisma API calls once backend is wired
// ─────────────────────────────────────────────────────────────────────────────

// ── SHARED / LEADER ───────────────────────────────────────────────────────────

export const KPI_STATS = {
  totalComplaints:    18470,
  resolvedThisMonth:  1284,
  avgResolutionDays:  4.6,
  pendingEscalations: 31,
  wardHealthAvg:      68,
  aiClassified:       98.4,
  openToday:          47,
  resolvedToday:      38,
}

export const COMPLAINTS = [
  { id: 'GRV-2024-001', title: 'Broken streetlights on MG Road',      category: 'Infrastructure',     ward: 'Ward 12', zone: 'Central',    status: 'progress',  priority: 'high',     sentiment: 'frustrated',   sentimentScore: 0.72, date: '2024-03-10', citizen: 'Rajesh Kumar',  channel: 'web',      department: 'PWD',           aiSummary: '6 non-functional streetlights causing safety hazard near school zone. High footfall area.',          tags: ['safety','lighting','school-zone'],  urgency: 7 },
  { id: 'GRV-2024-002', title: 'Water supply disruption for 3 days',   category: 'Water & Sanitation', ward: 'Ward 7',  zone: 'North West', status: 'escalated', priority: 'critical', sentiment: 'angry',        sentimentScore: 0.91, date: '2024-03-11', citizen: 'Priya Sharma',  channel: 'whatsapp', department: 'Water Board',   aiSummary: 'Entire street affected 72+ hours. Multiple households impacted. Pattern indicates pipeline rupture.', tags: ['water','urgent','multi-household'], urgency: 9 },
  { id: 'GRV-2024-003', title: 'Garbage not collected for a week',      category: 'Sanitation',         ward: 'Ward 3',  zone: 'East',       status: 'open',      priority: 'medium',   sentiment: 'dissatisfied', sentimentScore: 0.58, date: '2024-03-12', citizen: 'Amit Verma',    channel: 'kiosk',    department: 'MCD',           aiSummary: 'Garbage at 3 collection points. Health hazard if unaddressed. Truck route needs revision.',          tags: ['sanitation','health','recurring'],  urgency: 5 },
  { id: 'GRV-2024-004', title: 'Pothole causing accidents near market', category: 'Roads',              ward: 'Ward 15', zone: 'South',      status: 'resolved',  priority: 'high',     sentiment: 'neutral',      sentimentScore: 0.30, date: '2024-03-08', citizen: 'Sunita Patel',  channel: 'web',      department: 'PWD',           aiSummary: 'Large pothole (~2ft) in high-traffic commercial zone. 2 accidents reported. Patched on Mar 12.',     tags: ['roads','safety','accident'],        urgency: 8 },
  { id: 'GRV-2024-005', title: 'Encroachment on public footpath',       category: 'Encroachment',       ward: 'Ward 9',  zone: 'South West', status: 'pending',   priority: 'medium',   sentiment: 'frustrated',   sentimentScore: 0.65, date: '2024-03-13', citizen: 'Vikram Singh',  channel: 'web',      department: 'Town Planning', aiSummary: 'Shop extended ~4ft onto footpath. Pedestrians on road. Third complaint at this address.',            tags: ['encroachment','footpath','recurring'], urgency: 5 },
  { id: 'GRV-2024-006', title: 'Park lights not working',               category: 'Infrastructure',     ward: 'Ward 4',  zone: 'Central',    status: 'open',      priority: 'low',      sentiment: 'neutral',      sentimentScore: 0.25, date: '2024-03-14', citizen: 'Meena Joshi',   channel: 'whatsapp', department: 'Parks Dept',    aiSummary: 'Solar-powered lighting failure in Nehru Park. Evening usage affected. Panel inspection needed.',     tags: ['parks','lighting'],                 urgency: 3 },
  { id: 'GRV-2024-007', title: 'Open manhole near residential area',    category: 'Water & Sanitation', ward: 'Ward 12', zone: 'Central',    status: 'progress',  priority: 'critical', sentiment: 'angry',        sentimentScore: 0.88, date: '2024-03-13', citizen: 'Rakesh Gupta',  channel: 'mobile',   department: 'Water Board',   aiSummary: 'Uncovered manhole on residential street. Extreme safety risk for children. Immediate barricading.', tags: ['safety','manhole','critical'],      urgency: 9 },
  { id: 'GRV-2024-008', title: 'Noise pollution from construction',     category: 'Environment',        ward: 'Ward 6',  zone: 'North',      status: 'open',      priority: 'low',      sentiment: 'dissatisfied', sentimentScore: 0.45, date: '2024-03-14', citizen: 'Anita Reddy',   channel: 'web',      department: 'Environment',   aiSummary: 'Construction past 10pm. Hospital and school nearby. Noise ordinance violation.',                    tags: ['noise','environment','ordinance'],  urgency: 4 },
  { id: 'GRV-2024-009', title: 'Sewage overflow on main road',          category: 'Sanitation',         ward: 'Ward 22', zone: 'North East', status: 'escalated', priority: 'critical', sentiment: 'angry',        sentimentScore: 0.95, date: '2024-03-14', citizen: 'Suresh Mehta',  channel: 'whatsapp', department: 'DJB',           aiSummary: 'Sewage overflowing onto main road. Health hazard, odour complaint, pedestrians affected.',           tags: ['sewage','sanitation','urgent'],     urgency: 10 },
  { id: 'GRV-2024-010', title: 'Broken playground equipment in park',   category: 'Parks',              ward: 'Ward 8',  zone: 'East',       status: 'pending',   priority: 'medium',   sentiment: 'dissatisfied', sentimentScore: 0.50, date: '2024-03-09', citizen: 'Lakshmi Nair',  channel: 'web',      department: 'Parks Dept',    aiSummary: 'Swing and slide broken. Children at risk of injury. Maintenance last done 8 months ago.',            tags: ['parks','safety','children'],        urgency: 6 },
]

export const DELHI_ZONES = [
  { id: 'z1',  name: 'Central',    score: 55, wards: 21, resolved: 1548, pending: 843, critical: 4 },
  { id: 'z2',  name: 'North',      score: 62, wards: 17, resolved: 920,  pending: 410, critical: 2 },
  { id: 'z3',  name: 'North East', score: 48, wards: 22, resolved: 1120, pending: 690, critical: 6 },
  { id: 'z4',  name: 'North West', score: 58, wards: 39, resolved: 1800, pending: 820, critical: 3 },
  { id: 'z5',  name: 'East',       score: 61, wards: 20, resolved: 1050, pending: 470, critical: 2 },
  { id: 'z6',  name: 'South',      score: 76, wards: 19, resolved: 1260, pending: 280, critical: 1 },
  { id: 'z7',  name: 'South East', score: 69, wards: 16, resolved: 890,  pending: 310, critical: 1 },
  { id: 'z8',  name: 'South West', score: 64, wards: 31, resolved: 1380, pending: 575, critical: 2 },
  { id: 'z9',  name: 'West',       score: 64, wards: 21, resolved: 1180, pending: 475, critical: 2 },
  { id: 'z10', name: 'New Delhi',  score: 82, wards: 12, resolved: 620,  pending: 110, critical: 0 },
  { id: 'z11', name: 'Shahdara S', score: 61, wards: 20, resolved: 1050, pending: 470, critical: 3 },
  { id: 'z12', name: 'Shahdara N', score: 53, wards: 16, resolved: 840,  pending: 530, critical: 4 },
  { id: 'z13', name: 'Rohini',     score: 59, wards: 36, resolved: 1640, pending: 760, critical: 3 },
  { id: 'z14', name: 'Dwarka',     score: 71, wards: 14, resolved: 980,  pending: 290, critical: 1 },
]

export const WARDS = Array.from({ length: 32 }, (_, i) => ({
  id:              `w${i + 1}`,
  name:            `Ward ${i + 1}`,
  zone:            DELHI_ZONES[i % DELHI_ZONES.length].name,
  healthScore:     [72,45,81,63,58,89,41,76,55,68,82,49,71,60,74,53,66,78,44,85,62,57,79,48,70,83,52,67,73,46,80,61][i],
  totalComplaints: [23,45,11,29,38,14,62,31,48,22,18,55,27,41,16,50,35,19,60,13,44,37,20,52,30,15,47,25,39,58,12,43][i],
  resolved:        [19,24,10,22,25,13,25,22,30,17,16,24,20,28,14,30,26,16,25,12,33,22,17,28,22,14,30,20,30,30,11,30][i],
  pending:         [4, 21,1, 7, 13,1, 37,9, 18,5, 2, 31,7, 13,2, 20,9, 3, 35,1, 11,15,3, 24,8, 1, 17,5, 9, 28,1, 13][i],
  population:      Math.round(8000 + (i * 1234 % 18000)),
  topIssue:        ['Roads','Water','Sanitation','Infrastructure','Environment'][i % 5],
  lat:             28.6 + ((i * 0.017) % 0.4) - 0.2,
  lng:             77.2 + ((i * 0.023) % 0.4) - 0.2,
}))

export const TREND_DATA = [
  { month: 'Oct', complaints: 182, resolved: 160, escalated: 8  },
  { month: 'Nov', complaints: 198, resolved: 171, escalated: 11 },
  { month: 'Dec', complaints: 215, resolved: 185, escalated: 14 },
  { month: 'Jan', complaints: 230, resolved: 196, escalated: 10 },
  { month: 'Feb', complaints: 225, resolved: 201, escalated: 7  },
  { month: 'Mar', complaints: 248, resolved: 218, escalated: 9  },
]

export const CATEGORY_DATA = [
  { name: 'Roads',          value: 28, color: '#1A4B8C' },
  { name: 'Water',          value: 22, color: '#2563C4' },
  { name: 'Sanitation',     value: 19, color: '#E8813A' },
  { name: 'Infrastructure', value: 15, color: '#2A7A4B' },
  { name: 'Encroachment',   value: 9,  color: '#D97706' },
  { name: 'Environment',    value: 7,  color: '#6B48CC' },
]

export const SENTIMENT_TREND = [
  { day: 'Mon', angry: 18, frustrated: 28, neutral: 32, satisfied: 22 },
  { day: 'Tue', angry: 22, frustrated: 25, neutral: 30, satisfied: 23 },
  { day: 'Wed', angry: 14, frustrated: 22, neutral: 35, satisfied: 29 },
  { day: 'Thu', angry: 19, frustrated: 30, neutral: 28, satisfied: 23 },
  { day: 'Fri', angry: 12, frustrated: 20, neutral: 38, satisfied: 30 },
  { day: 'Sat', angry: 10, frustrated: 18, neutral: 36, satisfied: 36 },
  { day: 'Sun', angry: 8,  frustrated: 15, neutral: 40, satisfied: 37 },
]

export const AI_INSIGHTS = [
  { id: 1, type: 'pattern',    severity: 'critical', title: 'Water Crisis Cluster in Wards 5 & 7',              body: 'AI has detected a 340% spike in water-related complaints over 72 hours in adjacent wards. Cross-correlation suggests upstream pipeline failure. Immediate inspection of Zone-B water mains recommended.',               confidence: 94, actionable: true,  timestamp: new Date(Date.now() - 3  * 3600000).toISOString() },
  { id: 2, type: 'prediction', severity: 'warning',  title: 'Road Condition Deterioration Forecast',             body: 'Post-monsoon damage patterns + recent rainfall data suggest 60% probability of road complaints doubling in Wards 3, 9, 12 within 2 weeks. Pre-emptive patching of identified hotspots could prevent 40+ escalations.',  confidence: 78, actionable: true,  timestamp: new Date(Date.now() - 5  * 3600000).toISOString() },
  { id: 3, type: 'sentiment',  severity: 'info',     title: 'Citizen Sentiment Improving in Ward 8',             body: "Following last week's rapid response to sanitation complaints, Ward 8 sentiment score improved by 23 points. Citizens expressing appreciation via WhatsApp bot. Model response time: 1.4 days.",                             confidence: 91, actionable: false, timestamp: new Date(Date.now() - 8  * 3600000).toISOString() },
  { id: 4, type: 'rootcause',  severity: 'warning',  title: 'PWD SLA Breach Pattern in North Zone',              body: 'PWD Engineering has breached SLA on 68% of road repair complaints in North Zone over the past 30 days. Root cause analysis points to contractor non-performance. Escalation to Superintending Engineer recommended.',        confidence: 85, actionable: true,  timestamp: new Date(Date.now() - 12 * 3600000).toISOString() },
  { id: 5, type: 'pattern',    severity: 'info',     title: 'Encroachment Complaints Cluster Near Zone Borders',  body: 'Encroachment complaints are 3.2x more common within 200m of zone boundaries — likely due to jurisdictional ambiguity between MCD zones. Recommend boundary clarification circular to ward officers.',                       confidence: 72, actionable: true,  timestamp: new Date(Date.now() - 18 * 3600000).toISOString() },
]

export const DEPARTMENTS = [
  { id: 'd1', name: 'PWD',           shortName: 'PWD',   score: 80, status: 'on-track',        assigned: 89, resolved: 71, avgDays: 4.2, color: '#1A4B8C' },
  { id: 'd2', name: 'Water Board',   shortName: 'Water', score: 67, status: 'moderate',         assigned: 72, resolved: 48, avgDays: 6.8, color: '#2563C4' },
  { id: 'd3', name: 'MCD',           shortName: 'MCD',   score: 85, status: 'on-track',         assigned: 61, resolved: 52, avgDays: 3.1, color: '#2A7A4B' },
  { id: 'd4', name: 'Town Planning', shortName: 'TP',    score: 58, status: 'needs-attention',   assigned: 38, resolved: 22, avgDays: 9.4, color: '#C0392B' },
  { id: 'd5', name: 'Parks Dept',    shortName: 'Parks', score: 90, status: 'on-track',          assigned: 29, resolved: 26, avgDays: 2.8, color: '#2A7A4B' },
  { id: 'd6', name: 'Environment',   shortName: 'Env',   score: 61, status: 'moderate',          assigned: 18, resolved: 11, avgDays: 7.2, color: '#D97706' },
  { id: 'd7', name: 'DJB',           shortName: 'DJB',   score: 72, status: 'moderate',          assigned: 54, resolved: 39, avgDays: 5.5, color: '#6B48CC' },
  { id: 'd8', name: 'DUSIB',         shortName: 'DUSIB', score: 55, status: 'needs-attention',   assigned: 31, resolved: 17, avgDays: 8.1, color: '#E8813A' },
]

export const DEPT_RADAR_DATA = [
  { subject: 'PWD',         A: 80 },
  { subject: 'Water',       A: 67 },
  { subject: 'Municipal',   A: 85 },
  { subject: 'Parks',       A: 90 },
  { subject: 'Environment', A: 61 },
]

export const NOTIFICATIONS = [
  { id: 1, type: 'critical', text: 'Sewage overflow in Ward 22 — SLA breach imminent',      time: '5m ago',  read: false },
  { id: 2, type: 'warning',  text: 'Water crisis cluster detected — Wards 5 & 7',           time: '32m ago', read: false },
  { id: 3, type: 'info',     text: '1,284 complaints resolved this month — record high',     time: '2h ago',  read: false },
  { id: 4, type: 'warning',  text: 'PWD SLA breach pattern detected in North Zone',          time: '4h ago',  read: true  },
  { id: 5, type: 'info',     text: 'Ward 8 sentiment improved +23pts after rapid response',  time: '8h ago',  read: true  },
]

// ── CITIZEN ───────────────────────────────────────────────────────────────────

export const MY_COMPLAINTS = [
  {
    id: 'GRV-2024-001',
    title: 'Broken streetlights on MG Road',
    category: 'Infrastructure',
    status: 'progress',
    priority: 'high',
    date: '2024-03-10',
    lastUpdate: '2024-03-13',
    department: 'PWD',
    urgency: 7,
    sentiment: 'frustrated',
    aiSummary: '6 non-functional streetlights near school zone. Officer assigned. Site visit scheduled for Mar 14.',
    timeline: [
      { label: 'Submitted',          date: 'Mar 10', done: true  },
      { label: 'AI Classified',      date: 'Mar 10', done: true  },
      { label: 'Assigned to PWD',    date: 'Mar 11', done: true  },
      { label: 'Site Visit',         date: 'Mar 14', done: false },
      { label: 'Resolved',           date: '—',      done: false },
    ],
    canAddInfo: true,
  },
  {
    id: 'GRV-2024-007',
    title: 'Open manhole near residential area',
    category: 'Water & Sanitation',
    status: 'escalated',
    priority: 'critical',
    date: '2024-03-13',
    lastUpdate: '2024-03-14',
    department: 'Water Board',
    urgency: 9,
    sentiment: 'angry',
    aiSummary: 'Escalated to Zonal Officer after SLA breach. Barricading team deployed.',
    timeline: [
      { label: 'Submitted',             date: 'Mar 13', done: true  },
      { label: 'AI Classified',         date: 'Mar 13', done: true  },
      { label: 'Assigned to Water Board', date: 'Mar 13', done: true },
      { label: 'SLA Breached',          date: 'Mar 14', done: true  },
      { label: 'Resolved',              date: '—',      done: false },
    ],
    canAddInfo: false,
  },
  {
    id: 'GRV-2023-892',
    title: 'Waterlogging near bus stop',
    category: 'Roads',
    status: 'resolved',
    priority: 'medium',
    date: '2024-01-22',
    lastUpdate: '2024-02-01',
    department: 'PWD',
    urgency: 5,
    sentiment: 'satisfied',
    aiSummary: 'Drain cleared and road repaired. Resolved within SLA.',
    timeline: [
      { label: 'Submitted',       date: 'Jan 22', done: true },
      { label: 'AI Classified',   date: 'Jan 22', done: true },
      { label: 'Assigned to PWD', date: 'Jan 23', done: true },
      { label: 'Under Review',    date: 'Jan 25', done: true },
      { label: 'Resolved',        date: 'Feb 1',  done: true },
    ],
    canAddInfo: false,
  },
]

export const RTI_TOPICS = [
  { id: 1, title: 'Right to clean water supply',  act: 'Delhi Water Board Act §14',          sla: '24 hours',                  desc: 'You are entitled to uninterrupted water supply. If disrupted for >24hrs, file complaint + RTI simultaneously. You may also claim compensation for disruption beyond 48hrs.' },
  { id: 2, title: 'Road repair SLA guarantee',    act: 'PWD Delhi SOP §4.2',                 sla: '48 hours (Category A)',     desc: 'Potholes and road damage must be repaired within 48hrs (Category A) or 7 days (Category B). Failure gives you the right to file RTI asking for action taken reports.' },
  { id: 3, title: 'Garbage collection frequency', act: 'Municipal Solid Waste Rules 2016',   sla: 'Daily for residential',     desc: 'MCD is mandated to collect garbage daily from residential areas. Weekly from commercial. Persistent failure after complaint allows RTI escalation to Municipal Commissioner.' },
  { id: 4, title: 'Street light maintenance',     act: 'Delhi Municipal Corporation Act §54', sla: '72 hours',                 desc: 'Streetlights must be repaired within 72 hours of complaint. Night-time safety is a civic right. File RTI if unresolved after 5 days.' },
  { id: 5, title: 'Encroachment removal',         act: 'Delhi Municipal Corporation Act §321',sla: '15 days',                  desc: 'Encroachment on public land/footpaths must be removed within 15 days of verified complaint. Third-party encroachment on your property has expedited SLA of 7 days.' },
]

// ── WARD OFFICER ──────────────────────────────────────────────────────────────

export const MY_WARD = {
  name: 'Ward 12 — Karol Bagh',
  zone: 'Central Zone',
  population: 48200,
  healthScore: 62,
  slaBreachRate: 18,
  avgResolutionDays: 5.8,
  openComplaints: 34,
  resolvedThisWeek: 12,
  escalated: 4,
  topIssue: 'Water & Sanitation',
  officer: { name: 'Rajiv Sharma', phone: '+91-9811XXXXXX', since: '2022' },
}

export const WARD_COMPLAINTS = [
  { id: 'GRV-2024-001', title: 'Broken streetlights on MG Road',   category: 'Infrastructure',     status: 'progress',  priority: 'high',     citizen: 'Rajesh Kumar', phone: '98XXXXXX01', date: '2024-03-10', slaHours: 48,  hoursElapsed: 72,  department: 'PWD',         assignedTo: 'Sunil Kumar (PWD JE)',   urgency: 7, location: 'MG Road, near Karol Bagh Metro',    tags: ['safety','lighting'],       aiSummary: '6 lights out. School zone. High footfall. SLA breached by 24hrs.',           sentiment: 'frustrated', canEscalate: true  },
  { id: 'GRV-2024-007', title: 'Open manhole near residential area',category: 'Water & Sanitation', status: 'escalated', priority: 'critical', citizen: 'Rakesh Gupta',  phone: '98XXXXXX07', date: '2024-03-13', slaHours: 24,  hoursElapsed: 36,  department: 'Water Board', assignedTo: 'Water Board Zone-B',     urgency: 9, location: 'Gaffar Market Lane 3',               tags: ['safety','manhole'],        aiSummary: 'Critical safety hazard. Already escalated to ZO.',                           sentiment: 'angry',      canEscalate: false },
  { id: 'GRV-2024-011', title: 'Garbage pile near school for 5 days',category: 'Sanitation',        status: 'open',      priority: 'high',     citizen: 'Meena Devi',   phone: '98XXXXXX11', date: '2024-03-12', slaHours: 24,  hoursElapsed: 52,  department: 'MCD',         assignedTo: null,                     urgency: 8, location: 'Pusa Road, Karol Bagh',              tags: ['sanitation','school'],     aiSummary: 'Unassigned. 3 similar complaints in same block. Auto-group detected.',       sentiment: 'dissatisfied',canEscalate: true  },
  { id: 'GRV-2024-012', title: 'Pothole cluster on Ring Road',      category: 'Roads',              status: 'open',      priority: 'medium',   citizen: 'Vijay Verma',  phone: '98XXXXXX12', date: '2024-03-11', slaHours: 72,  hoursElapsed: 80,  department: 'PWD',         assignedTo: null,                     urgency: 6, location: 'Ring Road near Patel Nagar flyover', tags: ['roads','accident-risk'],   aiSummary: '4 related pothole complaints in 200m radius. Cluster confirmed.',            sentiment: 'neutral',    canEscalate: true  },
  { id: 'GRV-2024-013', title: 'Water supply cut for 2 days',       category: 'Water & Sanitation', status: 'pending',   priority: 'high',     citizen: 'Priya Kapoor', phone: '98XXXXXX13', date: '2024-03-14', slaHours: 24,  hoursElapsed: 18,  department: 'Water Board', assignedTo: 'Water Board Zone-B',     urgency: 8, location: 'Block C, Karol Bagh',                tags: ['water','multi-household'], aiSummary: '12 households affected. Assigned but not acknowledged by dept yet.',          sentiment: 'angry',      canEscalate: false },
]

export const COMPLAINT_CLUSTERS = [
  { id: 'cl1', category: 'Sanitation',         count: 7, wards: ['Ward 12','Ward 13'], summary: 'Garbage pile-up near Pusa Road schools — possible MCD truck route failure',        status: 'open',      urgency: 8, suggestedAction: 'Emergency sanitation drive + MCD route revision request' },
  { id: 'cl2', category: 'Roads',              count: 4, wards: ['Ward 12'],           summary: 'Pothole cluster on Ring Road near Patel Nagar flyover — accident risk',           status: 'open',      urgency: 6, suggestedAction: 'File group complaint to PWD. Request emergency patching order.' },
  { id: 'cl3', category: 'Water & Sanitation', count: 5, wards: ['Ward 12','Ward 7'],  summary: 'Recurring water shortage in Block B/C — possible pipeline issue in Zone-B main', status: 'escalated', urgency: 9, suggestedAction: 'Already escalated. Monitor Water Board response.' },
]

export const EMPLOYEES = [
  { id: 'e1', name: 'Sunil Kumar',  dept: 'PWD',         role: 'Junior Engineer',      phone: '98XXXXXX21', assigned: 12, resolved: 8,  avgDays: 4.1, available: true  },
  { id: 'e2', name: 'Ramesh Singh', dept: 'MCD',         role: 'Sanitation Inspector', phone: '98XXXXXX22', assigned: 9,  resolved: 9,  avgDays: 2.8, available: true  },
  { id: 'e3', name: 'Priya Mehta',  dept: 'Water Board', role: 'Field Officer',        phone: '98XXXXXX23', assigned: 6,  resolved: 2,  avgDays: 8.4, available: false },
  { id: 'e4', name: 'Ajay Sharma',  dept: 'PWD',         role: 'Site Supervisor',      phone: '98XXXXXX24', assigned: 7,  resolved: 6,  avgDays: 3.5, available: true  },
]

export const DRAFT_ORDERS = [
  {
    id: 'd1',
    type: 'Emergency Sanitation Order',
    target: 'MCD Zone Officer',
    complaint: 'GRV-2024-011',
    draft: 'This is to bring to your urgent attention that garbage has been accumulating near Government School, Pusa Road, Karol Bagh for the past 5 days. 3 similar complaints have been filed in the same block. This constitutes a public health hazard under Municipal Solid Waste Rules 2016. You are directed to arrange for immediate clearance within 24 hours and revise the truck route. Failure to comply will necessitate escalation to the Zonal Commissioner.',
    status: 'draft',
  },
  {
    id: 'd2',
    type: 'PWD Repair Requisition',
    target: 'PWD Executive Engineer',
    complaint: 'GRV-2024-012',
    draft: 'Multiple pothole complaints (4 nos.) have been received for Ring Road near Patel Nagar flyover. The AI system has flagged this as a cluster with accident risk. Request emergency patching work to be taken up within 48 hours under PWD SOP §4.2 (Category A road). Attached: complaint IDs GRV-2024-012, cluster report, location coordinates.',
    status: 'draft',
  },
]

// ── DEPARTMENT HEAD ───────────────────────────────────────────────────────────

export const MY_DEPT = {
  name: 'Public Works Department (PWD)',
  code: 'PWD',
  headName: 'Anita Rao',
  totalComplaints: 89,
  resolved: 71,
  pending: 18,
  escalated: 5,
  avgDays: 4.2,
  slaBreachRate: 12,
  score: 80,
  status: 'on-track',
  budget: { allocated: 4200000, spent: 3100000, utilisation: 74 },
}

export const DEPT_COMPLAINTS = [
  { id: 'GRV-2024-001', title: 'Broken streetlights on MG Road',       ward: 'Ward 12', zone: 'Central',    status: 'progress',  priority: 'high',     assignedTo: 'Sunil Kumar', daysOpen: 4, slaBreached: true,  slaHours: 48, citizen: 'Rajesh Kumar',  urgency: 7,  category: 'Infrastructure' },
  { id: 'GRV-2024-004', title: 'Pothole causing accidents near market', ward: 'Ward 15', zone: 'South',      status: 'resolved',  priority: 'high',     assignedTo: 'Ajay Sharma', daysOpen: 4, slaBreached: false, slaHours: 48, citizen: 'Sunita Patel',  urgency: 8,  category: 'Roads'          },
  { id: 'GRV-2024-012', title: 'Pothole cluster on Ring Road',          ward: 'Ward 12', zone: 'Central',    status: 'open',      priority: 'medium',   assignedTo: null,          daysOpen: 3, slaBreached: false, slaHours: 72, citizen: 'Vijay Verma',   urgency: 6,  category: 'Roads'          },
  { id: 'GRV-2024-015', title: 'Road cave-in near metro station',       ward: 'Ward 5',  zone: 'North',      status: 'escalated', priority: 'critical', assignedTo: 'Ravi Gupta',  daysOpen: 2, slaBreached: false, slaHours: 24, citizen: 'Alok Tiwari',   urgency: 10, category: 'Roads'          },
  { id: 'GRV-2024-018', title: 'Broken footpath tiles causing injuries', ward: 'Ward 9', zone: 'South West', status: 'pending',   priority: 'medium',   assignedTo: 'Sunil Kumar', daysOpen: 6, slaBreached: true,  slaHours: 72, citizen: 'Geeta Sharma',  urgency: 5,  category: 'Infrastructure' },
]

export const DEPT_EMPLOYEES = [
  { id: 'e1', name: 'Sunil Kumar',  role: 'Junior Engineer', zone: 'Central', assigned: 12, resolved: 8,  avgDays: 4.1, breaches: 2, score: 72, phone: '98XXXXXX21' },
  { id: 'e2', name: 'Ajay Sharma',  role: 'Site Supervisor', zone: 'South',   assigned: 7,  resolved: 6,  avgDays: 3.5, breaches: 0, score: 91, phone: '98XXXXXX24' },
  { id: 'e3', name: 'Ravi Gupta',   role: 'Junior Engineer', zone: 'North',   assigned: 10, resolved: 6,  avgDays: 6.2, breaches: 3, score: 58, phone: '98XXXXXX25' },
  { id: 'e4', name: 'Neha Sharma',  role: 'Field Inspector', zone: 'East',    assigned: 8,  resolved: 7,  avgDays: 3.8, breaches: 1, score: 84, phone: '98XXXXXX26' },
  { id: 'e5', name: 'Prakash Rao',  role: 'Site Supervisor', zone: 'West',    assigned: 6,  resolved: 4,  avgDays: 7.1, breaches: 2, score: 61, phone: '98XXXXXX27' },
]

export const DEPT_ROOT_CAUSE = [
  { category: 'Roads',          count: 38, trend: '+12%', rootCause: 'Post-monsoon damage compounded by heavy commercial vehicle load. 3 contractor teams underperforming on Ring Road sector.',             recommendation: 'Emergency patching order for Ring Road cluster. Contractor performance review due. Consider termination of ABC Ltd. (68% breach rate).', severity: 'high'   },
  { category: 'Infrastructure', count: 24, trend: '+4%',  rootCause: 'Ageing streetlight infrastructure in Central Zone (installed pre-2018). Solar panel failure rate increasing. Warranty expired.',       recommendation: 'Bulk replacement proposal for 200+ lights. Raise indent to Chief Engineer. Emergency procurement for Central Zone.',                         severity: 'medium' },
  { category: 'Footpath',       count: 12, trend: '-8%',  rootCause: 'Poor quality tiles from Q3 2023 procurement batch (Vendor: Sharma & Co). Systematic delamination in wet conditions across 3 wards.', recommendation: 'Stop-work notice to vendor. Claim penalty under contract Clause 14.2. Emergency re-tender for 4,200 sqm footpath tiles needed.',          severity: 'medium' },
]

export const DEPT_WEEKLY_TREND = [
  { week: 'W1 Jan', filed: 18, resolved: 16, breached: 1 },
  { week: 'W2 Jan', filed: 22, resolved: 19, breached: 2 },
  { week: 'W3 Jan', filed: 16, resolved: 15, breached: 0 },
  { week: 'W4 Jan', filed: 24, resolved: 18, breached: 3 },
  { week: 'W1 Feb', filed: 20, resolved: 17, breached: 2 },
  { week: 'W2 Feb', filed: 26, resolved: 21, breached: 2 },
  { week: 'W3 Feb', filed: 19, resolved: 18, breached: 1 },
  { week: 'W4 Feb', filed: 28, resolved: 22, breached: 3 },
]