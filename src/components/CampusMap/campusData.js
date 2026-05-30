// ─── KGISL Campus Data ───────────────────────────────────────────────────────
// Coordinate system: direct SVG [x, y] pixels, viewBox "0 0 855 1079"
// Node IDs match exactly the numbers printed on the campus map image.
// Nodes 2, 9, 17, 23–26 are not labeled on the map and are omitted.

export const landmarks = [
  { id: 1,  name: 'Main Entrance Gate',        position: [430, 920],  category: 'entry',    description: 'Primary entry/exit point from Thudiyalur–Saravanampatti Road' },
  { id: 3,  name: 'KGISL',                     position: [448, 795],  category: 'academic', description: 'Main KGISL institution building' },
  { id: 4,  name: 'KGISL Parking',             position: [306, 472],  category: 'facility', description: 'Multiple parking zones across campus' },
  { id: 5,  name: 'Kite Academic Block & Lab', position: [340, 555],  category: 'academic', description: 'Academic classrooms and laboratory spaces' },
  { id: 6,  name: 'IT Tower',                  position: [362, 645],  category: 'academic', description: 'IT department tower building' },
  { id: 7,  name: 'Kite Cafeteria',            position: [415, 625],  category: 'facility', description: 'Student cafeteria and food court' },
  { id: 8,  name: 'Kite Gym & Volley Ball',    position: [492, 535],  category: 'facility', description: 'Gymnasium and volleyball courts' },
  { id: 10, name: 'GSS',                       position: [600, 510],  category: 'facility', description: 'General support services' },
  { id: 11, name: 'Health Science',            position: [645, 302],  category: 'medical',  description: 'Health sciences department' },
  { id: 12, name: 'Nursing College',           position: [714, 575],  category: 'academic', description: 'Nursing college building with garden' },
  { id: 13, name: 'Nursing Hostel',            position: [525, 297],  category: 'hostel',   description: 'Hostel for nursing college students' },
  { id: 14, name: 'Boys Hostel (NMH)',         position: [372, 347],  category: 'hostel',   description: 'Boys hostel – NMH block' },
  { id: 15, name: 'Open Auditorium',           position: [200, 458],  category: 'facility', description: 'Open-air auditorium for events' },
  { id: 16, name: 'Facilities Building',       position: [555, 458],  category: 'facility', description: 'Central facilities and support building' },
  { id: 18, name: 'Pump Room',                 position: [495, 638],  category: 'facility', description: 'Water pump station' },
  { id: 19, name: 'STP Area',                  position: [175, 258],  category: 'facility', description: 'Sewage treatment plant area (blue structure)' },
  { id: 20, name: 'Canteen Block',             position: [435, 157],  category: 'facility', description: 'Top campus canteen/block building' },
  { id: 21, name: 'Parking Shed',              position: [278, 102],  category: 'facility', description: 'Covered parking shed (upper campus)' },
  { id: 22, name: 'Ground',                    position: [313, 222],  category: 'facility', description: 'Sports ground / open ground area' },
  { id: 27, name: 'Transformer',               position: [548, 778],  category: 'facility', description: 'Electrical transformer and power supply' },
  { id: 28, name: 'Guest House',               position: [328, 745],  category: 'facility', description: 'Guest accommodation' },
  { id: 29, name: 'Ladies Hostel',             position: [328, 800],  category: 'hostel',   description: 'Ladies hostel block' },
  { id: 30, name: 'Dining Hall',               position: [305, 858],  category: 'facility', description: 'Main student dining hall' },
  { id: 31, name: 'Kitchen',                   position: [358, 858],  category: 'facility', description: 'Campus kitchen facility' },
  { id: 32, name: 'Main Drinking Water Tank',  position: [568, 752],  category: 'facility', description: 'Primary campus water supply tank' },
  { id: 33, name: 'EB Room',                   position: [722, 595],  category: 'facility', description: 'Electricity board room' },
  { id: 34, name: 'Space for KG Design',       position: [548, 838],  category: 'facility', description: 'Reserved space for KG design project' },
];

// ─── Road Network Nodes ───────────────────────────────────────────────────────
// Internal routing waypoints along campus roads.
// Positions are SVG [x, y] coordinates matching the viewBox "0 0 855 1079".
export const roadNodes = [
  { id: 'R1',  position: [430, 952] },  // Entrance road (bottom)
  { id: 'R2',  position: [430, 880] },  // Near flag / entrance gate
  { id: 'R3',  position: [430, 810] },  // Near KGISL main building
  { id: 'R4',  position: [430, 730] },  // Central main junction
  { id: 'R5',  position: [338, 730] },  // Left branch – toward dining/hostel
  { id: 'R6',  position: [560, 730] },  // Right branch – toward transformer
  { id: 'R7',  position: [430, 665] },  // Upper-central junction
  { id: 'R8',  position: [340, 620] },  // Left – IT Tower / Kite block
  { id: 'R9',  position: [500, 660] },  // Right – pump room / cafeteria
  { id: 'R10', position: [430, 575] },  // Middle junction
  { id: 'R11', position: [310, 535] },  // Left – auditorium branch
  { id: 'R12', position: [555, 535] },  // Right – facilities / GSS
  { id: 'R13', position: [430, 455] },  // Upper junction
  { id: 'R14', position: [310, 420] },  // Boys hostel road
  { id: 'R15', position: [555, 420] },  // East road upper
  { id: 'R16', position: [430, 360] },  // North junction
  { id: 'R17', position: [540, 360] },  // Toward nursing hostel
  { id: 'R18', position: [430, 265] },  // Far north road
  { id: 'R19', position: [437, 185] },  // Top road
  { id: 'R20', position: [640, 360] },  // East road – health science
  { id: 'R21', position: [640, 500] },  // East road – GSS / nursing college
  { id: 'R22', position: [640, 650] },  // East road lower
  { id: 'R23', position: [205, 535] },  // Left road – auditorium area
];

// ─── Road Edges ───────────────────────────────────────────────────────────────
export const roadEdges = [
  { from: 'R1',  to: 'R2',  width: 8, distance: 72  },
  { from: 'R2',  to: 'R3',  width: 8, distance: 70  },
  { from: 'R3',  to: 'R4',  width: 8, distance: 80  },
  { from: 'R4',  to: 'R5',  width: 8, distance: 92  },
  { from: 'R4',  to: 'R6',  width: 8, distance: 130 },
  { from: 'R4',  to: 'R7',  width: 8, distance: 65  },
  { from: 'R7',  to: 'R8',  width: 8, distance: 90  },
  { from: 'R7',  to: 'R9',  width: 8, distance: 70  },
  { from: 'R7',  to: 'R10', width: 8, distance: 90  },
  { from: 'R10', to: 'R11', width: 8, distance: 120 },
  { from: 'R10', to: 'R12', width: 8, distance: 125 },
  { from: 'R10', to: 'R13', width: 8, distance: 120 },
  { from: 'R11', to: 'R23', width: 8, distance: 105 },
  { from: 'R13', to: 'R14', width: 8, distance: 120 },
  { from: 'R13', to: 'R15', width: 8, distance: 125 },
  { from: 'R13', to: 'R16', width: 8, distance: 95  },
  { from: 'R15', to: 'R20', width: 8, distance: 90  },
  { from: 'R16', to: 'R17', width: 8, distance: 110 },
  { from: 'R16', to: 'R18', width: 8, distance: 95  },
  { from: 'R18', to: 'R19', width: 8, distance: 80  },
  { from: 'R20', to: 'R21', width: 8, distance: 140 },
  { from: 'R21', to: 'R22', width: 8, distance: 150 },
  { from: 'R5',  to: 'R8',  width: 8, distance: 110 },
  { from: 'R6',  to: 'R9',  width: 8, distance: 70  },
  { from: 'R12', to: 'R21', width: 8, distance: 110 },
  { from: 'R17', to: 'R20', width: 8, distance: 100 },
];

// ─── Category Colours ─────────────────────────────────────────────────────────
export const categoryColors = {
  academic: '#1D3557',
  hostel:   '#457B9D',
  facility: '#F4A261',
  admin:    '#E63946',
  medical:  '#2A9D8F',
  entry:    '#264653',
};
