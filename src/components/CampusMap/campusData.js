// ─── KGISL Campus Data ───────────────────────────────────────────────────────
// Coordinates calibrated via Node Editor (campusNodes.json).
// viewBox "0 0 855 1079" — direct SVG [x, y] pixel coordinates.
// Route graph is landmark-to-landmark (no abstract road nodes).

export const landmarks = [
  { id: 1,  name: 'Main Entrance Gate',        position: [467, 937], category: 'entry',    description: 'Primary entry/exit point from Thudiyalur–Saravanampatti Road' },
  { id: 3,  name: 'KGISL',                     position: [468, 825], category: 'academic', description: 'Main KGISL institution building' },
  { id: 4,  name: 'KGISL Parking 2',           position: [373, 475], category: 'facility', description: 'Multiple parking zones across campus' },
  { id: 5,  name: 'Kite Academic Block & Lab', position: [368, 552], category: 'academic', description: 'Academic classrooms and laboratory spaces' },
  { id: 6,  name: 'IT Tower',                  position: [379, 656], category: 'academic', description: 'IT department tower building' },
  { id: 7,  name: 'Kite Cafeteria',            position: [560, 628], category: 'facility', description: 'Student cafeteria and food court' },
  { id: 8,  name: 'Kite Gym & Volley Ball',    position: [561, 554], category: 'facility', description: 'Gymnasium and volleyball courts' },
  { id: 10, name: 'GSS',                       position: [613, 536], category: 'facility', description: 'General support services' },
  { id: 11, name: 'Health Science',            position: [634, 295], category: 'medical',  description: 'Health sciences department' },
  { id: 12, name: 'Nursing College',           position: [705, 612], category: 'academic', description: 'Nursing college building with garden' },
  { id: 13, name: 'Nursing Hostel',            position: [551, 290], category: 'hostel',   description: 'Hostel for nursing college students' },
  { id: 14, name: 'Boys Hostel (NMH)',         position: [366, 375], category: 'hostel',   description: 'Boys hostel – NMH block' },
  { id: 15, name: 'Open Auditorium',           position: [219, 460], category: 'facility', description: 'Open-air auditorium for events' },
  { id: 16, name: 'Facilities Building',       position: [570, 477], category: 'facility', description: 'Central facilities and support building' },
  { id: 18, name: 'Pump Room',                 position: [603, 646], category: 'facility', description: 'Water pump station' },
  { id: 19, name: 'STP Area',                  position: [227, 241], category: 'facility', description: 'Sewage treatment plant area (blue structure)' },
  { id: 20, name: 'Canteen Block',             position: [437, 181], category: 'facility', description: 'Top campus canteen/block building' },
  { id: 21, name: 'Parking Shed',              position: [276, 117], category: 'facility', description: 'Covered parking shed (upper campus)' },
  { id: 22, name: 'Ground',                    position: [337, 248], category: 'facility', description: 'Sports ground / open ground area' },
  { id: 27, name: 'Transformer',               position: [556, 804], category: 'facility', description: 'Electrical transformer and power supply' },
  { id: 28, name: 'Guest House',               position: [352, 777], category: 'facility', description: 'Guest accommodation' },
  { id: 29, name: 'Ladies Hostel',             position: [339, 813], category: 'hostel',   description: 'Ladies hostel block' },
  { id: 30, name: 'Dining Hall',               position: [336, 869], category: 'facility', description: 'Main student dining hall' },
  { id: 31, name: 'Kitchen',                   position: [378, 871], category: 'facility', description: 'Campus kitchen facility' },
  { id: 32, name: 'Main Drinking Water Tank',  position: [651, 759], category: 'facility', description: 'Primary campus water supply tank' },
  { id: 33, name: 'EB Room',                   position: [799, 636], category: 'facility', description: 'Electricity board room' },
  { id: 34, name: 'Space for KG Design',       position: [656, 840], category: 'facility', description: 'Reserved space for KG design project' },
  { id: 35, name: 'Central Junction',          position: [371, 724], category: 'facility', description: 'Central road junction point' },
  { id: 36, name: 'Water Tank 2',              position: [781, 700], category: 'facility', description: 'Secondary campus water supply tank' },
  { id: 37, name: 'Entrance Gate 2',           position: [411, 957], category: 'entry',    description: 'Secondary entrance gate' },
  { id: 39, name: 'Ground 2',                  position: [229, 290], category: 'facility', description: 'Sports ground area 2' },
];

// ─── Landmark-to-Landmark Walking Graph ───────────────────────────────────────
// Distances in metres (pixel distance × ~0.85 road-curve factor).
// Each edge has a human-readable road/path name used in navigation instructions.
export const landmarkEdges = [
  // ── Main entrance spine ────────────────────────────────────────
  { from: 37, to: 1,  distance: 22,  label: 'Entrance Road'          },
  { from: 3,  to: 37, distance: 120, label: 'Main Gate Road'         },
  { from: 3,  to: 27, distance: 78,  label: 'East Internal Road'     },
  { from: 3,  to: 35, distance: 102, label: 'West Internal Road'     },

  // ── Hostel & dining cluster ────────────────────────────────────
  { from: 35, to: 28, distance: 48,  label: 'Guest House Path'       },
  { from: 28, to: 29, distance: 32,  label: 'Ladies Hostel Lane'     },
  { from: 29, to: 30, distance: 48,  label: 'Dining Hall Road'       },
  { from: 30, to: 31, distance: 36,  label: 'Kitchen Lane'           },
  { from: 1,  to: 30, distance: 62,  label: 'Gate–Dining Path'       },
  { from: 1,  to: 31, distance: 62,  label: 'Gate–Kitchen Path'      },

  // ── West academic spine ────────────────────────────────────────
  { from: 35, to: 6,  distance: 58,  label: 'IT Tower Road'          },
  { from: 6,  to: 5,  distance: 89,  label: 'Kite Academic Road'     },
  { from: 5,  to: 4,  distance: 66,  label: 'Parking Access Road'    },
  { from: 4,  to: 14, distance: 85,  label: 'Boys Hostel Road'       },
  { from: 4,  to: 15, distance: 130, label: 'Auditorium Road'        },
  { from: 14, to: 15, distance: 145, label: 'Hostel–Auditorium Path' },

  // ── Upper campus ──────────────────────────────────────────────
  { from: 14, to: 22, distance: 110, label: 'Ground Road'            },
  { from: 22, to: 20, distance: 103, label: 'Canteen Block Road'     },
  { from: 20, to: 21, distance: 148, label: 'Parking Shed Road'      },
  { from: 19, to: 21, distance: 113, label: 'Upper Perimeter Road'   },
  { from: 19, to: 22, distance: 93,  label: 'STP–Ground Link'        },
  { from: 39, to: 22, distance: 98,  label: 'Ground 2 Path'          },
  { from: 39, to: 19, distance: 42,  label: 'STP Access Road'        },
  { from: 13, to: 11, distance: 71,  label: 'Health Road'            },
  { from: 13, to: 14, distance: 172, label: 'Hostel Cross Road'      },
  { from: 13, to: 22, distance: 210, label: 'Nursing–Ground Road'    },
  { from: 11, to: 20, distance: 200, label: 'Health–Canteen Road'    },

  // ── Central cafeteria cluster ──────────────────────────────────
  { from: 6,  to: 7,  distance: 155, label: 'Cafeteria Access Road'  },
  { from: 7,  to: 18, distance: 40,  label: 'Pump Room Lane'         },
  { from: 7,  to: 8,  distance: 63,  label: 'Gym Road'               },
  { from: 8,  to: 16, distance: 66,  label: 'Facilities Road'        },
  { from: 16, to: 10, distance: 62,  label: 'GSS Access Road'        },
  { from: 10, to: 8,  distance: 55,  label: 'Gym–GSS Path'           },

  // ── East campus ───────────────────────────────────────────────
  { from: 18, to: 12, distance: 91,  label: 'Nursing College Road'   },
  { from: 12, to: 33, distance: 83,  label: 'EB Room Road'           },
  { from: 33, to: 36, distance: 56,  label: 'Water Tank Road'        },
  { from: 36, to: 32, distance: 121, label: 'Main Tank Road'         },
  { from: 32, to: 27, distance: 89,  label: 'Transformer Road'       },
  { from: 27, to: 34, distance: 90,  label: 'KG Design Road'         },
  { from: 34, to: 32, distance: 100, label: 'Design–Tank Path'       },
  { from: 10, to: 16, distance: 62,  label: 'GSS–Facilities Road'    },

  // ── Cross-campus shortcuts ─────────────────────────────────────
  { from: 35, to: 7,  distance: 190, label: 'Campus Central Road'    },
  { from: 6,  to: 28, distance: 148, label: 'IT Tower–Guest Path'    },
  { from: 5,  to: 15, distance: 152, label: 'Academic–Auditorium Path'},
  { from: 16, to: 13, distance: 200, label: 'Facilities–Hostel Road' },
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

// ─── Backward-compat stubs (roadNodes/roadEdges no longer used) ───────────────
export const roadNodes = [];
export const roadEdges = [];
