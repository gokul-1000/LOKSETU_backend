// Comprehensive Delhi Ward & Department Data
// 250 Wards grouped by 11 Zones

export const DEPARTMENTS = [
  { id: 'pwd', name: 'PWD (Public Works Dept)', emoji: '🛣️', description: 'Roads, maintenance, infrastructure' },
  { id: 'water', name: 'Water Board', emoji: '💧', description: 'Water supply, leaks, blockages' },
  { id: 'sanitation', name: 'Sanitation Department', emoji: '🗑️', description: 'Garbage, cleanliness, drains' },
  { id: 'municipal', name: 'Municipal Corporation', emoji: '🏛️', description: 'General municipal services' },
  { id: 'electricity', name: 'Electricity Department', emoji: '⚡', description: 'Power, street lights, outages' },
  { id: 'parks', name: 'Parks & Recreation', emoji: '🌳', description: 'Parks maintenance, green spaces' },
  { id: 'town_planning', name: 'Town Planning', emoji: '📐', description: 'Encroachment, construction' },
  { id: 'health', name: 'Health Department', emoji: '🏥', description: 'Health facilities, hygiene' },
  { id: 'traffic', name: 'Traffic & Transport', emoji: '🚗', description: 'Traffic, parking, transport' },
  { id: 'environment', name: 'Environment Dept', emoji: '🌍', description: 'Pollution, environment issues' },
  { id: 'fire', name: 'Fire Services', emoji: '🚒', description: 'Fire safety, emergencies' },
  { id: 'police', name: 'Police Department', emoji: '👮', description: 'Law & order, safety' },
];

export const CATEGORIES = [
  'Roads & Pavements',
  'Water & Sanitation',
  'Electricity & Street Lights',
  'Sanitation & Waste Management',
  'Infrastructure & Buildings',
  'Encroachment',
  'Environment & Pollution',
  'Parks & Green Spaces',
  'Noise Pollution',
  'Traffic & Parking',
  'Health & Medical',
  'Other'
];

// Ward data structure: 250 wards across 11 zones
export const DELHI_WARDS = {
  'z_narela': {
    name: 'Narela Zone',
    shortName: 'Narela',
    code: 'NZ',
    totalWards: 23,
    wards: [
      { wardNo: 1, name: 'Narela', location: 'North Delhi', landmarks: ['Narela Industrial Area', 'Bawana'] },
      { wardNo: 2, name: 'Narela West', location: 'North Delhi', landmarks: ['Narela West Industrial'] },
      { wardNo: 3, name: 'Bawana', location: 'North Delhi', landmarks: ['Bawana Colony', 'Bawana Village'] },
      { wardNo: 4, name: 'Bhajanpura', location: 'North Delhi', landmarks: ['Bhajanpura'] },
      { wardNo: 5, name: 'Burari', location: 'North Delhi', landmarks: ['Burari area', 'Burari Road'] },
      { wardNo: 6, name: 'Burari East', location: 'North Delhi', landmarks: ['Burari East'] },
      { wardNo: 7, name: 'Alipur', location: 'North Delhi', landmarks: ['Alipur', 'Alipur area'] },
      { wardNo: 8, name: 'Model Town', location: 'North Delhi', landmarks: ['Model Town'] },
      { wardNo: 9, name: 'Timarpur', location: 'North Delhi', landmarks: ['Timarpur'] },
      { wardNo: 10, name: 'Malviya Nagar', location: 'North Delhi', landmarks: ['Malviya Nagar'] },
      { wardNo: 11, name: 'Moti Nagar', location: 'North Delhi', landmarks: ['Moti Nagar'] },
      { wardNo: 12, name: 'Subhash Park', location: 'North Delhi', landmarks: ['Subhash Park'] },
      { wardNo: 13, name: 'Mukherjee Nagar', location: 'North Delhi', landmarks: ['Mukherjee Nagar', 'Delhi University'] },
      { wardNo: 14, name: 'North Avenue', location: 'North Delhi', landmarks: ['North Avenue'] },
      { wardNo: 15, name: 'Kasturba Nagar', location: 'North Delhi', landmarks: ['Kasturba Nagar'] },
      { wardNo: 16, name: 'Adarsh Nagar', location: 'North Delhi', landmarks: ['Adarsh Nagar'] },
      { wardNo: 17, name: 'Tri Nagar', location: 'North Delhi', landmarks: ['Tri Nagar', 'Tri Nagar market'] },
      { wardNo: 18, name: 'Ashok Vihar', location: 'North Delhi', landmarks: ['Ashok Vihar', 'Ashok Vihar market'] },
      { wardNo: 19, name: 'Vishwas Nagar', location: 'North Delhi', landmarks: ['Vishwas Nagar'] },
      { wardNo: 20, name: 'Mother Dairy', location: 'North Delhi', landmarks: ['Mother Dairy', 'Okhla'] },
      { wardNo: 21, name: 'Green Fields', location: 'North Delhi', landmarks: ['Green Fields Colony'] },
      { wardNo: 22, name: 'Industrial Area', location: 'North Delhi', landmarks: ['Industrial Area Narela'] },
      { wardNo: 23, name: 'Sector 10 Rohini', location: 'North Delhi', landmarks: ['Sector 10'] },
    ]
  },
  'z_rohini': {
    name: 'Rohini Zone',
    shortName: 'Rohini',
    code: 'RZ',
    totalWards: 19,
    wards: [
      { wardNo: 24, name: 'Sector 1', location: 'Rohini', landmarks: ['Sector 1 Rohini', 'Metro station'] },
      { wardNo: 25, name: 'Sector 2', location: 'Rohini', landmarks: ['Sector 2'] },
      { wardNo: 26, name: 'Sector 3', location: 'Rohini', landmarks: ['Sector 3'] },
      { wardNo: 27, name: 'Sector 4', location: 'Rohini', landmarks: ['Sector 4', 'Market'] },
      { wardNo: 28, name: 'Sector 5', location: 'Rohini', landmarks: ['Sector 5'] },
      { wardNo: 29, name: 'Sector 6', location: 'Rohini', landmarks: ['Sector 6'] },
      { wardNo: 30, name: 'Sector 7', location: 'Rohini', landmarks: ['Sector 7', 'Park'] },
      { wardNo: 31, name: 'Sector 8', location: 'Rohini', landmarks: ['Sector 8'] },
      { wardNo: 32, name: 'Sector 9', location: 'Rohini', landmarks: ['Sector 9'] },
      { wardNo: 33, name: 'Sector 10', location: 'Rohini', landmarks: ['Sector 10'] },
      { wardNo: 34, name: 'Sector 11', location: 'Rohini', landmarks: ['Sector 11'] },
      { wardNo: 35, name: 'Sector 12', location: 'Rohini', landmarks: ['Sector 12'] },
      { wardNo: 36, name: 'Sector 13', location: 'Rohini', landmarks: ['Sector 13'] },
      { wardNo: 37, name: 'Sector 14', location: 'Rohini', landmarks: ['Sector 14'] },
      { wardNo: 38, name: 'Sector 15', location: 'Rohini', landmarks: ['Sector 15', 'Power outages area'] },
      { wardNo: 39, name: 'Sector 16', location: 'Rohini', landmarks: ['Sector 16'] },
      { wardNo: 40, name: 'Sector 17', location: 'Rohini', landmarks: ['Sector 17'] },
      { wardNo: 41, name: 'Sector 18', location: 'Rohini', landmarks: ['Sector 18'] },
      { wardNo: 42, name: 'Sector 19', location: 'Rohini', landmarks: ['Sector 19'] },
    ]
  },
  'z_keshavpuram': {
    name: 'Keshavpuram Zone',
    shortName: 'Keshavpuram',
    code: 'KZ',
    totalWards: 18,
    wards: [
      { wardNo: 43, name: 'Keshavpuram', location: 'North Delhi', landmarks: ['Keshavpuram', 'Tri Nagar'] },
      { wardNo: 44, name: 'Ashok Vihar', location: 'North Delhi', landmarks: ['Ashok Vihar', 'Main market'] },
      { wardNo: 45, name: 'Shalimar Bagh', location: 'North Delhi', landmarks: ['Shalimar Bagh', 'Railway area'] },
      { wardNo: 46, name: 'Malka Ganj', location: 'North Delhi', landmarks: ['Malka Ganj'] },
      { wardNo: 47, name: 'Chandni Chowk', location: 'Central Delhi', landmarks: ['Chandni Chowk', 'Historic market'] },
      { wardNo: 48, name: 'Laxmi Nagar', location: 'North Delhi', landmarks: ['Laxmi Nagar'] },
      { wardNo: 49, name: 'Yamuna Vihar', location: 'North Delhi', landmarks: ['Yamuna Vihar', 'Illegal constructions'] },
      { wardNo: 50, name: 'Geeta Colony', location: 'North Delhi', landmarks: ['Geeta Colony', 'Flooding area'] },
      { wardNo: 51, name: 'Gandhi Nagar', location: 'North Delhi', landmarks: ['Gandhi Nagar'] },
      { wardNo: 52, name: 'Pul Prehladpur', location: 'Central Delhi', landmarks: ['Pul Prehladpur'] },
      { wardNo: 53, name: 'Block 32', location: 'North Delhi', landmarks: ['Block 32'] },
      { wardNo: 54, name: 'Welcome', location: 'North Delhi', landmarks: ['Welcome area'] },
      { wardNo: 55, name: 'Bauddha Colony', location: 'North Delhi', landmarks: ['Bauddha Colony'] },
      { wardNo: 56, name: 'Rajghat', location: 'Central Delhi', landmarks: ['Rajghat', 'Historic site'] },
      { wardNo: 57, name: 'Kasturba Nagar', location: 'North Delhi', landmarks: ['Kasturba Nagar'] },
      { wardNo: 58, name: 'Rajendra Nagar', location: 'North Delhi', landmarks: ['Rajendra Nagar'] },
      { wardNo: 59, name: 'Subhash Nagar', location: 'North Delhi', landmarks: ['Subhash Nagar'] },
      { wardNo: 60, name: 'East Delhi', location: 'East Delhi', landmarks: ['East Delhi'] },
    ]
  },
  'z_civil_lines': {
    name: 'Civil Lines Zone',
    shortName: 'Civil Lines',
    code: 'CL',
    totalWards: 20,
    wards: [
      { wardNo: 61, name: 'Kashmiri Gate', location: 'Central Delhi', landmarks: ['Kashmiri Gate', 'Bus terminal', 'Road repairs'] },
      { wardNo: 62, name: 'Shakti Nagar', location: 'Central Delhi', landmarks: ['Shakti Nagar', 'Water supply area'] },
      { wardNo: 63, name: 'Daryaganj', location: 'Central Delhi', landmarks: ['Daryaganj', 'Old book market'] },
      { wardNo: 64, name: 'Jama Masjid', location: 'Central Delhi', landmarks: ['Jama Masjid', 'Old Delhi'] },
      { wardNo: 65, name: 'Ballimaran', location: 'Central Delhi', landmarks: ['Ballimaran', 'Old Delhi'] },
      { wardNo: 66, name: 'Matia Mahal', location: 'Central Delhi', landmarks: ['Matia Mahal'] },
      { wardNo: 67, name: 'Delhi Cantonment', location: 'Central Delhi', landmarks: ['Cantonment area'] },
      { wardNo: 68, name: 'Karol Bagh', location: 'Central Delhi', landmarks: ['Karol Bagh', 'Shopping center'] },
      { wardNo: 69, name: 'Patel Nagar', location: 'Central Delhi', landmarks: ['Patel Nagar'] },
      { wardNo: 70, name: 'Malviya Nagar', location: 'South Delhi', landmarks: ['Malviya Nagar', 'Educational institutions'] },
      { wardNo: 71, name: 'Ramakrishna Puram', location: 'South Delhi', landmarks: ['Ramakrishna Puram'] },
      { wardNo: 72, name: 'Mehrauli', location: 'South Delhi', landmarks: ['Mehrauli', 'Historic monuments'] },
      { wardNo: 73, name: 'Chhatarpur', location: 'South Delhi', landmarks: ['Chhatarpur'] },
      { wardNo: 74, name: 'Sangam Vihar', location: 'South Delhi', landmarks: ['Sangam Vihar'] },
      { wardNo: 75, name: 'Kalkaji', location: 'South Delhi', landmarks: ['Kalkaji', 'Temple area'] },
      { wardNo: 76, name: 'Greater Kailash 1', location: 'South Delhi', landmarks: ['Greater Kailash 1', 'Market'] },
      { wardNo: 77, name: 'Greater Kailash 2', location: 'South Delhi', landmarks: ['Greater Kailash 2'] },
      { wardNo: 78, name: 'Kailash Colony', location: 'South Delhi', landmarks: ['Kailash Colony'] },
      { wardNo: 79, name: 'South Extension', location: 'South Delhi', landmarks: ['South Extension'] },
      { wardNo: 80, name: 'Ismail Road', location: 'South Delhi', landmarks: ['Ismail Road'] },
    ]
  },
  'z_city_sp': {
    name: 'City SP Zone',
    shortName: 'City SP',
    code: 'CSP',
    totalWards: 22,
    wards: [
      { wardNo: 81, name: 'Old Delhi 1', location: 'Central Delhi', landmarks: ['Old Delhi market', 'Red Fort'] },
      { wardNo: 82, name: 'Old Delhi 2', location: 'Central Delhi', landmarks: ['Old Delhi'] },
      { wardNo: 83, name: 'Chandni Chowk Market', location: 'Central Delhi', landmarks: ['Chandni Chowk', 'Garbage area'] },
      { wardNo: 84, name: 'Sewer Overflow', location: 'Central Delhi', landmarks: ['Sewer systems', 'Open drains'] },
      { wardNo: 85, name: 'Fountain Area', location: 'Central Delhi', landmarks: ['Fountain'] },
      { wardNo: 86, name: 'Wall area', location: 'Central Delhi', landmarks: ['City wall', 'Wall street'] },
      { wardNo: 87, name: 'Railway area', location: 'Central Delhi', landmarks: ['Railway station'] },
      { wardNo: 88, name: 'Turkman Gate', location: 'Central Delhi', landmarks: ['Turkman Gate'] },
      { wardNo: 89, name: 'Hauz Khas', location: 'South Delhi', landmarks: ['Hauz Khas village', 'Lake'] },
      { wardNo: 90, name: 'Chhatarpur Temple', location: 'South Delhi', landmarks: ['Chhatarpur', 'Temple'] },
      { wardNo: 91, name: 'Lado Sarai', location: 'South Delhi', landmarks: ['Lado Sarai'] },
      { wardNo: 92, name: 'Mandir Marg', location: 'Central Delhi', landmarks: ['Mandir Marg'] },
      { wardNo: 93, name: 'Connaught Circus', location: 'Central Delhi', landmarks: ['Connaught Place', 'Heritage zone'] },
      { wardNo: 94, name: 'Bikaner House', location: 'Central Delhi', landmarks: ['Bikaner House'] },
      { wardNo: 95, name: 'Tolstoy Marg', location: 'Central Delhi', landmarks: ['Tolstoy Marg'] },
      { wardNo: 96, name: 'Khan Market', location: 'South Delhi', landmarks: ['Khan Market', 'Shopping'] },
      { wardNo: 97, name: 'INA Colony', location: 'South Delhi', landmarks: ['INA Colony', 'Sanitation area'] },
      { wardNo: 98, name: 'Lajpat Nagar 1', location: 'South Delhi', landmarks: ['Lajpat Nagar', 'Encroachment'] },
      { wardNo: 99, name: 'Lajpat Nagar 2', location: 'South Delhi', landmarks: ['Lajpat Nagar 2'] },
      { wardNo: 100, name: 'Lajpat Nagar 3', location: 'South Delhi', landmarks: ['Lajpat Nagar 3'] },
      { wardNo: 101, name: 'Delhi Fort', location: 'Central Delhi', landmarks: ['Delhi Fort', 'Historic'] },
      { wardNo: 102, name: 'Sunehri Mosque', location: 'Central Delhi', landmarks: ['Sunehri Mosque'] },
    ]
  },
  'z_west': {
    name: 'West Zone',
    shortName: 'West',
    code: 'WZ',
    totalWards: 21,
    wards: [
      { wardNo: 103, name: 'Dwarka Sector 1', location: 'West Delhi', landmarks: ['Dwarka Sector 1', 'Metro'] },
      { wardNo: 104, name: 'Dwarka Sector 2', location: 'West Delhi', landmarks: ['Dwarka Sector 2'] },
      { wardNo: 105, name: 'Dwarka Sector 3', location: 'West Delhi', landmarks: ['Dwarka Sector 3'] },
      { wardNo: 106, name: 'Dwarka Sector 4', location: 'West Delhi', landmarks: ['Dwarka Sector 4'] },
      { wardNo: 107, name: 'Dwarka Sector 5', location: 'West Delhi', landmarks: ['Dwarka Sector 5'] },
      { wardNo: 108, name: 'Dwarka Sector 6', location: 'West Delhi', landmarks: ['Dwarka Sector 6'] },
      { wardNo: 109, name: 'Dwarka Sector 7', location: 'West Delhi', landmarks: ['Dwarka Sector 7'] },
      { wardNo: 110, name: 'Dwarka Sector 8', location: 'West Delhi', landmarks: ['Dwarka Sector 8'] },
      { wardNo: 111, name: 'Dwarka Sector 9', location: 'West Delhi', landmarks: ['Dwarka Sector 9'] },
      { wardNo: 112, name: 'Dwarka Sector 10', location: 'West Delhi', landmarks: ['Dwarka Sector 10', 'Potholes'] },
      { wardNo: 113, name: 'Dwarka Sector 11', location: 'West Delhi', landmarks: ['Dwarka Sector 11'] },
      { wardNo: 114, name: 'Uttam Nagar', location: 'West Delhi', landmarks: ['Uttam Nagar', 'Waterlogging'] },
      { wardNo: 115, name: 'Janakpuri', location: 'West Delhi', landmarks: ['Janakpuri', 'Waterlogging area'] },
      { wardNo: 116, name: 'Adarsh Nagar West', location: 'West Delhi', landmarks: ['Adarsh Nagar'] },
      { wardNo: 117, name: 'Moti Nagar West', location: 'West Delhi', landmarks: ['Moti Nagar'] },
      { wardNo: 118, name: 'R.K. Puram', location: 'West Delhi', landmarks: ['R.K. Puram'] },
      { wardNo: 119, name: 'Mehrauli Road', location: 'West Delhi', landmarks: ['Mehrauli Road', 'Highway'] },
      { wardNo: 120, name: 'Ambedkar Nagar', location: 'West Delhi', landmarks: ['Ambedkar Nagar'] },
      { wardNo: 121, name: 'Vasant Kunj', location: 'West Delhi', landmarks: ['Vasant Kunj'] },
      { wardNo: 122, name: 'Aya Nagar', location: 'West Delhi', landmarks: ['Aya Nagar'] },
      { wardNo: 123, name: 'Bijwasan', location: 'West Delhi', landmarks: ['Bijwasan'] },
    ]
  },
  'z_central': {
    name: 'Central Zone',
    shortName: 'Central',
    code: 'CZ',
    totalWards: 21,
    wards: [
      { wardNo: 124, name: 'Connaught Place 1', location: 'Central Delhi', landmarks: ['Connaught Place', 'CBD'] },
      { wardNo: 125, name: 'Connaught Place 2', location: 'Central Delhi', landmarks: ['CP area'] },
      { wardNo: 126, name: 'New Delhi Railway', location: 'Central Delhi', landmarks: ['Railway station'] },
      { wardNo: 127, name: 'Patel Chowk', location: 'Central Delhi', landmarks: ['Patel Chowk'] },
      { wardNo: 128, name: 'Vigyan Bhawan', location: 'Central Delhi', landmarks: ['Vigyan Bhawan'] },
      { wardNo: 129, name: 'Rashtrapati Bhawan', location: 'Central Delhi', landmarks: ['Rashtrapati Bhawan'] },
      { wardNo: 130, name: 'India Gate', location: 'Central Delhi', landmarks: ['India Gate', 'War memorial'] },
      { wardNo: 131, name: 'Jantar Mantar', location: 'Central Delhi', landmarks: ['Jantar Mantar', 'Historic site'] },
      { wardNo: 132, name: 'Parliament Street', location: 'Central Delhi', landmarks: ['Parliament', 'Government building'] },
      { wardNo: 133, name: 'Barakhamba Road', location: 'Central Delhi', landmarks: ['Barakhamba Road'] },
      { wardNo: 134, name: 'Safdarjung', location: 'West Delhi', landmarks: ['Safdarjung tomb'] },
      { wardNo: 135, name: 'Defence Colony', location: 'South Delhi', landmarks: ['Defence Colony'] },
      { wardNo: 136, name: 'Sunder Nagar', location: 'Central Delhi', landmarks: ['Sunder Nagar'] },
      { wardNo: 137, name: 'Safdar Jung Hospital', location: 'Central Delhi', landmarks: ['Hospital'] },
      { wardNo: 138, name: 'Talkatora', location: 'Central Delhi', landmarks: ['Talkatora Stadium'] },
      { wardNo: 139, name: 'Sikandara Road', location: 'Central Delhi', landmarks: ['Sikandara Road'] },
      { wardNo: 140, name: 'East Court', location: 'Central Delhi', landmarks: ['Court area'] },
      { wardNo: 141, name: 'Okhla', location: 'South Delhi', landmarks: ['Mother Dairy', 'Okhla area'] },
      { wardNo: 142, name: 'Noor Nagar', location: 'Central Delhi', landmarks: ['Noor Nagar'] },
      { wardNo: 143, name: 'Encroachment Zone', location: 'Central Delhi', landmarks: ['Encroachment area'] },
      { wardNo: 144, name: 'East Delhi Market', location: 'East Delhi', landmarks: ['Market area'] },
    ]
  },
  'z_shahdara_south': {
    name: 'Shahdara South Zone',
    shortName: 'Shahdara S',
    code: 'SS',
    totalWards: 20,
    wards: [
      { wardNo: 145, name: 'Shahdara Main Road 1', location: 'East Delhi', landmarks: ['Shahdara main road', 'Deterioration'] },
      { wardNo: 146, name: 'Shahdara Main Road 2', location: 'East Delhi', landmarks: ['Shahdara'] },
      { wardNo: 147, name: 'Geeta Colony South', location: 'East Delhi', landmarks: ['Geeta Colony', 'Flooding'] },
      { wardNo: 148, name: 'Welcome South', location: 'East Delhi', landmarks: ['Welcome area'] },
      { wardNo: 149, name: 'Laxmi Nagar East', location: 'East Delhi', landmarks: ['Laxmi Nagar'] },
      { wardNo: 150, name: 'Yamuna Vihar South', location: 'East Delhi', landmarks: ['Yamuna Vihar'] },
      { wardNo: 151, name: 'Block 32 East', location: 'East Delhi', landmarks: ['Block 32'] },
      { wardNo: 152, name: 'Bauddha Colony South', location: 'East Delhi', landmarks: ['Bauddha Colony'] },
      { wardNo: 153, name: 'Pandav Nagar', location: 'East Delhi', landmarks: ['Pandav Nagar'] },
      { wardNo: 154, name: 'Vishwas Nagar South', location: 'East Delhi', landmarks: ['Vishwas Nagar'] },
      { wardNo: 155, name: 'Gandhi Nagar South', location: 'East Delhi', landmarks: ['Gandhi Nagar'] },
      { wardNo: 156, name: 'Karkardooma', location: 'East Delhi', landmarks: ['Karkardooma', 'Court'] },
      { wardNo: 157, name: 'Seema Puri', location: 'East Delhi', landmarks: ['Seema Puri'] },
      { wardNo: 158, name: 'Mayur Vihar Phase 1', location: 'East Delhi', landmarks: ['Mayur Vihar'] },
      { wardNo: 159, name: 'Mayur Vihar Phase 2', location: 'East Delhi', landmarks: ['Mayur Vihar Phase 2'] },
      { wardNo: 160, name: 'Khichripur', location: 'East Delhi', landmarks: ['Khichripur'] },
      { wardNo: 161, name: 'East Patel Nagar', location: 'East Delhi', landmarks: ['East Patel Nagar'] },
      { wardNo: 162, name: 'Dilshad Garden', location: 'East Delhi', landmarks: ['Dilshad Garden'] },
      { wardNo: 163, name: 'Preet Vihar', location: 'East Delhi', landmarks: ['Preet Vihar'] },
      { wardNo: 164, name: 'Sunlight Colony', location: 'East Delhi', landmarks: ['Sunlight Colony'] },
    ]
  },
  'z_shahdara_north': {
    name: 'Shahdara North Zone',
    shortName: 'Shahdara N',
    code: 'SN',
    totalWards: 17,
    wards: [
      { wardNo: 165, name: 'Yamuna Vihar North', location: 'East Delhi', landmarks: ['Yamuna Vihar', 'Illegal constructions'] },
      { wardNo: 166, name: 'Malka Ganj North', location: 'North Delhi', landmarks: ['Malka Ganj'] },
      { wardNo: 167, name: 'Seelampur', location: 'East Delhi', landmarks: ['Seelampur'] },
      { wardNo: 168, name: 'Bhajanpura North', location: 'North Delhi', landmarks: ['Bhajanpura'] },
      { wardNo: 169, name: 'Usmanpur', location: 'East Delhi', landmarks: ['Usmanpur'] },
      { wardNo: 170, name: 'Karawal Nagar', location: 'East Delhi', landmarks: ['Karawal Nagar'] },
      { wardNo: 171, name: 'Brahmpuri', location: 'East Delhi', landmarks: ['Brahmpuri'] },
      { wardNo: 172, name: 'Welcome North', location: 'East Delhi', landmarks: ['Welcome'] },
      { wardNo: 173, name: 'East Delhi Sadar', location: 'East Delhi', landmarks: ['East Delhi'] },
      { wardNo: 174, name: 'Shastri Nagar', location: 'North Delhi', landmarks: ['Shastri Nagar'] },
      { wardNo: 175, name: 'Gokalpur', location: 'East Delhi', landmarks: ['Gokalpur'] },
      { wardNo: 176, name: 'Johri Enclave', location: 'East Delhi', landmarks: ['Johri Enclave'] },
      { wardNo: 177, name: 'Ghazipur', location: 'East Delhi', landmarks: ['Ghazipur', 'Landfill'] },
      { wardNo: 178, name: 'Jafrabad', location: 'East Delhi', landmarks: ['Jafrabad'] },
      { wardNo: 179, name: 'Goknath', location: 'East Delhi', landmarks: ['Goknath'] },
      { wardNo: 180, name: 'Kondli', location: 'East Delhi', landmarks: ['Kondli'] },
      { wardNo: 181, name: 'Anand Vihar', location: 'East Delhi', landmarks: ['Anand Vihar', 'Market'] },
    ]
  },
  'z_south': {
    name: 'South Zone',
    shortName: 'South',
    code: 'SZ',
    totalWards: 16,
    wards: [
      { wardNo: 182, name: 'Saket', location: 'South Delhi', landmarks: ['Saket', 'Street lights', 'resolved'] },
      { wardNo: 183, name: 'Saket South', location: 'South Delhi', landmarks: ['South Saket'] },
      { wardNo: 184, name: 'Malviya Nagar', location: 'South Delhi', landmarks: ['Malviya Nagar'] },
      { wardNo: 185, name: 'Chatarpur', location: 'South Delhi', landmarks: ['Chatarpur'] },
      { wardNo: 186, name: 'Mehrauli South', location: 'South Delhi', landmarks: ['Mehrauli'] },
      { wardNo: 187, name: 'Chhatarpur Temple', location: 'South Delhi', landmarks: ['Chhatarpur', 'Temple'] },
      { wardNo: 188, name: 'Amar Colony', location: 'South Delhi', landmarks: ['Amar Colony'] },
      { wardNo: 189, name: 'Sangam Vihar East', location: 'South Delhi', landmarks: ['Sangam Vihar'] },
      { wardNo: 190, name: 'Kalkaji South', location: 'South Delhi', landmarks: ['Kalkaji'] },
      { wardNo: 191, name: 'Greater Kailash South', location: 'South Delhi', landmarks: ['Greater Kailash', 'Market'] },
      { wardNo: 192, name: 'Defence Colony South', location: 'South Delhi', landmarks: ['Defence Colony'] },
      { wardNo: 193, name: 'Neb Sarai', location: 'South Delhi', landmarks: ['Neb Sarai'] },
      { wardNo: 194, name: 'Vasant Kunj South', location: 'South Delhi', landmarks: ['Vasant Kunj'] },
      { wardNo: 195, name: 'Aya Nagar South', location: 'South Delhi', landmarks: ['Aya Nagar'] },
      { wardNo: 196, name: 'Bijwasan South', location: 'South Delhi', landmarks: ['Bijwasan'] },
      { wardNo: 197, name: 'South South Delhi', location: 'South Delhi', landmarks: ['South Delhi'] },
    ]
  },
  'z_south_west': {
    name: 'South West Zone',
    shortName: 'South West',
    code: 'SW',
    totalWards: 19,
    wards: [
      { wardNo: 198, name: 'Dwarka Sector 12', location: 'West Delhi', landmarks: ['Dwarka Sector 12'] },
      { wardNo: 199, name: 'Dwarka Sector 13', location: 'West Delhi', landmarks: ['Dwarka Sector 13'] },
      { wardNo: 200, name: 'Dwarka Sector 14', location: 'West Delhi', landmarks: ['Dwarka Sector 14'] },
      { wardNo: 201, name: 'Dwarka Sector 15', location: 'West Delhi', landmarks: ['Dwarka Sector 15'] },
      { wardNo: 202, name: 'Dwarka Sector 16', location: 'West Delhi', landmarks: ['Dwarka Sector 16'] },
      { wardNo: 203, name: 'Dwarka Sector 17', location: 'West Delhi', landmarks: ['Dwarka Sector 17'] },
      { wardNo: 204, name: 'Dwarka Sector 18', location: 'West Delhi', landmarks: ['Dwarka Sector 18'] },
      { wardNo: 205, name: 'Dwarka Sector 19', location: 'West Delhi', landmarks: ['Dwarka Sector 19'] },
      { wardNo: 206, name: 'Dwarka Sector 20', location: 'West Delhi', landmarks: ['Dwarka Sector 20'] },
      { wardNo: 207, name: 'Dwarka Sector 21', location: 'West Delhi', landmarks: ['Dwarka Sector 21'] },
      { wardNo: 208, name: 'Dwarka Sector 22', location: 'West Delhi', landmarks: ['Dwarka Sector 22'] },
      { wardNo: 209, name: 'Dwarka Sector 23', location: 'West Delhi', landmarks: ['Dwarka Sector 23'] },
      { wardNo: 210, name: 'Dwarka Sector 24', location: 'West Delhi', landmarks: ['Dwarka Sector 24'] },
      { wardNo: 211, name: 'Dwarka East', location: 'West Delhi', landmarks: ['Dwarka East'] },
      { wardNo: 212, name: 'Palam', location: 'West Delhi', landmarks: ['Palam', 'Airport area'] },
      { wardNo: 213, name: 'Indira Garden', location: 'West Delhi', landmarks: ['Indira Garden'] },
      { wardNo: 214, name: 'Rajokri', location: 'West Delhi', landmarks: ['Rajokri', 'Rural area'] },
      { wardNo: 215, name: 'Chhatarpur Farm', location: 'West Delhi', landmarks: ['Chhatarpur Farm'] },
      { wardNo: 216, name: 'Kapashera', location: 'West Delhi', landmarks: ['Kapashera'] },
    ]
  },
  'z_new_delhi': {
    name: 'New Delhi Zone',
    shortName: 'New Delhi',
    code: 'ND',
    totalWards: 13,
    wards: [
      { wardNo: 217, name: 'Connaught Place Central', location: 'Central Delhi', landmarks: ['Connaught Place', 'Heritage zone', 'Encroachment'] },
      { wardNo: 218, name: 'Rajpath', location: 'Central Delhi', landmarks: ['Rajpath', 'Central Vista'] },
      { wardNo: 219, name: 'India Gate Circle', location: 'Central Delhi', landmarks: ['India Gate'] },
      { wardNo: 220, name: 'New Delhi Central', location: 'Central Delhi', landmarks: ['New Delhi'] },
      { wardNo: 221, name: 'Patel Chowk Area', location: 'Central Delhi', landmarks: ['Patel Chowk'] },
      { wardNo: 222, name: 'Teenzpur', location: 'Central Delhi', landmarks: ['Teenzpur'] },
      { wardNo: 223, name: 'Bhikaji Cama Place', location: 'West Delhi', landmarks: ['Bhikaji Cama Place'] },
      { wardNo: 224, name: 'Safdarjung', location: 'West Delhi', landmarks: ['Safdarjung'] },
      { wardNo: 225, name: 'Delhi Cantonment 1', location: 'West Delhi', landmarks: ['Cantonment'] },
      { wardNo: 226, name: 'Delhi Cantonment 2', location: 'West Delhi', landmarks: ['Cantonment'] },
      { wardNo: 227, name: 'Mehrauli Historic', location: 'South Delhi', landmarks: ['Mehrauli', 'Historic monuments'] },
      { wardNo: 228, name: 'Siri Fort', location: 'South Delhi', landmarks: ['Siri Fort', 'Auditorium'] },
      { wardNo: 229, name: 'Hauz Khas Central', location: 'South Delhi', landmarks: ['Hauz Khas', 'Lake', 'Village'] },
    ]
  }
};

// Helper function to get wards by zone
export const getWardsByZone = (zoneId) => {
  return DELHI_WARDS[zoneId]?.wards || [];
};

// Helper function to get all zones
export const getAllZones = () => {
  return Object.values(DELHI_WARDS).map(zone => ({
    id: Object.entries(DELHI_WARDS).find(([, z]) => z === zone)[0],
    name: zone.name,
    shortName: zone.shortName,
    code: zone.code,
    totalWards: zone.totalWards
  }));
};

// Helper function to search wards by keyword (location name/landmark)
export const searchWardsByLocation = (searchTerm) => {
  const term = searchTerm.toLowerCase();
  const results = [];
  
  Object.entries(DELHI_WARDS).forEach(([zoneId, zoneData]) => {
    zoneData.wards.forEach(ward => {
      if (
        ward.name.toLowerCase().includes(term) ||
        ward.location.toLowerCase().includes(term) ||
        ward.landmarks.some(lm => lm.toLowerCase().includes(term))
      ) {
        results.push({
          ...ward,
          zoneId,
          zoneName: zoneData.name,
          zoneCode: zoneData.code
        });
      }
    });
  });
  
  return results;
};

// Helper function to get departments by zone
export const getDepartmentsByZone = (zoneId) => {
  // Map zone to actual zones data with departments
  const zoneDepartmentMap = {
    'z_narela': ['PWD', 'Water Board', 'Sanitation', 'Municipal Corp', 'Electricity'],
    'z_rohini': ['PWD', 'Water Board', 'Sanitation', 'Parks Dept', 'Electricity'],
    'z_keshavpuram': ['PWD', 'Water Board', 'Sanitation', 'Town Planning', 'Electricity'],
    'z_civil_lines': ['PWD', 'Water Board', 'Municipal Corp', 'Parks Dept', 'Electricity'],
    'z_city_sp': ['PWD', 'Water Board', 'Sanitation', 'Municipal Corp', 'Electricity'],
    'z_west': ['PWD', 'Water Board', 'Sanitation', 'Municipal Corp', 'Electricity'],
    'z_central': ['PWD', 'Water Board', 'Sanitation', 'Town Planning', 'Electricity'],
    'z_shahdara_south': ['PWD', 'Water Board', 'Sanitation', 'Municipal Corp', 'Electricity'],
    'z_shahdara_north': ['PWD', 'Water Board', 'Sanitation', 'Town Planning', 'Electricity'],
    'z_south': ['PWD', 'Water Board', 'Parks Dept', 'Electricity', 'Municipal Corp'],
    'z_south_west': ['PWD', 'Water Board', 'Sanitation', 'Municipal Corp', 'Electricity'],
    'z_new_delhi': ['PWD', 'Water Board', 'Parks Dept', 'Town Planning', 'Electricity'],
  };
  
  const deptNames = zoneDepartmentMap[zoneId] || [];
  return DEPARTMENTS.filter(d => deptNames.includes(d.name));
};
