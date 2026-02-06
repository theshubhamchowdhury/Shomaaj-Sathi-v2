import { Header } from '@/components/citizen/Header';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, LogOut } from 'lucide-react';

export default function CitizenProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div>
      <Header title="Profile" />

      <main className="px-4 -mt-4 space-y-6 max-w-lg mx-auto">
        {/* Profile Card */}
        <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
              <User className="w-8 h-8 text-secondary-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{user?.name}</h2>
              <p className="text-muted-foreground">Citizen</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
              <Phone className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Mobile Number</p>
                <p className="font-medium">{user?.mobile}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl">
              <MapPin className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Ward Number</p>
                <p className="font-medium">Ward {user?.wardNumber}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
          <h3 className="font-semibold mb-3">Contact MLA Office</h3>
          <p className="text-sm text-muted-foreground mb-4">
            For urgent matters or inquiries, you can contact the MLA office directly.
          </p>
          <Button variant="outline" className="w-full gap-2">
            <Phone className="w-4 h-4" />
            +91 98765 43210
          </Button>
        </div>

        {/* Logout */}
        <Button
          variant="destructive"
          onClick={handleLogout}
          className="w-full h-12 gap-2 rounded-xl"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>
      </main>
    </div>
  );
}
