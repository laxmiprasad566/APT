// Affiliate booking platform configuration
const AFFILIATE_PLATFORMS = {
    bus: [
        { name: 'RedBus', baseUrl: 'https://www.redbus.in', code: 'APT_RED' },
        { name: 'AbhiBus', baseUrl: 'https://www.abhibus.com', code: 'APT_ABHI' },
        { name: 'MakeMyTrip Bus', baseUrl: 'https://www.makemytrip.com/bus-tickets', code: 'APTMMT' }
    ],
    train: [
        { name: 'IRCTC', baseUrl: 'https://www.irctc.co.in', code: 'Source=APT' },
        { name: 'ConfirmTkt', baseUrl: 'https://www.confirmtkt.com', code: 'ref=APT' },
        { name: 'RailYatri', baseUrl: 'https://www.railyatri.in', code: 'source=APT' }
    ],
    flight: [
        { name: 'MakeMyTrip', baseUrl: 'https://www.makemytrip.com/flights', code: 'campaign=APT' },
        { name: 'Goibibo', baseUrl: 'https://www.goibibo.com/flights', code: 'aff=APT' },
        { name: 'Cleartrip', baseUrl: 'https://www.cleartrip.com/flights', code: 'source=APT' }
    ],
    taxi: [
        { name: 'Ola Cabs', baseUrl: 'https://www.olacabs.com', code: 'referrer=APT' },
        { name: 'Uber', baseUrl: 'https://www.uber.com', code: 'source=APT' },
        { name: 'Rapido', baseUrl: 'https://www.rapido.bike', code: 'ref=APT' }
    ],
    metro: [
        { name: 'Metro Card', baseUrl: '#', code: 'app=APT' }
    ],
    auto: [
        { name: 'Auto Booking', baseUrl: '#', code: 'source=APT' }
    ]
};

// Coupon generation
const COUPONS = {
    first_trip: { code: 'APTFIRST', value: 500, description: 'First Trip Discount' },
    standard: { code: 'APTSAVE200', value: 200, description: 'Save ₹200' },
    luxury: { code: 'APTLUX500', value: 500, description: 'Luxury Travel Discount' },
    speed: { code: 'APTFAST300', value: 300, description: 'Express Travel Discount' }
};

// Get affiliate links for a transport mode
function getAffiliateLinks(mode) {
    const modeCategory = getModeCategory(mode);
    return AFFILIATE_PLATFORMS[modeCategory] || [];
}

// Get mode category for affiliate lookup
function getModeCategory(mode) {
    if (mode.includes('train')) return 'train';
    if (mode.includes('bus')) return 'bus';
    if (mode.includes('flight')) return 'flight';
    if (mode.includes('taxi')) return 'taxi';
    if (mode === 'metro') return 'metro';
    if (mode === 'auto_rickshaw') return 'auto';
    return 'bus'; // default
}

// Get coupon based on route type
function getCoupon(routeType, isFirstTrip = false) {
    if (isFirstTrip) return COUPONS.first_trip;
    return COUPONS[routeType] || COUPONS.standard;
}

// Format transport mode display name
function formatModeName(mode) {
    const displayNames = {
        '1st_ac_train': '1st AC Train',
        '2nd_ac_train': '2nd AC Train',
        '3rd_ac_train': '3rd AC Train',
        'sleeper_train': 'Sleeper Train',
        'ac_bus': 'AC Bus',
        'non_ac_bus': 'Non-AC Bus',
        'semi_sleeper_bus': 'Semi-Sleeper Bus',
        'sleeper_bus': 'Sleeper Bus',
        'economy_flight': 'Economy Flight',
        'business_flight': 'Business Flight',
        'shared_taxi': 'Shared Taxi',
        'private_ac_taxi': 'Private AC Taxi',
        'private_taxi': 'Private Taxi',
        'metro': 'Metro',
        'auto_rickshaw': 'Auto-Rickshaw'
    };
    return displayNames[mode] || mode.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

module.exports = {
    AFFILIATE_PLATFORMS,
    COUPONS,
    getAffiliateLinks,
    getModeCategory,
    getCoupon,
    formatModeName
};
