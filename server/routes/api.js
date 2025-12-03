const express = require('express');
const { db } = require('../db');
const router = express.Router();
const crypto = require('crypto');
const { getAffiliateLinks, getCoupon, formatModeName } = require('../affiliates');

// Constants for Route Calculation
const EMISSION_FACTORS = {
    train: 2.5, metro: 1.8, bus: 3.8, air: 9.5, water: 4.1, shared_taxi: 4.6,
};

const OCCASION_PRIORITIES = {
    emergency: { speed: 1.4, comfort: 0.8, cost: 0.6 },
    medical: { speed: 1.3, comfort: 0.9, cost: 0.7 },
    business: { speed: 1.1, comfort: 1.2, cost: 0.9 },
    exam: { speed: 1.2, comfort: 1.0, cost: 0.85 },
    wedding: { speed: 1.0, comfort: 1.1, cost: 0.9 },
    leisure: { speed: 0.9, comfort: 1.2, cost: 1.1 },
    default: { speed: 1, comfort: 1, cost: 1 },
};

// --- Endpoints ---

router.get('/locations', (req, res) => {
    const locations = db.prepare('SELECT * FROM locations').all();
    res.json(locations);
});

router.get('/service-alerts', (req, res) => {
    const alerts = db.prepare('SELECT * FROM service_alerts WHERE valid_to > ?').all(new Date().toISOString());
    // Parse JSON fields
    const parsedAlerts = alerts.map(a => ({
        ...a,
        affected_modes: JSON.parse(a.affected_modes),
        affected_locations: JSON.parse(a.affected_locations)
    }));
    res.json(parsedAlerts);
});

router.get('/trip-plans', (req, res) => {
    // If user is authenticated, filter by user, else return empty or public?
    // For now return all or just recent ones.
    const plans = db.prepare('SELECT * FROM trip_plans ORDER BY created_at DESC LIMIT 10').all();
    const parsedPlans = plans.map(p => ({
        ...p,
        route_details: JSON.parse(p.route_details)
    }));
    res.json(parsedPlans);
});

router.post('/trip-plans', (req, res) => {
    const { origin_id, destination_id, travel_date, occasion, total_cost, total_duration, route_details, origin_name, destination_name } = req.body;
    const user_id = req.user ? req.user.id : null;
    const id = crypto.randomUUID();

    try {
        db.prepare(`
      INSERT INTO trip_plans (id, user_id, origin_id, destination_id, travel_date, occasion, total_cost, total_duration, route_details, origin_name, destination_name)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(id, user_id, origin_id, destination_id, travel_date, occasion, total_cost, total_duration, JSON.stringify(route_details), origin_name, destination_name);
        res.json({ id, message: 'Trip plan saved' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to save trip plan' });
    }
});

router.get('/dashboard/metrics', (req, res) => {
    const totalTrips = db.prepare('SELECT COUNT(*) as count FROM trip_plans').get().count;
    const avgCost = db.prepare('SELECT AVG(total_cost) as avg FROM trip_plans').get().avg || 0;
    const avgDuration = db.prepare('SELECT AVG(total_duration) as avg FROM trip_plans').get().avg || 0;
    const originCount = db.prepare('SELECT COUNT(DISTINCT origin_id) as count FROM trip_plans').get().count;
    const destCount = db.prepare('SELECT COUNT(DISTINCT destination_id) as count FROM trip_plans').get().count;
    const emergencyTrips = db.prepare("SELECT COUNT(*) as count FROM trip_plans WHERE occasion = 'emergency'").get().count;
    const lastTrip = db.prepare('SELECT created_at FROM trip_plans ORDER BY created_at DESC LIMIT 1').get();

    const occasionBreakdown = db.prepare(`
    SELECT occasion, COUNT(*) as tripCount 
    FROM trip_plans 
    WHERE occasion IS NOT NULL 
    GROUP BY occasion 
    ORDER BY tripCount DESC
  `).all();

    const topOrigin = db.prepare(`
    SELECT origin_name, COUNT(*) as trip_count 
    FROM trip_plans 
    WHERE origin_name IS NOT NULL 
    GROUP BY origin_name 
    ORDER BY trip_count DESC 
    LIMIT 1
  `).get();

    const topDestination = db.prepare(`
    SELECT destination_name, COUNT(*) as trip_count 
    FROM trip_plans 
    WHERE destination_name IS NOT NULL 
    GROUP BY destination_name 
    ORDER BY trip_count DESC 
    LIMIT 1
  `).get();

    res.json({
        totalTrips,
        avgCost,
        avgDuration,
        originCoverage: originCount,
        destinationCoverage: destCount,
        emergencyTrips,
        lastTripAt: lastTrip ? lastTrip.created_at : null,
        occasionBreakdown,
        topOrigin: topOrigin ? topOrigin.origin_name : null,
        topDestination: topDestination ? topDestination.destination_name : null
    });
});


router.post('/calculate-routes', (req, res) => {
    const { originId, destinationId, travelDate, occasion } = req.body;

    const origin = db.prepare('SELECT * FROM locations WHERE id = ?').get(originId);
    const destination = db.prepare('SELECT * FROM locations WHERE id = ?').get(destinationId);

    if (!origin || !destination) {
        return res.status(400).json({ error: 'Invalid origin or destination' });
    }

    const directRoutes = db.prepare('SELECT * FROM routes WHERE origin_id = ? AND destination_id = ?').all(originId, destinationId);

    const allRoutes = [];

    // Process all direct routes
    directRoutes.forEach(route => {
        const baseTime = new Date(`${travelDate}T08:00:00`);
        const duration = route.duration_minutes || 0;
        const arrivalTime = new Date(baseTime.getTime() + duration * 60000);

        // Categorize route based on transport mode
        const routeCategory = categorizeRoute(route.transport_mode, route.base_cost, duration);

        allRoutes.push({
            id: crypto.randomUUID(),
            type: routeCategory,
            segments: [{
                mode: route.transport_mode,
                modeName: formatModeName(route.transport_mode),
                from: origin.name,
                to: destination.name,
                duration: duration,
                cost: route.base_cost || 0,
                departure: baseTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                arrival: arrivalTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                bookingLinks: getAffiliateLinks(route.transport_mode)
            }],
            totalDuration: duration,
            totalCost: route.base_cost || 0
        });
    });

    // Multi-segment routes (connecting routes)
    const forwardConnections = db.prepare('SELECT * FROM routes WHERE origin_id = ?').all(originId);
    const inboundConnections = db.prepare('SELECT * FROM routes WHERE destination_id = ?').all(destinationId);

    if (forwardConnections.length > 0 && inboundConnections.length > 0) {
        let combosAdded = 0;
        forwardConnections.forEach(first => {
            if (combosAdded >= 5) return;
            const seconds = inboundConnections.filter(s => s.origin_id === first.destination_id);
            seconds.forEach(second => {
                if (combosAdded >= 5) return;

                const interchange = db.prepare('SELECT name FROM locations WHERE id = ?').get(first.destination_id);
                const baseTime = new Date(`${travelDate}T06:30:00`);
                const firstDur = first.duration_minutes || 0;
                const secondDur = second.duration_minutes || 0;
                const layover = 30;

                const firstArr = new Date(baseTime.getTime() + firstDur * 60000);
                const secondDep = new Date(firstArr.getTime() + layover * 60000);
                const secondArr = new Date(secondDep.getTime() + secondDur * 60000);

                const totalCost = first.base_cost + second.base_cost;
                const totalDuration = firstDur + secondDur + layover;
                const routeCategory = categorizeRoute(
                    faster(first.transport_mode, second.transport_mode),
                    totalCost,
                    totalDuration
                );

                allRoutes.push({
                    id: crypto.randomUUID(),
                    type: routeCategory,
                    segments: [
                        {
                            mode: first.transport_mode,
                            modeName: formatModeName(first.transport_mode),
                            from: origin.name,
                            to: interchange.name,
                            duration: firstDur,
                            cost: first.base_cost,
                            departure: baseTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                            arrival: firstArr.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                            bookingLinks: getAffiliateLinks(first.transport_mode)
                        },
                        {
                            mode: second.transport_mode,
                            modeName: formatModeName(second.transport_mode),
                            from: interchange.name,
                            to: destination.name,
                            duration: secondDur,
                            cost: second.base_cost,
                            departure: secondDep.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                            arrival: secondArr.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
                            bookingLinks: getAffiliateLinks(second.transport_mode)
                        }
                    ],
                    totalDuration: totalDuration,
                    totalCost: totalCost
                });
                combosAdded++;
            });
        });
    }

    // Enrich all routes with carbon, score, coupon, and insight
    const enrichedRoutes = allRoutes.map(route => {
        const carbon = calculateCarbon(route.segments);
        const score = calculateScore(route, occasion);
        const coupon = getCoupon(route.type);

        return {
            ...route,
            carbonEstimate: Number(carbon.toFixed(1)),
            score: score,
            insight: generateInsight(route.type, route.segments),
            coupon: {
                code: coupon.code,
                value: coupon.value,
                description: coupon.description
            }
        };
    });

    res.json({ routes: enrichedRoutes });
});

// Helper function to categorize routes
function categorizeRoute(mode, cost, duration) {
    // Luxury: Business flights, 1st/2nd AC trains, AC buses, private taxis
    if (mode.includes('business_flight') || mode.includes('1st_ac') || mode.includes('2nd_ac') || mode.includes('private_ac_taxi')) {
        return 'luxury';
    }

    // Speed: Flights, express trains, metro
    if (mode.includes('flight') || mode.includes('metro') || (mode.includes('train') && duration < 300)) {
        return 'speed';
    }

    // Standard: Everything else (non-AC bus, sleeper train, shared taxi, auto)
    return 'standard';
}

// Helper to determine faster mode
function faster(mode1, mode2) {
    const speedOrder = ['business_flight', 'economy_flight', 'metro', '1st_ac_train', '2nd_ac_train', '3rd_ac_train', 'sleeper_train', 'private_ac_taxi', 'ac_bus', 'shared_taxi', 'non_ac_bus', 'auto_rickshaw'];
    return speedOrder.indexOf(mode1) < speedOrder.indexOf(mode2) ? mode1 : mode2;
}

// Calculate carbon emissions
function calculateCarbon(segments) {
    const emissionFactors = {
        '1st_ac_train': 2.5, '2nd_ac_train': 2.5, '3rd_ac_train': 2.5, 'sleeper_train': 2.5,
        'ac_bus': 3.8, 'non_ac_bus': 3.8, 'semi_sleeper_bus': 3.8, 'sleeper_bus': 3.8,
        'economy_flight': 9.5, 'business_flight': 12.0,
        'shared_taxi': 4.6, 'private_ac_taxi': 5.5, 'private_taxi': 5.0,
        'metro': 1.8,
        'auto_rickshaw': 3.2
    };

    return segments.reduce((sum, seg) => {
        const factor = emissionFactors[seg.mode] || 3.5;
        return sum + ((seg.duration / 60) * factor);
    }, 0);
}

// Calculate route score
function calculateScore(route, occasion) {
    let baseScore = 85;

    // Adjust based on route type
    if (route.type === 'luxury') baseScore += 10;
    if (route.type === 'speed') baseScore += 5;

    // Adjust based on occasion
    if (occasion === 'emergency' && route.type === 'speed') baseScore += 10;
    if (occasion === 'leisure' && route.type === 'standard') baseScore += 5;
    if (occasion === 'business' && route.type === 'luxury') baseScore += 8;

    return Math.min(100, baseScore);
}

// Generate insight message
function generateInsight(type, segments) {
    if (type === 'luxury') return 'Premium comfort with luxury amenities';
    if (type === 'speed') return 'Fastest route to your destination';
    if (segments.length > 1) return 'Multi-modal route with optimal connections';
    return 'Best value for money';
}

module.exports = router;
