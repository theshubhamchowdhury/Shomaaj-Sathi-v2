import { cn } from '@/lib/utils';

interface StatsCardProps {
  label: string;
  value: number;
  variant: 'total' | 'pending' | 'progress' | 'solved';
}

export function StatsCard({ label, value, variant }: StatsCardProps) {
  const variants = {
    total: 'bg-primary/10 text-primary border-primary/20',
    pending: 'bg-status-pending-bg text-status-pending border-status-pending/20',
    progress: 'bg-status-progress-bg text-status-progress border-status-progress/20',
    solved: 'bg-status-solved-bg text-status-solved border-status-solved/20',
  };

  return (
    <div
      className={cn(
        'rounded-xl p-4 border animate-fade-in',
        variants[variant]
      )}
    >
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm mt-1 opacity-80">{label}</p>
    </div>
  );
}
