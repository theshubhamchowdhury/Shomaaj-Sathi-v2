import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Complaint, ComplaintStatus, ComplaintStats } from '@/types';
import axios from 'axios';
import { useAuth } from './AuthContext';

interface ComplaintsContextType {
  complaints: Complaint[];
  loading: boolean;
  addComplaint: (complaint: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => Promise<void>;
  updateComplaintStatus: (id: string, status: ComplaintStatus, solutionImageUrl?: string, resolutionNote?: string) => Promise<void>;
  getComplaintsByUser: (userId: string) => Complaint[];
  getStats: (userId?: string) => ComplaintStats;
  refreshComplaints: () => Promise<void>;
}

const ComplaintsContext = createContext<ComplaintsContextType | undefined>(undefined);

export function ComplaintsProvider({ children }: { children: ReactNode }) {
  const { token, user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchComplaints = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const url = user?.role === 'admin' 
        ? `${import.meta.env.VITE_API_URL}/api/admin/complaints`
        : `${import.meta.env.VITE_API_URL}/api/complaints/me`;
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Map _id to id
      const mapped = response.data.map((c: any) => ({
        ...c,
        id: c._id,
        createdAt: new Date(c.createdAt),
        updatedAt: new Date(c.updatedAt)
      }));
      setComplaints(mapped);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [token, user?.role]);

  const addComplaint = async (complaintData: Omit<Complaint, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    if (!token) return;
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/complaints`, complaintData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const newComplaint = {
        ...response.data,
        id: response.data._id,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt)
      };
      setComplaints((prev) => [newComplaint, ...prev]);
    } catch (error) {
      console.error('Error adding complaint:', error);
      throw error;
    }
  };

  const updateComplaintStatus = async (
    id: string,
    status: ComplaintStatus,
    solutionImageUrl?: string,
    resolutionNote?: string
  ) => {
    if (!token) return;
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/complaints/${id}`, {
        status,
        solutionImageUrl,
        resolutionNote
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const updated = {
        ...response.data,
        id: response.data._id,
        createdAt: new Date(response.data.createdAt),
        updatedAt: new Date(response.data.updatedAt)
      };

      setComplaints((prev) =>
        prev.map((c) => (c.id === id ? updated : c))
      );
    } catch (error) {
      console.error('Error updating complaint:', error);
      throw error;
    }
  };

  const getComplaintsByUser = (userId: string) => {
    return complaints.filter((c) => c.userId === userId);
  };

  const getStats = (userId?: string): ComplaintStats => {
    const list = userId ? getComplaintsByUser(userId) : complaints;
    return {
      total: list.length,
      pending: list.filter((c) => c.status === 'pending').length,
      inProgress: list.filter((c) => c.status === 'in-progress').length,
      solved: list.filter((c) => c.status === 'solved').length,
    };
  };

  return (
    <ComplaintsContext.Provider
      value={{
        complaints,
        loading,
        addComplaint,
        updateComplaintStatus,
        getComplaintsByUser,
        getStats,
        refreshComplaints: fetchComplaints
      }}
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
