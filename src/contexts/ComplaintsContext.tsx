import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Complaint, ComplaintStatus, ComplaintStats } from '@/types';

interface ComplaintsContextType {
  complaints: Complaint[];
  addComplaint: (complaint: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  updateComplaintStatus: (id: string, status: ComplaintStatus, solutionImageUrl?: string, resolutionNote?: string) => void;
  getComplaintsByUser: (userId: string) => Complaint[];
  getStats: (userId?: string) => ComplaintStats;
}

const ComplaintsContext = createContext<ComplaintsContextType | undefined>(undefined);

// Mock initial complaints
const initialComplaints: Complaint[] = [
  {
    id: 'c1',
    userId: 'user-1',
    category: 'road',
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400',
    latitude: 22.9074,
    longitude: 88.3979,
    address: 'Near Halisahar Station, Ward 5',
    wardNumber: 5,
    status: 'pending',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 'c2',
    userId: 'user-1',
    category: 'garbage',
    imageUrl: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=400',
    latitude: 22.9084,
    longitude: 88.3989,
    address: 'Gandhi Road, Ward 5',
    wardNumber: 5,
    status: 'in-progress',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12'),
  },
  {
    id: 'c3',
    userId: 'user-1',
    category: 'streetlight',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    solutionImageUrl: 'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=400',
    latitude: 22.9064,
    longitude: 88.3969,
    address: 'Station Road, Ward 5',
    wardNumber: 5,
    status: 'solved',
    resolutionNote: 'New LED street light installed',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: 'c4',
    userId: 'user-2',
    category: 'water',
    imageUrl: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=400',
    latitude: 22.9054,
    longitude: 88.3959,
    address: 'Market Area, Ward 3',
    wardNumber: 3,
    status: 'pending',
    createdAt: new Date('2024-01-17'),
    updatedAt: new Date('2024-01-17'),
  },
  {
    id: 'c5',
    userId: 'user-3',
    category: 'drainage',
    imageUrl: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?w=400',
    latitude: 22.9044,
    longitude: 88.3949,
    address: 'School Lane, Ward 7',
    wardNumber: 7,
    status: 'in-progress',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-16'),
  },
];

export function ComplaintsProvider({ children }: { children: ReactNode }) {
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);

  const addComplaint = (complaintData: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const newComplaint: Complaint = {
      ...complaintData,
      id: `c${Date.now()}`,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setComplaints((prev) => [newComplaint, ...prev]);
  };

  const updateComplaintStatus = (
    id: string,
    status: ComplaintStatus,
    solutionImageUrl?: string,
    resolutionNote?: string
  ) => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status,
              solutionImageUrl: solutionImageUrl || c.solutionImageUrl,
              resolutionNote: resolutionNote || c.resolutionNote,
              updatedAt: new Date(),
            }
          : c
      )
    );
  };

  const getComplaintsByUser = (userId: string) => {
    return complaints.filter((c) => c.userId === userId);
  };

  const getStats = (userId?: string): ComplaintStats => {
    const filtered = userId ? complaints.filter((c) => c.userId === userId) : complaints;
    return {
      total: filtered.length,
      pending: filtered.filter((c) => c.status === 'pending').length,
      inProgress: filtered.filter((c) => c.status === 'in-progress').length,
      solved: filtered.filter((c) => c.status === 'solved').length,
    };
  };

  return (
    <ComplaintsContext.Provider
      value={{ complaints, addComplaint, updateComplaintStatus, getComplaintsByUser, getStats }}
    >
      {children}
    </ComplaintsContext.Provider>
  );
}

export function useComplaints() {
  const context = useContext(ComplaintsContext);
  if (context === undefined) {
    throw new Error('useComplaints must be used within a ComplaintsProvider');
  }
  return context;
}
