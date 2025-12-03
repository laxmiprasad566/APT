const Database = require('better-sqlite3');
const path = require('path');
const crypto = require('crypto');

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new Database(dbPath);

function initializeDb() {
  console.log('Initializing database...');

  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      google_id TEXT UNIQUE,
      email TEXT,
      name TEXT,
      avatar_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS locations (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      location_type TEXT NOT NULL,
      latitude REAL,
      longitude REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS routes (
      id TEXT PRIMARY KEY,
      origin_id TEXT NOT NULL,
      destination_id TEXT NOT NULL,
      transport_mode TEXT NOT NULL,
      distance_km REAL,
      duration_minutes INTEGER,
      base_cost REAL,
      frequency_per_day INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (origin_id) REFERENCES locations(id),
      FOREIGN KEY (destination_id) REFERENCES locations(id),
      UNIQUE(origin_id, destination_id, transport_mode)
    );

    CREATE TABLE IF NOT EXISTS trip_plans (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      origin_id TEXT NOT NULL,
      destination_id TEXT NOT NULL,
      travel_date TEXT NOT NULL,
      occasion TEXT,
      total_cost REAL,
      total_duration INTEGER,
      route_details JSON,
      origin_name TEXT,
      destination_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (origin_id) REFERENCES locations(id),
      FOREIGN KEY (destination_id) REFERENCES locations(id)
    );

    CREATE TABLE IF NOT EXISTS service_alerts (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      severity TEXT NOT NULL,
      affected_modes JSON,
      affected_locations JSON,
      valid_from DATETIME DEFAULT CURRENT_TIMESTAMP,
      valid_to DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Check if we need to re-seed (if old data exists)
  const oldData = db.prepare("SELECT * FROM locations WHERE name = 'Bagya Nagar'").get();
  if (oldData) {
    console.log('Old data detected. Clearing database...');
    db.exec('DELETE FROM service_alerts');
    db.exec('DELETE FROM trip_plans');
    db.exec('DELETE FROM routes');
    db.exec('DELETE FROM locations');
  }

  const locationCount = db.prepare('SELECT COUNT(*) as count FROM locations').get().count;
  if (locationCount === 0) {
    console.log('Seeding database with Indian cities...');
    seedData();
  }
}

function seedData() {
  const insertLocation = db.prepare('INSERT INTO locations (id, name, location_type) VALUES (?, ?, ?)');
  const insertRoute = db.prepare('INSERT INTO routes (id, origin_id, destination_id, transport_mode, distance_km, duration_minutes, base_cost, frequency_per_day) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
  const insertAlert = db.prepare('INSERT INTO service_alerts (id, title, description, severity, affected_modes, affected_locations, valid_from, valid_to) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');

  // Real Indian Cities Dataset
  const locations = [
    // Mega Cities
    { name: 'New Delhi', type: 'mega_city' },
    { name: 'Mumbai', type: 'mega_city' },
    { name: 'Bengaluru', type: 'mega_city' },
    { name: 'Hyderabad', type: 'mega_city' },
    { name: 'Chennai', type: 'mega_city' },
    { name: 'Kolkata', type: 'mega_city' },

    // Major Cities
    { name: 'Pune', type: 'city' },
    { name: 'Ahmedabad', type: 'city' },
    { name: 'Jaipur', type: 'city' },
    { name: 'Surat', type: 'city' },
    { name: 'Lucknow', type: 'city' },
    { name: 'Kanpur', type: 'city' },
    { name: 'Nagpur', type: 'city' },
    { name: 'Indore', type: 'city' },
    { name: 'Thane', type: 'city' },
    { name: 'Bhopal', type: 'city' },
    { name: 'Visakhapatnam', type: 'city' },
    { name: 'Patna', type: 'city' },
    { name: 'Vadodara', type: 'city' },
    { name: 'Ghaziabad', type: 'city' },
    { name: 'Ludhiana', type: 'city' },
    { name: 'Agra', type: 'city' },
    { name: 'Nashik', type: 'city' },
    { name: 'Ranchi', type: 'city' },
    { name: 'Faridabad', type: 'city' },
    { name: 'Varanasi', type: 'city' },
    { name: 'Amritsar', type: 'city' },
    { name: 'Allahabad', type: 'city' },
    { name: 'Coimbatore', type: 'city' },
    { name: 'Vijayawada', type: 'city' }
  ];

  const locationMap = {};
  locations.forEach(loc => {
    const id = crypto.randomUUID();
    insertLocation.run(id, loc.name, loc.type);
    locationMap[loc.name] = id;
  });

  // Comprehensive multi-modal routes for Real Cities
  const routes = [
    // DELHI ↔ MUMBAI (Major Corridor)
    { origin: 'New Delhi', dest: 'Mumbai', mode: '1st_ac_train', dist: 1384, dur: 960, cost: 4500, freq: 8 },
    { origin: 'New Delhi', dest: 'Mumbai', mode: '2nd_ac_train', dist: 1384, dur: 960, cost: 2800, freq: 12 },
    { origin: 'New Delhi', dest: 'Mumbai', mode: '3rd_ac_train', dist: 1384, dur: 960, cost: 1800, freq: 15 },
    { origin: 'New Delhi', dest: 'Mumbai', mode: 'sleeper_train', dist: 1384, dur: 1080, cost: 800, freq: 20 },
    { origin: 'New Delhi', dest: 'Mumbai', mode: 'economy_flight', dist: 1150, dur: 130, cost: 5500, freq: 30 },
    { origin: 'New Delhi', dest: 'Mumbai', mode: 'business_flight', dist: 1150, dur: 130, cost: 12000, freq: 10 },

    // BENGALURU ↔ HYDERABAD
    { origin: 'Bengaluru', dest: 'Hyderabad', mode: 'ac_bus', dist: 575, dur: 540, cost: 1200, freq: 40 },
    { origin: 'Bengaluru', dest: 'Hyderabad', mode: 'non_ac_bus', dist: 575, dur: 600, cost: 700, freq: 30 },
    { origin: 'Bengaluru', dest: 'Hyderabad', mode: 'sleeper_bus', dist: 575, dur: 540, cost: 1500, freq: 25 },
    { origin: 'Bengaluru', dest: 'Hyderabad', mode: '2nd_ac_train', dist: 620, dur: 660, cost: 1400, freq: 6 },
    { origin: 'Bengaluru', dest: 'Hyderabad', mode: '3rd_ac_train', dist: 620, dur: 660, cost: 900, freq: 8 },
    { origin: 'Bengaluru', dest: 'Hyderabad', mode: 'economy_flight', dist: 500, dur: 75, cost: 3500, freq: 15 },
    { origin: 'Bengaluru', dest: 'Hyderabad', mode: 'private_ac_taxi', dist: 575, dur: 480, cost: 8000, freq: 10 },

    // MUMBAI ↔ PUNE (Short Distance)
    { origin: 'Mumbai', dest: 'Pune', mode: 'shared_taxi', dist: 150, dur: 180, cost: 800, freq: 50 },
    { origin: 'Mumbai', dest: 'Pune', mode: 'private_ac_taxi', dist: 150, dur: 160, cost: 3000, freq: 40 },
    { origin: 'Mumbai', dest: 'Pune', mode: 'ac_bus', dist: 150, dur: 210, cost: 450, freq: 60 },
    { origin: 'Mumbai', dest: 'Pune', mode: '2nd_ac_train', dist: 150, dur: 190, cost: 600, freq: 15 },
    { origin: 'Mumbai', dest: 'Pune', mode: 'sleeper_train', dist: 150, dur: 200, cost: 180, freq: 20 },

    // CHENNAI ↔ BENGALURU
    { origin: 'Chennai', dest: 'Bengaluru', mode: '1st_ac_train', dist: 350, dur: 300, cost: 1800, freq: 5 },
    { origin: 'Chennai', dest: 'Bengaluru', mode: '3rd_ac_train', dist: 350, dur: 300, cost: 750, freq: 10 },
    { origin: 'Chennai', dest: 'Bengaluru', mode: 'ac_bus', dist: 345, dur: 360, cost: 800, freq: 30 },
    { origin: 'Chennai', dest: 'Bengaluru', mode: 'economy_flight', dist: 290, dur: 55, cost: 2800, freq: 12 },
    { origin: 'Chennai', dest: 'Bengaluru', mode: 'private_taxi', dist: 345, dur: 330, cost: 5000, freq: 15 },

    // DELHI ↔ JAIPUR
    { origin: 'New Delhi', dest: 'Jaipur', mode: 'ac_bus', dist: 280, dur: 300, cost: 700, freq: 25 },
    { origin: 'New Delhi', dest: 'Jaipur', mode: '2nd_ac_train', dist: 310, dur: 240, cost: 900, freq: 8 },
    { origin: 'New Delhi', dest: 'Jaipur', mode: 'economy_flight', dist: 260, dur: 55, cost: 3000, freq: 5 },
    { origin: 'New Delhi', dest: 'Jaipur', mode: 'private_ac_taxi', dist: 280, dur: 270, cost: 4000, freq: 20 },

    // HYDERABAD ↔ VIJAYAWADA
    { origin: 'Hyderabad', dest: 'Vijayawada', mode: 'ac_bus', dist: 275, dur: 300, cost: 600, freq: 30 },
    { origin: 'Hyderabad', dest: 'Vijayawada', mode: '3rd_ac_train', dist: 350, dur: 330, cost: 550, freq: 12 },
    { origin: 'Hyderabad', dest: 'Vijayawada', mode: 'economy_flight', dist: 250, dur: 50, cost: 3200, freq: 4 },

    // KOLKATA ↔ RANCHI
    { origin: 'Kolkata', dest: 'Ranchi', mode: '2nd_ac_train', dist: 420, dur: 480, cost: 1100, freq: 5 },
    { origin: 'Kolkata', dest: 'Ranchi', mode: 'ac_bus', dist: 400, dur: 540, cost: 850, freq: 10 },
    { origin: 'Kolkata', dest: 'Ranchi', mode: 'economy_flight', dist: 350, dur: 65, cost: 3800, freq: 3 },

    // Metro Routes (Intra-city simulation for demo)
    { origin: 'New Delhi', dest: 'Ghaziabad', mode: 'metro', dist: 25, dur: 45, cost: 60, freq: 100 },
    { origin: 'New Delhi', dest: 'Faridabad', mode: 'metro', dist: 30, dur: 50, cost: 70, freq: 80 },
    { origin: 'Mumbai', dest: 'Thane', mode: 'metro', dist: 20, dur: 35, cost: 50, freq: 120 },

    // Auto-rickshaw (Short distance simulation)
    { origin: 'New Delhi', dest: 'Ghaziabad', mode: 'auto_rickshaw', dist: 25, dur: 60, cost: 350, freq: 50 },
    { origin: 'Mumbai', dest: 'Thane', mode: 'auto_rickshaw', dist: 20, dur: 50, cost: 300, freq: 60 }
  ];

  routes.forEach(r => {
    if (locationMap[r.origin] && locationMap[r.dest]) {
      insertRoute.run(crypto.randomUUID(), locationMap[r.origin], locationMap[r.dest], r.mode, r.dist, r.dur, r.cost, r.freq);
    }
  });

  // Service Alerts for Real Cities
  insertAlert.run(
    crypto.randomUUID(),
    'Fog Alert - North India',
    'Dense fog affecting train and flight schedules in New Delhi, Agra, and Jaipur. Expect delays.',
    'high',
    JSON.stringify(['1st_ac_train', '2nd_ac_train', 'economy_flight']),
    JSON.stringify(['New Delhi', 'Agra', 'Jaipur']),
    new Date(Date.now() - 3600000).toISOString(),
    new Date(Date.now() + 86400000).toISOString()
  );

  insertAlert.run(
    crypto.randomUUID(),
    'Mumbai Local Maintenance',
    'Mega block on Western Line this Sunday. Reduced frequency for local trains.',
    'medium',
    JSON.stringify(['metro', 'sleeper_train']),
    JSON.stringify(['Mumbai', 'Thane']),
    new Date().toISOString(),
    new Date(Date.now() + 172800000).toISOString()
  );

  insertAlert.run(
    crypto.randomUUID(),
    'Bengaluru Traffic Advisory',
    'Heavy traffic expected on Airport Road due to VIP movement. Plan travel accordingly.',
    'low',
    JSON.stringify(['ac_bus', 'private_ac_taxi']),
    JSON.stringify(['Bengaluru']),
    new Date().toISOString(),
    new Date(Date.now() + 21600000).toISOString()
  );

  // Sample Trip Plans
  const insertTripPlan = db.prepare(`
    INSERT INTO trip_plans (
      id, user_id, origin_id, destination_id, travel_date, occasion,
      total_cost, total_duration, route_details, origin_name, destination_name
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const occasions = ['commute', 'leisure', 'business', 'tourism', 'wedding', 'medical'];
  const sampleTrips = [
    { from: 'New Delhi', to: 'Mumbai', cost: 5500, duration: 130, mode: 'economy_flight' },
    { from: 'Bengaluru', to: 'Hyderabad', cost: 1200, duration: 540, mode: 'ac_bus' },
    { from: 'Mumbai', to: 'Pune', cost: 800, duration: 180, mode: 'shared_taxi' },
    { from: 'Chennai', to: 'Bengaluru', cost: 750, duration: 300, mode: '3rd_ac_train' },
    { from: 'New Delhi', to: 'Jaipur', cost: 700, duration: 300, mode: 'ac_bus' },
    { from: 'Hyderabad', to: 'Vijayawada', cost: 550, duration: 330, mode: '3rd_ac_train' },
    { from: 'Kolkata', to: 'Ranchi', cost: 1100, duration: 480, mode: '2nd_ac_train' },
    { from: 'New Delhi', to: 'Ghaziabad', cost: 60, duration: 45, mode: 'metro' }
  ];

  const now = Date.now();
  sampleTrips.forEach((trip, index) => {
    if (locationMap[trip.from] && locationMap[trip.to]) {
      const daysAgo = Math.floor(Math.random() * 30);
      const travelDate = new Date(now - (daysAgo * 24 * 60 * 60 * 1000));

      insertTripPlan.run(
        crypto.randomUUID(),
        null,
        locationMap[trip.from],
        locationMap[trip.to],
        travelDate.toISOString().split('T')[0],
        occasions[Math.floor(Math.random() * occasions.length)],
        trip.cost,
        trip.duration,
        JSON.stringify({ mode: trip.mode, segments: 1 }),
        trip.from,
        trip.to
      );
    }
  });

  console.log('Database seeded successfully with Real Indian Cities and multi-modal transport options.');
}

module.exports = { db, initializeDb };
