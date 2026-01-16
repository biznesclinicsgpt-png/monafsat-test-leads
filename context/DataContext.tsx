import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Contact, LeadSource, PipelineStage, ProviderICP } from '../types';

interface DataContextType {
  contacts: Contact[];
  addContact: (contact: Contact) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  
  providerICP: ProviderICP;
  updateProviderICP: (icp: ProviderICP) => void;
  
  userProfile: {
    name: string;
    company: string;
    avatarUrl?: string;
  };
  updateUserProfile: (profile: Partial<DataContextType['userProfile']>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const INITIAL_CONTACTS: Contact[] = [
  {
    id: '1',
    name: 'أحمد علي',
    company: 'شركة التقنية المتقدمة',
    title: 'مدير العمليات',
    email: { address: 'ahmed@tech.com', status: 'valid' },
    phone: { number: '0555123456', status: 'valid' },
    icpStatus: 'verified',
    fitScore: 85,
    stage: PipelineStage.READY_TO_OUTREACH,
    source: LeadSource.OUTBOUND_CONTACTS,
    tags: ['مهم', 'تكنولوجيا']
  },
  {
    id: '2',
    name: 'سارة خالد',
    company: 'مطاعم لافندر',
    title: 'مالكة',
    email: { address: 'sara@lavender.sa', status: 'unverified' },
    phone: { status: 'none' },
    icpStatus: 'verified',
    fitScore: 72,
    stage: PipelineStage.IN_CONVERSATION,
    source: LeadSource.INBOUND_MARKETPLACE,
    tags: ['مطاعم']
  },
  {
    id: '3',
    name: 'محمد سالم',
    company: 'مجموعة البناء',
    title: 'CEO',
    email: { status: 'none' },
    phone: { status: 'none' },
    icpStatus: 'pending',
    fitScore: 45,
    stage: PipelineStage.NEW,
    source: LeadSource.OUTBOUND_CONTACTS,
    tags: ['مقاولات']
  },
  {
    id: '4',
    name: 'دكتور عمرو',
    company: 'عيادات د. عمرو',
    title: 'Owner',
    email: { status: 'none' },
    phone: { number: '+201228806242', status: 'valid' },
    icpStatus: 'pending',
    fitScore: 60,
    stage: PipelineStage.NEW,
    source: LeadSource.OUTBOUND_CONTACTS,
    tags: ['طبي']
  }
];

const INITIAL_ICP: ProviderICP = {
  isSet: true,
  industries: ['Technolgy', 'Retail'],
  titles: ['CEO', 'CTO'],
  budgetRange: { min: 10000, max: 50000 }
};

export const DataProvider = ({ children }: { children: ReactNode }) => {
  // Load from LocalStorage or use defaults
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('manafeth_contacts');
    return saved ? JSON.parse(saved) : INITIAL_CONTACTS;
  });

  const [providerICP, setProviderICP] = useState<ProviderICP>(() => {
    const saved = localStorage.getItem('manafeth_icp');
    return saved ? JSON.parse(saved) : INITIAL_ICP;
  });

  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('manafeth_profile');
    return saved ? JSON.parse(saved) : {
      name: 'شركة حلول الإبداع الرقمي',
      company: 'Creative Solutions Co.',
      avatarUrl: undefined
    };
  });

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('manafeth_contacts', JSON.stringify(contacts));
  }, [contacts]);

  useEffect(() => {
    localStorage.setItem('manafeth_icp', JSON.stringify(providerICP));
  }, [providerICP]);

  useEffect(() => {
    localStorage.setItem('manafeth_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  // Actions
  const addContact = (contact: Contact) => {
    setContacts(prev => [contact, ...prev]);
  };

  const updateContact = (id: string, updates: Partial<Contact>) => {
    setContacts(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteContact = (id: string) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  const updateProviderICP = (icp: ProviderICP) => {
    setProviderICP(icp);
  };

  const updateUserProfile = (profile: Partial<typeof userProfile>) => {
    setUserProfile(prev => ({ ...prev, ...profile }));
  };

  return (
    <DataContext.Provider value={{
      contacts,
      addContact,
      updateContact,
      deleteContact,
      providerICP,
      updateProviderICP,
      userProfile,
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
