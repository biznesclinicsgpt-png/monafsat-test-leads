import { DEMO_CONTACTS, DEMO_ICP, DEMO_PROVIDER, DEMO_STATS } from '../utils/demoData';

export const injectDemoData = () => {
    // 1. Inject Profile
    const currentProfile = localStorage.getItem('manafeth_profile');
    const newProfile = {
        ...(currentProfile ? JSON.parse(currentProfile) : {}),
        ...DEMO_PROVIDER
    };
    localStorage.setItem('manafeth_profile', JSON.stringify(newProfile));

    // 2. Inject ICP
    localStorage.setItem('manafeth_icp', JSON.stringify(DEMO_ICP));

    // 3. Inject Contacts (In a real app, this would be a backend reset)
    // For this prototype, we'll use a specific key or overwrite the context's source if possible.
    // Since DataContext loads from API, we might need to mock the API response OR 
    // force write to localStorage if the prototype uses it.
    // Assuming the prototype might rely on some local storage for persistence or we just reload the page
    // and let the DataContext pick up "Demo Mode" flag.

    // Let's set a flag
    localStorage.setItem('demo_mode', 'true');

    // Also store the contacts in a way the Mock API might pick them up if we implemented one.
    // But since we don't have a backend, let's assume valid "database" persistence in localStorage for the prototype:
    localStorage.setItem('mock_contacts_db', JSON.stringify(DEMO_CONTACTS));

    return true;
};

export const clearDemoData = () => {
    localStorage.removeItem('demo_mode');
    localStorage.removeItem('mock_contacts_db');
    // Don't fully clear profile, just the demo flag
};
