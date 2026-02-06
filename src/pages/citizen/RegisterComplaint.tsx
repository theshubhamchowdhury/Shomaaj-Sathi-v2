import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/citizen/Header';
import { ImageUpload } from '@/components/citizen/ImageUpload';
import { CategorySelect } from '@/components/citizen/CategorySelect';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useAuth } from '@/contexts/AuthContext';
import { useComplaints } from '@/contexts/ComplaintsContext';
import { ComplaintCategory, WARD_NUMBERS } from '@/types';
import { MapPin, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function RegisterComplaint() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addComplaint } = useComplaints();
  const { latitude, longitude, address, loading: locationLoading, error: locationError, getLocation } = useGeolocation();

  const [image, setImage] = useState<string | null>(null);
  const [category, setCategory] = useState<ComplaintCategory | null>(null);
  const [otherDescription, setOtherDescription] = useState('');
  const [wardNumber, setWardNumber] = useState<string>(user?.wardNumber.toString() || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!image) {
      toast.error('Please upload an image of the problem');
      return;
    }

    if (!category) {
      toast.error('Please select a category');
      return;
    }

    if (!latitude || !longitude) {
      toast.error('Location is required. Please enable GPS.');
      return;
    }

    if (!wardNumber) {
      toast.error('Please select your ward number');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    addComplaint({
      userId: user?.id || 'user-1',
      category,
      otherDescription: category === 'other' ? otherDescription : undefined,
      imageUrl: image,
      latitude,
      longitude,
      address: address || 'Location captured',
      wardNumber: parseInt(wardNumber),
    });

    setIsSubmitting(false);
    setShowSuccess(true);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-6 animate-scale-in">
          <div className="w-20 h-20 mx-auto bg-status-solved-bg rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-status-solved" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Success!</h1>
            <p className="text-muted-foreground mt-2">
              Your complaint has been successfully submitted.
            </p>
          </div>
          <div className="space-y-3">
            <Button
              onClick={() => navigate('/citizen/complaints')}
              className="w-full"
              size="lg"
            >
              View My Complaints
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/citizen')}
              className="w-full"
              size="lg"
            >
              Go to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Register Complaint" />

      <main className="px-4 -mt-4 max-w-lg mx-auto pb-8">
        <form onSubmit={handleSubmit} className="space-y-6 bg-card rounded-2xl p-4 shadow-card border border-border">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Photo of Problem *</Label>
            <ImageUpload value={image} onChange={setImage} />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Location *</Label>
            <div className="bg-secondary rounded-xl p-4">
              {locationLoading ? (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Getting your location...</span>
                </div>
              ) : locationError ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm">{locationError}</span>
                  </div>
                  <Button type="button" variant="outline" onClick={getLocation} size="sm">
                    Try Again
                  </Button>
                </div>
              ) : address ? (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">{address}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      GPS: {latitude?.toFixed(6)}, {longitude?.toFixed(6)}
                    </p>
                  </div>
                </div>
              ) : (
                <Button type="button" variant="outline" onClick={getLocation}>
                  <MapPin className="w-4 h-4 mr-2" />
                  Get Location
                </Button>
              )}
            </div>
          </div>

          {/* Ward Number */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Ward Number *</Label>
            <Select value={wardNumber} onValueChange={setWardNumber}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Select your ward" />
              </SelectTrigger>
              <SelectContent>
                {WARD_NUMBERS.map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    Ward {num}
                  </SelectItem>
                ))
                }
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-base font-semibold">Problem Category *</Label>
            <CategorySelect value={category} onChange={setCategory} />
          </div>

          {/* Other Description */}
          {category === 'other' && (
            <div className="space-y-2 animate-fade-in">
              <Label className="text-base font-semibold">Describe the Problem *</Label>
              <Textarea
                value={otherDescription}
                onChange={(e) => setOtherDescription(e.target.value)}
                placeholder="Please describe your problem in detail..."
                className="min-h-[100px] rounded-xl"
              />
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-14 text-lg rounded-2xl"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Complaint'
            )}
          </Button>
        </form>
      </main>
    </div>
  );
}
