import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { Phone, Shield, Loader2 } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [role, setRole] = useState<UserRole>('citizen');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (mobile.length !== 10) return;
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    setStep('otp');
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) return;
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    login(mobile, role);
    setLoading(false);
    navigate(role === 'admin' ? '/admin' : '/citizen');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="gradient-header text-primary-foreground px-4 py-8 text-center">
        <div className="w-16 h-16 mx-auto bg-primary-foreground/20 rounded-2xl flex items-center justify-center mb-4">
          <Shield className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold">Halisahar Civic Portal</h1>
        <p className="text-primary-foreground/80 mt-2">Report and track local problems</p>
      </div>

      {/* Login Form */}
      <div className="flex-1 px-4 py-8 max-w-md mx-auto w-full">
        <Tabs value={role} onValueChange={(v) => setRole(v as UserRole)} className="mb-6">
          <TabsList className="grid w-full grid-cols-2 h-12">
            <TabsTrigger value="citizen" className="text-base">
              Citizen
            </TabsTrigger>
            <TabsTrigger value="admin" className="text-base">
              Admin
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="bg-card rounded-2xl p-6 shadow-card border border-border">
          {step === 'mobile' ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Welcome</h2>
                <p className="text-muted-foreground mt-1">
                  Enter your mobile number to continue
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    +91
                  </span>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="98765 43210"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="pl-12 h-12 rounded-xl text-lg"
                  />
                </div>
              </div>

              <Button
                onClick={handleSendOTP}
                disabled={mobile.length !== 10 || loading}
                className="w-full h-12 rounded-xl text-lg"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Phone className="w-5 h-5 mr-2" />
                    Send OTP
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold">Verify OTP</h2>
                <p className="text-muted-foreground mt-1">
                  Enter the 6-digit code sent to +91 {mobile}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp">OTP Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="h-12 rounded-xl text-center text-2xl tracking-widest"
                />
              </div>

              <p className="text-sm text-center text-muted-foreground">
                For demo, enter any 6 digits
              </p>

              <Button
                onClick={handleVerifyOTP}
                disabled={otp.length !== 6 || loading}
                className="w-full h-12 rounded-xl text-lg"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Verify & Login'
                )}
              </Button>

              <Button
                variant="ghost"
                onClick={() => setStep('mobile')}
                className="w-full"
              >
                Change Number
              </Button>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>A initiative by</p>
          <p className="font-semibold text-foreground">MLA Office, Halisahar</p>
        </div>
      </div>
    </div>
  );
}
