import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Contact, ProviderICP, AppUser, BuyerProfile, ProviderProfile, IntegrationProvider } from '../types';
import { calculateFitScore } from '../services/scoringService';
import { discoverEmail } from '../services/contactDiscoveryService';

interface DataContextType {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  refreshContacts: () => Promise<void>;
  addContact: (contact: Contact) => Promise<void>;
  addContacts: (contacts: Partial<Contact>[]) => Promise<void>;
  updateContact: (id: string, updates: Partial<Contact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
  enrichLead: (contact: Partial<Contact>) => Promise<Partial<Contact>>;
  scoreContacts: () => void;
  discoverLeadEmail: (contact: Contact) => Promise<void>;

  providerICP: ProviderICP;
  updateProviderICP: (icp: ProviderICP) => void;

  user: AppUser | null;
  buyerProfile: BuyerProfile | null;

  providerProfile: ProviderProfile | null;
  fetchProfile: (userId: string) => Promise<void>;
  updateUserProfile: (profile: Partial<AppUser>) => Promise<void>;

  integrations: IntegrationProvider[];
  updateIntegrations: (integrations: IntegrationProvider[]) => void;
}

const DEFAULT_INTEGRATIONS: IntegrationProvider[] = [
  { id: 'icypeas', name: 'Icypeas', icon: '🧊', apiKey: '', enabled: false, priority: 0 },
  { id: 'findymail', name: 'Findymail', icon: '📧', apiKey: '', enabled: false, priority: 1, costPerMatch: 2 },
  { id: 'leadmagic', name: 'LeadMagic', icon: '✨', apiKey: '', enabled: false, priority: 2, costPerMatch: 1 },
  { id: 'dropcontact', name: 'Dropcontact', icon: '💧', apiKey: '', enabled: false, priority: 3, costPerMatch: 2 },
  { id: 'prospeo', name: 'Prospeo', icon: '📦', apiKey: '', enabled: false, priority: 4, costPerMatch: 2 },
  { id: 'fullenrich', name: 'FullEnrich', icon: '🌊', apiKey: '', enabled: false, priority: 5, costPerMatch: 2 },
  { id: 'bettercontact', name: 'BetterContact', icon: '🅱️', apiKey: '', enabled: false, priority: 6, costPerMatch: 3 },
  { id: 'contactout', name: 'ContactOut', icon: '📱', apiKey: '', enabled: false, priority: 7, costPerMatch: 12 },
];

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [buyerProfile, setBuyerProfile] = useState<BuyerProfile | null>(null);
  const [providerProfile, setProviderProfile] = useState<ProviderProfile | null>(null);

  const [providerICP, setProviderICP] = useState<ProviderICP>(() => {
    const saved = localStorage.getItem('manafeth_icp');
    return saved ? JSON.parse(saved) : {
      isSet: false,
      industries: [],
      titles: [],
      budgetRange: { min: 0, max: 0 }
    };
  });

  const [integrations, setIntegrations] = useState<IntegrationProvider[]>(() => {
    const saved = localStorage.getItem('manafeth_integrations');
    return saved ? JSON.parse(saved) : DEFAULT_INTEGRATIONS;
  });

  // Contacts API Actions
  const refreshContacts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/contacts');
      if (!response.ok) throw new Error('Failed to fetch contacts');
      const data = await response.json();
      setContacts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addContact = async (contact: Contact) => {
    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact),
      });
      if (!response.ok) throw new Error('Failed to add contact');
      await refreshContacts();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const addContacts = async (newContacts: Partial<Contact>[]) => {
    try {
      // In a real app, use a bulk API endpoint. For now, loop parallel.
      const promises = newContacts.map(contact =>
        fetch('/api/contacts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(contact),
        })
      );

      await Promise.all(promises);
      await refreshContacts();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const updateContact = async (id: string, updates: Partial<Contact>) => {
    try {
      const response = await fetch('/api/contacts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      if (!response.ok) throw new Error('Failed to update contact');
      await refreshContacts();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteContact = async (id: string) => {
    try {
      const response = await fetch(`/api/contacts?id=${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete contact');
      setContacts(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const enrichLead = async (contact: Partial<Contact>): Promise<Partial<Contact>> => {
    try {
      const response = await fetch('/api/enrichment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contact }),
      });
      if (!response.ok) throw new Error('Enrichment failed');
      return await response.json();
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  };

  const scoreContacts = async () => {
    const updatedContacts = contacts.map(c => {
      const { score, status } = calculateFitScore(c, providerICP);
      return { ...c, fitScore: score, icpStatus: status };
    });

    // In a real app, we would batch update the backend here.
    // For now, update local state
    setContacts(updatedContacts);

    // Optimistically update backend for high fit leads
    updatedContacts.forEach(c => {
      if (c.fitScore !== undefined && c.fitScore > 0) {
        updateContact(c.id, { fitScore: c.fitScore, icpStatus: c.icpStatus });
      }
    });
  };

  const discoverLeadEmail = async (contact: Contact) => {
    const result = await discoverEmail(contact, integrations);
    if (result.status === 'found' && result.email) {
      // Update contact with found email
      await updateContact(contact.id, {
        email: result.email,
        source: `${contact.source || ''} + ${result.source}`
      });
      return;
    }

    if (result.status === 'not_found') {
      // Optional: Mark as "Not Found" in tags or logs
      console.log('Email not found via waterfall');
    }
  };

  // Profile API Actions
  const fetchProfile = async (userId: string) => {
    try {
      // Fetch provider profile by default for now
      const res = await fetch(`/api/profiles/provider?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setProviderProfile(data);
        setUser(data.user);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const updateProviderICP = (icp: ProviderICP) => {
    setProviderICP(icp);
    localStorage.setItem('manafeth_icp', JSON.stringify(icp));
  };

  const updateUserProfile = async (profile: Partial<AppUser>) => {
    // Logic to update user profile via API
    console.log('Update user profile:', profile);
  };

  const updateIntegrations = (newIntegrations: IntegrationProvider[]) => {
    setIntegrations(newIntegrations);
    localStorage.setItem('manafeth_integrations', JSON.stringify(newIntegrations));
  };

  useEffect(() => {
    refreshContacts();
  }, []);

  return (
    <DataContext.Provider value={{
      contacts,
      loading,
      error,
      refreshContacts,
      addContact,
      addContacts,
      updateContact,
      deleteContact,
      enrichLead,
      scoreContacts,
      discoverLeadEmail,
      providerICP,
      updateProviderICP,
      user,
      buyerProfile,
      providerProfile,
      fetchProfile,
      updateUserProfile,
      integrations,
      updateIntegrations
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
