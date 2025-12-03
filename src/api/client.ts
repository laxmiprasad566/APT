const API_URL = 'https://ai-trip-planner-production.up.railway.app/api';
const AUTH_URL = 'https://ai-trip-planner-production.up.railway.app/auth';

export const api = {
    async getLocations() {
        const res = await fetch(`${API_URL}/locations`);
        if (!res.ok) throw new Error('Failed to fetch locations');
        return res.json();
    },

    async getServiceAlerts() {
        const res = await fetch(`${API_URL}/service-alerts`);
        if (!res.ok) throw new Error('Failed to fetch alerts');
        return res.json();
    },

    async getTripPlans() {
        const res = await fetch(`${API_URL}/trip-plans`);
        if (!res.ok) throw new Error('Failed to fetch trip plans');
        return res.json();
    },

    async createTripPlan(plan: any) {
        const res = await fetch(`${API_URL}/trip-plans`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(plan),
        });
        if (!res.ok) throw new Error('Failed to create trip plan');
        return res.json();
    },

    async getMetrics() {
        const res = await fetch(`${API_URL}/dashboard/metrics`);
        if (!res.ok) throw new Error('Failed to fetch metrics');
        return res.json();
    },

    async calculateRoutes(params: any) {
        const res = await fetch(`${API_URL}/calculate-routes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params),
        });
        if (!res.ok) throw new Error('Failed to calculate routes');
        return res.json();
    },

    async getCurrentUser() {
        const res = await fetch(`${AUTH_URL}/me`, {
            credentials: 'include' // Important for session cookies
        });
        if (res.status === 401) return null;
        if (!res.ok) throw new Error('Failed to fetch user');
        const data = await res.json();
        return data.user;
    },

    async logout() {
        const res = await fetch(`${AUTH_URL}/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        if (!res.ok) throw new Error('Failed to logout');
        return res.json();
    }
};
