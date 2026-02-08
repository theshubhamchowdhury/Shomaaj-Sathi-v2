import { StatsCard } from '@/components/citizen/StatsCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useComplaints } from '@/contexts/ComplaintsContext';
import { PlusCircle, ArrowRight, MapPin, Phone, Sparkles, Clock, CheckCircle2, Award, User, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { COMPLAINT_CATEGORIES } from '@/types';
import { format } from 'date-fns';

export default function CitizenHome() {
  const { user } = useAuth();
  const { getStats, getComplaintsByUser } = useComplaints();
  const navigate = useNavigate();

  const stats = user ? getStats(user.id) : { total: 0, pending: 0, inProgress: 0, solved: 0 };
  const recentComplaints = user ? getComplaintsByUser(user.id).slice(0, 3) : [];

  // Mock data for Citizen Appreciation (would come from admin in real app)
  const appreciatedCitizens = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=600&fit=crop',
      contribution: 'Reported 15+ civic issues and helped keep Ward 5 clean through consistent monitoring',
      date: new Date('2024-01-15'),
    },
    {
      id: 2,
      name: 'Priya Sharma',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop',
      contribution: 'Actively participated in cleanliness drive and tree plantation initiatives',
      date: new Date('2024-01-20'),
    },
    {
      id: 3,
      name: 'Amit Das',
      image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=800&h=600&fit=crop',
      contribution: 'Helped resolve drainage issues in Ward 8 and organized community cleanup',
      date: new Date('2024-02-01'),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      {/* Greeting Section */}
      <div className="bg-gradient-to-r from-primary to-blue-600 px-4 py-5">
        <div className="max-w-lg mx-auto">
          <p className="text-white/80 text-sm font-medium">Welcome back,</p>
          <h2 className="text-xl font-bold text-white mt-0.5">{user?.name || 'Citizen'}</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-white">
              📍 Ward {user?.wardNumber || '-'}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-white">
              🏛️ Halisahar
            </span>
          </div>
        </div>
      </div>

      <main className="px-4 py-6 space-y-6 max-w-lg mx-auto pb-8">
        {/* Quick Action Card */}
        <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-5 shadow-lg animate-fade-in">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Report an Issue</h3>
              <p className="text-white/70 text-sm">Help improve your ward</p>
            </div>
          </div>
          <Button
            onClick={() => navigate('/citizen/register')}
            className="w-full h-12 bg-white text-primary hover:bg-white/90 font-semibold rounded-xl shadow-md"
            size="lg"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Register New Complaint
          </Button>
        </div>

        {/* Stats Grid */}
        <section className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {/* Eye-Catching Header */}
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-2xl p-4 mb-4 shadow-xl relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/20" />
            <div className="absolute -left-4 -bottom-4 w-16 h-16 rounded-full bg-white/10" />
            
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center animate-pulse">
                  <span className="text-2xl">📋</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">Your Complaints</h2>
                  <p className="text-white/90 text-sm">Track your submitted issues</p>
                </div>
              </div>
              <Button
                onClick={() => navigate('/citizen/complaints')}
                className="bg-white text-orange-600 hover:bg-white/90 font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 rounded-xl"
                size="sm"
              >
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <StatsCard label="Total" value={stats.total} variant="total" />
            <StatsCard label="Solved" value={stats.solved} variant="solved" />
            <StatsCard label="Pending" value={stats.pending} variant="pending" />
            <StatsCard label="In Progress" value={stats.inProgress} variant="progress" />
          </div>
        </section>

        {/* Recent Activity */}
        <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-lg font-bold text-foreground mb-4">Recent Activity</h2>

          {recentComplaints.length > 0 ? (
            <div className="space-y-3">
              {recentComplaints.map((complaint, index) => {
                const category = COMPLAINT_CATEGORIES.find(c => c.value === complaint.category);
                return (
                  <button
                    key={complaint.id}
                    onClick={() => navigate('/citizen/complaints')}
                    className="w-full bg-card rounded-2xl p-4 border border-border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 text-left animate-slide-up"
                    style={{ animationDelay: `${0.1 * index}s` }}
                  >
                    <div className="flex gap-3">
                      {/* Image Preview */}
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={complaint.imageUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="font-semibold text-foreground flex items-center gap-1.5">
                            <span>{category?.icon}</span>
                            {category?.label}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                              complaint.status === 'pending'
                                ? 'bg-amber-100 text-amber-700'
                                : complaint.status === 'in-progress'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {complaint.status === 'solved' && <CheckCircle2 className="w-3 h-3" />}
                            {complaint.status === 'pending' && <Clock className="w-3 h-3" />}
                            {complaint.status === 'in-progress' ? 'In Progress' : complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {complaint.address}
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-1">
                          {format(complaint.createdAt, 'dd MMM yyyy')}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="bg-card rounded-2xl p-8 text-center border border-border shadow-sm">
              <div className="w-16 h-16 mx-auto mb-4 bg-secondary rounded-full flex items-center justify-center">
                <PlusCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium">No complaints yet</p>
              <p className="text-sm text-muted-foreground/70 mt-1">Report issues in your area</p>
              <Button
                onClick={() => navigate('/citizen/register')}
                className="mt-4 rounded-xl"
              >
                Register your first complaint
              </Button>
            </div>
          )}
        </section>

        {/* Citizen Appreciation Section */}
        <section className="bg-gradient-to-br from-amber-50 to-orange-50 -mx-4 px-4 py-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="max-w-lg mx-auto">
            {/* Section Header */}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 text-amber-600" />
                </div>
                <h2 className="text-lg font-bold text-foreground">Citizen Appreciation</h2>
              </div>
              <p className="text-sm text-muted-foreground ml-10">
                Recognizing outstanding citizens who contribute to making our city better
              </p>
            </div>
            
            {/* Cards Container */}
            <div className="flex flex-col gap-4 mt-5">
              {appreciatedCitizens.map((citizen) => (
                <div
                  key={citizen.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all"
                >
                  {/* Image with Badge */}
                  <div className="relative w-full h-48 bg-muted">
                    <img
                      src={citizen.image}
                      alt={citizen.name}
                      className="w-full h-full object-cover"
                    />
                    {/* Appreciated Badge */}
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">⭐</span>
                        <span className="text-xs font-semibold text-amber-600">Appreciated</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-base text-foreground mb-2">{citizen.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                      {citizen.contribution}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{format(citizen.date, 'dd MMM yyyy')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Leadership Section */}
        <section className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="max-w-lg mx-auto">
            {/* Section Header - Centered */}
            <h2 className="text-xl font-bold text-foreground text-center mb-5">Our Leadership</h2>
            
            {/* Leader Card */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all">
              {/* Large Leader Photo */}
              <div className="relative w-full h-72 bg-gradient-to-br from-blue-100 to-indigo-100">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=800&fit=crop"
                  alt="Hon. Ramesh Verma"
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Content Below Image */}
              <div className="p-5">
                {/* Role - Small Uppercase */}
                <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">
                  Member of Legislative Assembly (MLA)
                </p>
                
                {/* Name - Bold */}
                <h3 className="text-xl font-bold text-foreground mb-3">Hon. Ramesh Verma</h3>
                
                {/* Bio Paragraph */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  With over 15 years of dedicated public service, Hon. Ramesh Verma has been instrumental 
                  in bringing transformative development to Halisahar. His vision focuses on infrastructure 
                  modernization, improved civic amenities, and ensuring dignified quality of life for every citizen.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Help Section */}
        <section className="bg-gradient-to-br from-secondary to-secondary/50 rounded-2xl p-5 border border-border/50 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Need Help?</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Contact MLA Office for urgent matters
              </p>
              <a 
                href="tel:+919876543210" 
                className="inline-flex items-center gap-2 mt-2 text-primary font-semibold text-sm hover:underline"
              >
                +91 98765 43210
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
