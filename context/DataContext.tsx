import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Contact, ProviderICP, AppUser, BuyerProfile, ProviderProfile } from '../types';

interface DataContextType {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  refreshContacts: () => Promise<void>;
  addContact: (contact: Contact) => Promise<void>;
  addContacts: (contacts: Partial<Contact>[]) => Promise<void>;
  updateContact: (id: string, updates: Partial<Contact>) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;

  providerICP: ProviderICP;
  updateProviderICP: (icp: ProviderICP) => void;

  user: AppUser | null;
  buyerProfile: BuyerProfile | null;
  providerProfile: ProviderProfile | null;

  fetchProfile: (userId: string) => Promise<void>;
  updateUserProfile: (profile: Partial<AppUser>) => Promise<void>;
}

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
      providerICP,
      updateProviderICP,
      user,
      buyerProfile,
      providerProfile,
      fetchProfile,
      updateUserProfile
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
