import { Complaint, COMPLAINT_CATEGORIES } from '@/types';
import { MapPin, Clock, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface ComplaintCardProps {
  complaint: Complaint;
  onClick?: () => void;
}

export function ComplaintCard({ complaint, onClick }: ComplaintCardProps) {
  const category = COMPLAINT_CATEGORIES.find((c) => c.value === complaint.category);

  const statusConfig = {
    pending: {
      label: 'Pending',
      icon: Clock,
      className: 'status-pending',
    },
    'in-progress': {
      label: 'In Progress',
      icon: Loader2,
      className: 'status-progress',
    },
    solved: {
      label: 'Solved',
      icon: CheckCircle2,
      className: 'status-solved',
    },
  };

  const status = statusConfig[complaint.status];
  const StatusIcon = status.icon;

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-card rounded-2xl shadow-card border border-border overflow-hidden transition-all duration-200 hover:shadow-soft active:scale-[0.98] animate-slide-up"
    >
      <div className="flex gap-3 p-3">
        {/* Image */}
        <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-muted">
          <img
            src={complaint.imageUrl}
            alt="Problem"
            className="w-full h-full object-cover"
          />
          {complaint.status === 'solved' && complaint.solutionImageUrl && (
            <div className="absolute inset-0 bg-status-solved/20 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-status-solved" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Category & Status */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="category-badge">
              <span>{category?.icon}</span>
              <span>{category?.label}</span>
            </span>
            <span className={cn('status-badge text-xs', status.className)}>
              <StatusIcon
                className={cn('w-3.5 h-3.5', complaint.status === 'in-progress' && 'animate-spin')}
              />
              {status.label}
            </span>
          </div>

          {/* Address */}
          <div className="flex items-start gap-1.5 text-sm text-foreground">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-muted-foreground" />
            <span className="line-clamp-2">{complaint.address}</span>
          </div>

          {/* Ward & Date */}
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>Ward {complaint.wardNumber}</span>
            <span>{format(complaint.createdAt, 'dd MMM yyyy')}</span>
          </div>

          {/* Solved Message */}
          {complaint.status === 'solved' && (
            <p className="text-xs text-status-solved font-medium mt-2">
              ✓ Your problem has been resolved
            </p>
          )}
        </div>
      </div>
    </button>
  );
}
