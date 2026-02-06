import { useState } from 'react';
import { useComplaints } from '@/contexts/ComplaintsContext';
import { useAuth } from '@/contexts/AuthContext';
import { ComplaintStatus, ComplaintCategory, COMPLAINT_CATEGORIES, WARD_NUMBERS, Complaint } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  LayoutDashboard,
  ClipboardList,
  LogOut,
  MapPin,
  Clock,
  CheckCircle2,
  Loader2,
  Filter,
  Search,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { complaints, getStats, updateComplaintStatus } = useComplaints();
  const { logout } = useAuth();

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [filterWard, setFilterWard] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Update form state
  const [newStatus, setNewStatus] = useState<ComplaintStatus>('pending');
  const [solutionImage, setSolutionImage] = useState<string>('');
  const [resolutionNote, setResolutionNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const stats = getStats();

  const filteredComplaints = complaints.filter((c) => {
    if (filterWard !== 'all' && c.wardNumber !== parseInt(filterWard)) return false;
    if (filterCategory !== 'all' && c.category !== filterCategory) return false;
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    if (searchQuery && !c.address.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleUpdateStatus = async () => {
    if (!selectedComplaint) return;
    setIsUpdating(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    updateComplaintStatus(
      selectedComplaint.id,
      newStatus,
      newStatus === 'solved' ? solutionImage || undefined : undefined,
      newStatus === 'solved' ? resolutionNote || undefined : undefined
    );

    setIsUpdating(false);
    setSelectedComplaint(null);
    setSolutionImage('');
    setResolutionNote('');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const category = selectedComplaint
    ? COMPLAINT_CATEGORIES.find((c) => c.value === selectedComplaint.category)
    : null;

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border hidden lg:block">
        <div className="p-6">
          <h1 className="text-xl font-bold text-primary">Admin Panel</h1>
          <p className="text-sm text-muted-foreground">Halisahar Civic Portal</p>
        </div>

        <nav className="px-3 space-y-1">
          <Button variant="secondary" className="w-full justify-start gap-3">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3">
            <ClipboardList className="w-5 h-5" />
            Complaints
          </Button>
        </nav>

        <div className="absolute bottom-6 left-3 right-3">
          <Button variant="outline" className="w-full gap-2" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Manage civic complaints</p>
          </div>
          <Button variant="outline" className="lg:hidden" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-xl p-4 border border-border shadow-card">
            <p className="text-3xl font-bold text-primary">{stats.total}</p>
            <p className="text-sm text-muted-foreground">Total Complaints</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border shadow-card">
            <p className="text-3xl font-bold text-status-pending">{stats.pending}</p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border shadow-card">
            <p className="text-3xl font-bold text-status-progress">{stats.inProgress}</p>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border shadow-card">
            <p className="text-3xl font-bold text-status-solved">{stats.solved}</p>
            <p className="text-sm text-muted-foreground">Solved</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl p-4 border border-border shadow-card mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-muted-foreground" />
            <span className="font-medium">Filters</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterWard} onValueChange={setFilterWard}>
              <SelectTrigger>
                <SelectValue placeholder="All Wards" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Wards</SelectItem>
                {WARD_NUMBERS.map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    Ward {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {COMPLAINT_CATEGORIES.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.icon} {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="solved">Solved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Complaints Table */}
        <div className="bg-card rounded-xl border border-border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">Image</th>
                  <th className="text-left p-4 font-medium">Category</th>
                  <th className="text-left p-4 font-medium">Address</th>
                  <th className="text-left p-4 font-medium">Ward</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Date</th>
                  <th className="text-left p-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map((complaint) => {
                  const cat = COMPLAINT_CATEGORIES.find((c) => c.value === complaint.category);
                  return (
                    <tr key={complaint.id} className="border-t border-border hover:bg-muted/30">
                      <td className="p-4">
                        <img
                          src={complaint.imageUrl}
                          alt="Problem"
                          className="w-16 h-12 object-cover rounded-lg"
                        />
                      </td>
                      <td className="p-4">
                        <span className="category-badge">
                          {cat?.icon} {cat?.label}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                          <span className="text-sm max-w-[200px] truncate">{complaint.address}</span>
                        </div>
                      </td>
                      <td className="p-4">Ward {complaint.wardNumber}</td>
                      <td className="p-4">
                        <span
                          className={cn(
                            'status-badge',
                            complaint.status === 'pending' && 'status-pending',
                            complaint.status === 'in-progress' && 'status-progress',
                            complaint.status === 'solved' && 'status-solved'
                          )}
                        >
                          {complaint.status === 'pending' && <Clock className="w-3.5 h-3.5" />}
                          {complaint.status === 'in-progress' && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                          {complaint.status === 'solved' && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {complaint.status === 'in-progress' ? 'In Progress' : complaint.status}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {format(complaint.createdAt, 'dd MMM yyyy')}
                      </td>
                      <td className="p-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedComplaint(complaint);
                            setNewStatus(complaint.status);
                          }}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredComplaints.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No complaints found matching the filters
            </div>
          )}
        </div>
      </main>

      {/* Complaint Detail Dialog */}
      <Dialog open={!!selectedComplaint} onOpenChange={() => setSelectedComplaint(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedComplaint && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className="text-2xl">{category?.icon}</span>
                  {category?.label} Complaint
                </DialogTitle>
              </DialogHeader>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column - Info */}
                <div className="space-y-4">
                  <div className="rounded-xl overflow-hidden">
                    <img
                      src={selectedComplaint.imageUrl}
                      alt="Problem"
                      className="w-full aspect-video object-cover"
                    />
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">Location</span>
                      <div className="flex items-start gap-2 mt-1">
                        <MapPin className="w-4 h-4 mt-0.5 text-primary" />
                        <div>
                          <p className="font-medium">{selectedComplaint.address}</p>
                          <p className="text-xs text-muted-foreground">
                            GPS: {selectedComplaint.latitude.toFixed(6)}, {selectedComplaint.longitude.toFixed(6)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Ward</span>
                        <p className="font-medium">Ward {selectedComplaint.wardNumber}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Submitted</span>
                        <p className="font-medium">{format(selectedComplaint.createdAt, 'dd MMM yyyy')}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Update */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Update Status</h3>

                  <div className="space-y-4">
                    <Select
                      value={newStatus}
                      onValueChange={(v) => setNewStatus(v as ComplaintStatus)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">🟡 Pending</SelectItem>
                        <SelectItem value="in-progress">🔵 In Progress</SelectItem>
                        <SelectItem value="solved">🟢 Solved</SelectItem>
                      </SelectContent>
                    </Select>

                    {newStatus === 'solved' && (
                      <>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Solution Image URL (optional)</label>
                          <Input
                            placeholder="https://example.com/after-image.jpg"
                            value={solutionImage}
                            onChange={(e) => setSolutionImage(e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Resolution Note (optional)</label>
                          <Textarea
                            placeholder="Describe the solution..."
                            value={resolutionNote}
                            onChange={(e) => setResolutionNote(e.target.value)}
                          />
                        </div>
                      </>
                    )}

                    <Button
                      className="w-full"
                      onClick={handleUpdateStatus}
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        'Update Status'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
