import { Outlet } from 'react-router-dom';
import { BottomNav } from '@/components/citizen/BottomNav';

export default function CitizenLayout() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <Outlet />
      <BottomNav />
    </div>
  );
}
