import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const { user, token } = useAuth();
  const { addComplaint } = useComplaints();
  const { latitude, longitude, address, loading: locationLoading, error: locationError, getLocation } = useGeolocation();

  const [images, setImages] = useState<string[]>([]);
  const [category, setCategory] = useState<ComplaintCategory | null>(null);
  const [otherDescription, setOtherDescription] = useState('');
  const [wardNumber, setWardNumber] = useState<string>(user?.wardNumber?.toString() || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error('Please upload at least one image of the problem');
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

    try {
      await addComplaint({
        userId: user?.id || '',
        category,
        otherDescription: category === 'other' ? otherDescription : undefined,
        imageUrl: images[0],
        imageUrls: images,
        latitude,
        longitude,
        address: address || 'Location captured',
        wardNumber: parseInt(wardNumber),
      });
      setShowSuccess(true);
    } catch (error) {
      toast.error('Failed to submit complaint');
    } finally {
      setIsSubmitting(false);
    }
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
              className="w-full h-12 rounded-xl font-semibold"
              size="lg"
            >
              View My Complaints
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/citizen')}
              className="w-full h-12 rounded-xl font-semibold"
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
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      {/* Page Title */}
      <div className="bg-white border-b border-gray-100 px-4 py-4">
        <h1 className="text-xl font-bold text-gray-900 max-w-lg mx-auto">Register Complaint</h1>
      </div>

      <main className="px-4 py-6 max-w-lg mx-auto pb-8">
        <form onSubmit={handleSubmit} className="space-y-6 bg-card rounded-2xl p-5 shadow-lg border border-border animate-fade-in">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className={`w-3 h-3 rounded-full ${images.length > 0 ? 'bg-primary' : 'bg-muted'} transition-colors`} />
            <div className={`w-8 h-0.5 ${address ? 'bg-primary' : 'bg-muted'} transition-colors`} />
            <div className={`w-3 h-3 rounded-full ${address ? 'bg-primary' : 'bg-muted'} transition-colors`} />
            <div className={`w-8 h-0.5 ${wardNumber ? 'bg-primary' : 'bg-muted'} transition-colors`} />
            <div className={`w-3 h-3 rounded-full ${wardNumber ? 'bg-primary' : 'bg-muted'} transition-colors`} />
            <div className={`w-8 h-0.5 ${category ? 'bg-primary' : 'bg-muted'} transition-colors`} />
            <div className={`w-3 h-3 rounded-full ${category ? 'bg-primary' : 'bg-muted'} transition-colors`} />
          </div>
          
          {/* Image Upload */}
          <div className="space-y-3">
            <Label className="text-base font-bold flex items-center gap-2">
              📸 Photos of Problem
              <span className="text-destructive">*</span>
            </Label>
            <ImageUpload value={images} onChange={setImages} token={token || undefined} maxImages={4} />
            <p className="text-xs text-muted-foreground">Upload up to 4 clear photos showing the problem</p>
          </div>

          {/* Location */}
          <div className="space-y-3">
            <Label className="text-base font-bold flex items-center gap-2">
              📍 Location
              <span className="text-destructive">*</span>
            </Label>
            <div className="bg-gradient-to-r from-secondary to-secondary/50 rounded-xl p-4 border border-border/50">
              {locationLoading ? (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                  <span className="font-medium">Getting your location...</span>
                </div>
              ) : locationError ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">{locationError}</span>
                  </div>
                  <Button type="button" variant="outline" onClick={getLocation} size="sm" className="rounded-lg">
                    Try Again
                  </Button>
                </div>
              ) : address ? (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{address}</p>
                    <p className="text-xs text-muted-foreground mt-1 font-mono">
                      📌 {latitude?.toFixed(6)}, {longitude?.toFixed(6)}
                    </p>
                  </div>
                </div>
              ) : (
                <Button type="button" variant="outline" onClick={getLocation} className="rounded-xl">
                  <MapPin className="w-4 h-4 mr-2" />
                  Get Location
                </Button>
              )}
            </div>
          </div>

          {/* Ward Number */}
          <div className="space-y-3">
            <Label className="text-base font-bold flex items-center gap-2">
              🏘️ Ward Number
              <span className="text-destructive">*</span>
            </Label>
            <Select value={wardNumber} onValueChange={setWardNumber}>
              <SelectTrigger className="h-14 rounded-xl bg-secondary/50 border-border/50 font-medium">
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
          <div className="space-y-3">
            <Label className="text-base font-bold flex items-center gap-2">
              📋 Problem Category
              <span className="text-destructive">*</span>
            </Label>
            <CategorySelect value={category} onChange={setCategory} />
          </div>

          {/* Other Description */}
          {category === 'other' && (
            <div className="space-y-3 animate-slide-up">
              <Label className="text-base font-bold flex items-center gap-2">
                ✏️ Describe the Problem
                <span className="text-destructive">*</span>
              </Label>
              <Textarea
                value={otherDescription}
                onChange={(e) => setOtherDescription(e.target.value)}
                placeholder="Please describe your problem in detail..."
                className="min-h-[120px] rounded-xl bg-secondary/50 border-border/50"
              />
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              '🚀 Submit Complaint'
            )}
          </Button>
        </form>
      </main>
    </div>
  );
}
