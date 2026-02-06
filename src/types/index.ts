export type UserRole = 'citizen' | 'admin';

export type ComplaintStatus = 'pending' | 'in-progress' | 'solved';

export type ComplaintCategory = 
  | 'road'
  | 'garbage'
  | 'water'
  | 'drainage'
  | 'streetlight'
  | 'other';

export interface User {
  id: string;
  name: string;
  mobile: string;
  wardNumber: number;
  role: UserRole;
}

export interface Complaint {
  id: string;
  userId: string;
  category: ComplaintCategory;
  otherDescription?: string;
  imageUrl: string;
  solutionImageUrl?: string;
  latitude: number;
  longitude: number;
  address: string;
  wardNumber: number;
  status: ComplaintStatus;
  resolutionNote?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ComplaintStats {
  total: number;
  pending: number;
  inProgress: number;
  solved: number;
}

export const WARD_NUMBERS = Array.from({ length: 25 }, (_, i) => i + 1);

export const COMPLAINT_CATEGORIES: { value: ComplaintCategory; label: string; icon: string }[] = [
  { value: 'road', label: 'Road Damage', icon: '🛣️' },
  { value: 'garbage', label: 'Garbage Issue', icon: '🗑️' },
  { value: 'water', label: 'Water Problem', icon: '💧' },
  { value: 'drainage', label: 'Drainage', icon: '🚰' },
  { value: 'streetlight', label: 'Street Light', icon: '💡' },
  { value: 'other', label: 'Other', icon: '📋' },
];
