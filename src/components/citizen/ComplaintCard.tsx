import { Complaint, COMPLAINT_CATEGORIES } from '@/types';
import { MapPin, Clock, CheckCircle2, Loader2, Calendar } from 'lucide-react';
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
      bgClass: 'bg-amber-100 text-amber-700 border-amber-200',
      dotClass: 'bg-amber-500',
      progressColor: 'bg-amber-400',
      progress: 33
    },
    'in-progress': {
      label: 'In Progress',
      icon: Loader2,
      bgClass: 'bg-blue-100 text-blue-700 border-blue-200',
      dotClass: 'bg-blue-500',
      progressColor: 'bg-blue-500',
      progress: 66
    },
    solved: {
      label: 'Solved',
      icon: CheckCircle2,
      bgClass: 'bg-green-100 text-green-700 border-green-200',
      dotClass: 'bg-green-500',
      progressColor: 'bg-green-500',
      progress: 100
    },
  };

  const status = statusConfig[complaint.status];
  const StatusIcon = status.icon;

  return (
    <div className="w-full bg-card rounded-2xl shadow-md border-2 border-border overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/50 active:scale-[0.98] group">
      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-muted relative overflow-hidden">
        <div
          className={cn('h-full transition-all duration-500', status.progressColor)}
          style={{ width: `${status.progress}%` }}
        />
      </div>
      
      <button
        onClick={onClick}
        className="w-full text-left p-4"
      >
      <div className="flex gap-4">
        {/* Image */}
        <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-muted ring-2 ring-border/50 group-hover:ring-primary/30 transition-all">
          <img
            src={complaint.imageUrl}
            alt="Problem"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {complaint.imageUrls && complaint.imageUrls.length > 1 && (
            <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded-md font-medium">
              +{complaint.imageUrls.length - 1}
            </div>
          )}
          {complaint.status === 'solved' && (
            <div className="absolute inset-0 bg-green-500/30 backdrop-blur-[1px] flex items-center justify-center">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Category & Status */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 bg-secondary text-secondary-foreground px-2.5 py-1 rounded-lg text-xs font-semibold">
              <span className="text-sm">{category?.icon}</span>
              <span>{category?.label}</span>
            </span>
            <span className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border',
              status.bgClass
            )}>
              <span className={cn('w-1.5 h-1.5 rounded-full', status.dotClass, complaint.status === 'in-progress' && 'animate-pulse')} />
              {status.label}
            </span>
          </div>

          {/* Address */}
          <div className="flex items-start gap-1.5 text-sm text-foreground mb-2">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
            <span className="line-clamp-2 font-medium">{complaint.address}</span>
          </div>

          {/* Ward & Date */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 bg-muted px-2 py-0.5 rounded-md font-medium">
              Ward {complaint.wardNumber}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {format(complaint.createdAt, 'dd MMM yyyy')}
            </span>
          </div>

          {/* Solved Message */}
          {complaint.status === 'solved' && (
            <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-md">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Problem resolved successfully
            </div>
          )}
        </div>
      </div>
      </button>
      
      {/* Track Button */}
      <div className="px-4 pb-4">
        <button
          onClick={onClick}
          className={cn(
            'w-full py-2.5 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2',
            complaint.status === 'pending' && 'bg-amber-500 hover:bg-amber-600 text-white shadow-md hover:shadow-lg',
            complaint.status === 'in-progress' && 'bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg',
            complaint.status === 'solved' && 'bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg'
          )}
        >
          <StatusIcon className={cn('w-4 h-4', complaint.status === 'in-progress' && 'animate-spin')} />
          View Details & Track
        </button>
      </div>
    </div>
  );
}
