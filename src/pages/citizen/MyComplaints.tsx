import { useState } from 'react';
import { Header } from '@/components/citizen/Header';
import { ComplaintCard } from '@/components/citizen/ComplaintCard';
import { useAuth } from '@/contexts/AuthContext';
import { useComplaints } from '@/contexts/ComplaintsContext';
import { ComplaintStatus, COMPLAINT_CATEGORIES } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MapPin, Clock, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function MyComplaints() {
  const { user } = useAuth();
  const { getComplaintsByUser } = useComplaints();
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [filter, setFilter] = useState<ComplaintStatus | 'all'>('all');

  const complaints = user ? getComplaintsByUser(user.id) : [];
  const filteredComplaints = filter === 'all' 
    ? complaints 
    : complaints.filter((c) => c.status === filter);

  const selectedComplaint = complaints.find((c) => c.id === selectedComplaintId);
  const category = selectedComplaint 
    ? COMPLAINT_CATEGORIES.find((c) => c.value === selectedComplaint.category)
    : null;

  const filters: { value: ComplaintStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'solved', label: 'Solved' },
  ];

  return (
    <div>
      <Header title="My Complaints" />

      <main className="px-4 -mt-4 space-y-4 max-w-lg mx-auto pb-8">
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          {filters.map((f) => (
            <Button
              key={f.value}
              variant={filter === f.value ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f.value)}
              className="flex-shrink-0 rounded-full"
            >
              {f.label}
            </Button>
          ))}
        </div>

        {/* Complaints List */}
        {filteredComplaints.length > 0 ? (
          <div className="space-y-3">
            {filteredComplaints.map((complaint) => (
              <ComplaintCard
                key={complaint.id}
                complaint={complaint}
                onClick={() => setSelectedComplaintId(complaint.id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-2xl p-8 text-center border border-border">
            <p className="text-muted-foreground">
              {filter === 'all'
                ? 'No complaints found'
                : `No ${filter} complaints`}
            </p>
          </div>
        )}
      </main>

      {/* Complaint Detail Dialog */}
      <Dialog open={!!selectedComplaint} onOpenChange={() => setSelectedComplaintId(null)}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
          {selectedComplaint && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className="text-2xl">{category?.icon}</span>
                  {category?.label}
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                {/* Problem Image */}
                <div className="rounded-xl overflow-hidden">
                  <img
                    src={selectedComplaint.imageUrl}
                    alt="Problem"
                    className="w-full aspect-video object-cover"
                  />
                </div>

                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <span
                    className={cn(
                      'status-badge',
                      selectedComplaint.status === 'pending' && 'status-pending',
                      selectedComplaint.status === 'in-progress' && 'status-progress',
                      selectedComplaint.status === 'solved' && 'status-solved'
                    )}
                  >
                    {selectedComplaint.status === 'pending' && <Clock className="w-4 h-4" />}
                    {selectedComplaint.status === 'in-progress' && <Clock className="w-4 h-4 animate-spin" />}
                    {selectedComplaint.status === 'solved' && <CheckCircle2 className="w-4 h-4" />}
                    {selectedComplaint.status === 'in-progress' ? 'In Progress' : selectedComplaint.status}
                  </span>
                </div>

                {/* Location */}
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">Location</span>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-1 text-primary" />
                    <div>
                      <p className="font-medium">{selectedComplaint.address}</p>
                      <p className="text-xs text-muted-foreground">Ward {selectedComplaint.wardNumber}</p>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Submitted</span>
                    <p className="font-medium">{format(selectedComplaint.createdAt, 'dd MMM yyyy')}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Last Updated</span>
                    <p className="font-medium">{format(selectedComplaint.updatedAt, 'dd MMM yyyy')}</p>
                  </div>
                </div>

                {/* Solution (if solved) */}
                {selectedComplaint.status === 'solved' && (
                  <div className="bg-status-solved-bg rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-2 text-status-solved font-semibold">
                      <CheckCircle2 className="w-5 h-5" />
                      Problem Resolved
                    </div>
                    {selectedComplaint.resolutionNote && (
                      <p className="text-sm">{selectedComplaint.resolutionNote}</p>
                    )}
                    {selectedComplaint.solutionImageUrl && (
                      <div className="rounded-lg overflow-hidden">
                        <img
                          src={selectedComplaint.solutionImageUrl}
                          alt="Solution"
                          className="w-full aspect-video object-cover"
                        />
                        <p className="text-xs text-center py-2 bg-white/50">After Solution</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
