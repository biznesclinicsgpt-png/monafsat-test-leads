
import { IntegrationProvider, Contact } from '../types';

interface DiscoveryResponse {
    email?: string;
    source?: string;
    status: 'found' | 'not_found' | 'error';
}

export const discoverEmail = async (
    contact: Contact,
    integrations: IntegrationProvider[]
): Promise<DiscoveryResponse> => {

    // 1. Filter enabled providers and sort by priority
    const activeProviders = integrations
        .filter(p => p.enabled && p.apiKey)
        .sort((a, b) => a.priority - b.priority);

    if (activeProviders.length === 0) {
        return { status: 'error' };
    }

    // 2. Waterfall Loop
    for (const provider of activeProviders) {
        try {
            console.log(`Trying provider: ${provider.name}...`);

            const result = await callProvider(provider, contact);

            if (result && result.email) {
                console.log(`Found email with ${provider.name}: ${result.email}`);
                return {
                    email: result.email,
                    source: provider.name,
                    status: 'found'
                };
            }

            // If not found, continue to next provider

        } catch (error) {
            console.error(`Error with ${provider.name}:`, error);
            // Continue to next provider on error
        }
    }

    return { status: 'not_found' };
};

// Mock function to simulate API calls
// In production, this would satisfy specific API contracts for each provider
const callProvider = async (provider: IntegrationProvider, contact: Contact): Promise<{ email?: string } | null> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Mock Logic: 
    // - If firstname is 'Amr', find it.
    // - If company is 'Manafeth', find it.
    // - Random chance for others if "Mock Mode"

    // Check if we handle real API calls yet
    // Since we don't have real keys in this session, we return null or specific mocks

    // For demonstration, if the User enters a "VALID" key, we pretend it works
    if (provider.apiKey === 'demo') {
        if (Math.random() > 0.3) {
            const domain = contact.website ? contact.website.replace('https://', '').replace('http://', '').split('/')[0] : 'gmail.com';
            return {
                email: `${contact.first_name || 'contact'}@${domain}`.toLowerCase()
            };
        }
    }

    return null;
};
