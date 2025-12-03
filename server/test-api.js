async function testApi() {
    try {
        // 1. Fetch Locations to get IDs
        console.log('Fetching locations...');
        const locResponse = await fetch('http://localhost:3000/api/locations');
        const locations = await locResponse.json();

        const origin = locations.find(l => l.name === 'New Delhi');
        const dest = locations.find(l => l.name === 'Mumbai');

        if (!origin || !dest) {
            console.error('❌ Could not find test locations (New Delhi -> Mumbai)');
            return;
        }
        console.log(`✅ Found locations: ${origin.name} (${origin.id}) -> ${dest.name} (${dest.id})`);

        // 2. Test Route Calculation
        console.log('\nTesting Route Calculation...');
        const routeResponse = await fetch('http://localhost:3000/api/calculate-routes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                originId: origin.id,
                destinationId: dest.id,
                travelDate: '2025-12-01',
                occasion: 'business'
            })
        });

        const routeData = await routeResponse.json();
        const routes = routeData.routes;

        if (!routes || routes.length === 0) {
            console.error('❌ No routes returned');
            return;
        }
        console.log(`✅ Returned ${routes.length} routes`);

        // 3. Verify Multi-Modal & Affiliates
        let hasMultiModal = false;
        let hasAffiliates = false;
        let hasCoupons = false;

        routes.forEach((r, i) => {
            console.log(`\nRoute ${i + 1} (${r.type}):`);
            r.segments.forEach(s => {
                console.log(`  - ${s.mode} (${s.duration}m)`);
                if (s.bookingLinks && s.bookingLinks.length > 0) {
                    hasAffiliates = true;
                    console.log(`    🔗 Affiliates: ${s.bookingLinks.map(b => b.name).join(', ')}`);
                }
            });

            if (r.segments.length > 1) hasMultiModal = true;
            if (r.coupon) {
                hasCoupons = true;
                console.log(`    🎟️ Coupon: ${r.coupon.code} (Value: ${r.coupon.value})`);
            }
        });

        console.log('\n--- Verification Results ---');
        console.log(`Multi-Modal Routes: ${hasMultiModal ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`Affiliate Links:    ${hasAffiliates ? '✅ PASS' : '❌ FAIL'}`);
        console.log(`Coupon Generation:  ${hasCoupons ? '✅ PASS' : '❌ FAIL'}`);

    } catch (error) {
        console.error('❌ Test Failed:', error.message);
    }
}

testApi();
