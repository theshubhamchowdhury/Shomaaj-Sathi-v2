import { Header } from '@/components/citizen/Header';
import { StatsCard } from '@/components/citizen/StatsCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useComplaints } from '@/contexts/ComplaintsContext';
import { PlusCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CitizenHome() {
  const { user } = useAuth();
  const { getStats, getComplaintsByUser } = useComplaints();
  const navigate = useNavigate();

  const stats = user ? getStats(user.id) : { total: 0, pending: 0, inProgress: 0, solved: 0 };
  const recentComplaints = user ? getComplaintsByUser(user.id).slice(0, 2) : [];

  return (
    <div>
      <Header showGreeting />

      <main className="px-4 -mt-4 space-y-6 max-w-lg mx-auto">
        {/* Quick Action */}
        <Button
          onClick={() => navigate('/citizen/register')}
          className="w-full h-14 text-lg gap-3 rounded-2xl shadow-soft"
          size="lg"
        >
          <PlusCircle className="w-6 h-6" />
          Register New Complaint
        </Button>

        {/* Stats */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Your Complaints</h2>
          <div className="grid grid-cols-2 gap-3">
            <StatsCard label="Total" value={stats.total} variant="total" />
            <StatsCard label="Solved" value={stats.solved} variant="solved" />
            <StatsCard label="Pending" value={stats.pending} variant="pending" />
            <StatsCard label="In Progress" value={stats.inProgress} variant="progress" />
          </div>
        </section>

        {/* Quick Links */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/citizen/complaints')}
              className="text-primary gap-1"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {recentComplaints.length > 0 ? (
            <div className="space-y-3">
              {recentComplaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className="bg-card rounded-xl p-4 border border-border shadow-card"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium capitalize">
                      {complaint.category.replace('-', ' ')}
                    </span>
                    <span
                      className={`status-badge text-xs ${
                        complaint.status === 'pending'
                          ? 'status-pending'
                          : complaint.status === 'in-progress'
                          ? 'status-progress'
                          : 'status-solved'
                      }`}
                    >
                      {complaint.status === 'in-progress' ? 'In Progress' : complaint.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                    {complaint.address}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-card rounded-xl p-6 text-center border border-border">
              <p className="text-muted-foreground">No complaints yet</p>
              <Button
                variant="link"
                onClick={() => navigate('/citizen/register')}
                className="mt-2"
              >
                Register your first complaint
              </Button>
            </div>
          )}
        </section>

        {/* Help Section */}
        <section className="bg-secondary rounded-2xl p-4">
          <h3 className="font-semibold text-secondary-foreground">Need Help?</h3>
          <p className="text-sm text-secondary-foreground/70 mt-1">
            Contact MLA Office: +91 98765 43210
          </p>
        </section>
      </main>
    </div>
  );
}
