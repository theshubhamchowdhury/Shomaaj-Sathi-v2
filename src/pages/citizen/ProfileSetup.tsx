import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Camera, MapPin, User, Contact, Loader2, CheckCircle2 } from 'lucide-react';
import { WARD_NUMBERS } from '@/types';
import axios from 'axios';

export default function ProfileSetup() {
  const { user, updateProfile, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingAadhar, setUploadingAadhar] = useState(false);
  
  const photoInputRef = useRef<HTMLInputElement>(null);
  const aadharInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    mobile: '',
    address: '',
    wardNumber: '',
    photo: '',
    aadharPhoto: '',
  });

  const uploadImage = async (file: File, type: 'photo' | 'aadhar') => {
    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    if (type === 'photo') setUploadingPhoto(true);
    else setUploadingAadhar(true);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`, formDataUpload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (type === 'photo') {
        setFormData(prev => ({ ...prev, photo: response.data.url }));
      } else {
        setFormData(prev => ({ ...prev, aadharPhoto: response.data.url }));
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      if (type === 'photo') setUploadingPhoto(false);
      else setUploadingAadhar(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file, 'photo');
    }
  };

  const handleAadharChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadImage(file, 'aadhar');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.photo || !formData.aadharPhoto) {
      alert('Please upload both profile photo and Aadhar card photo');
      return;
    }

    if (!formData.wardNumber) {
      alert('Please select your ward number');
      return;
    }

    setLoading(true);
    try {
      await updateProfile({
        ...formData,
        wardNumber: parseInt(formData.wardNumber)
      });
      navigate('/');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Complete Your Profile</h1>
          <p className="text-muted-foreground">We need a few more details to verify your account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>All fields are required for verification</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    className="pl-10"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <div className="relative">
                  <Input
                    id="mobile"
                    type="tel"
                    className="pl-3"
                    placeholder="Enter your 10-digit mobile number"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    pattern="[0-9]{10}"
                    maxLength={10}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Residential Address</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="address"
                    className="pl-10 min-h-[100px]"
                    placeholder="Enter your complete address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Ward Number</Label>
                <Select
                  value={formData.wardNumber}
                  onValueChange={(v) => setFormData({ ...formData, wardNumber: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your ward" />
                  </SelectTrigger>
                  <SelectContent>
                    {WARD_NUMBERS.map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        Ward {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label>Profile Photo</Label>
                  <div 
                    className="border-2 border-dashed rounded-xl p-4 text-center space-y-2 hover:bg-muted/50 transition-colors cursor-pointer relative overflow-hidden"
                    onClick={() => photoInputRef.current?.click()}
                  >
                    {formData.photo ? (
                      <div className="relative">
                        <img src={formData.photo} alt="Profile" className="w-full h-32 object-cover rounded-lg" />
                        <CheckCircle2 className="absolute top-2 right-2 h-6 w-6 text-green-500" />
                      </div>
                    ) : uploadingPhoto ? (
                      <Loader2 className="h-8 w-8 mx-auto text-primary animate-spin" />
                    ) : (
                      <>
                        <Camera className="h-8 w-8 mx-auto text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Click to upload photo</p>
                      </>
                    )}
                    <Input 
                      ref={photoInputRef}
                      type="file" 
                      accept="image/*"
                      className="hidden" 
                      onChange={handlePhotoChange}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Aadhar Card Photo</Label>
                  <div 
                    className="border-2 border-dashed rounded-xl p-4 text-center space-y-2 hover:bg-muted/50 transition-colors cursor-pointer relative overflow-hidden"
                    onClick={() => aadharInputRef.current?.click()}
                  >
                    {formData.aadharPhoto ? (
                      <div className="relative">
                        <img src={formData.aadharPhoto} alt="Aadhar" className="w-full h-32 object-cover rounded-lg" />
                        <CheckCircle2 className="absolute top-2 right-2 h-6 w-6 text-green-500" />
                      </div>
                    ) : uploadingAadhar ? (
                      <Loader2 className="h-8 w-8 mx-auto text-primary animate-spin" />
                    ) : (
                      <>
                        <Contact className="h-8 w-8 mx-auto text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">Click to upload Aadhar Card</p>
                      </>
                    )}
                    <Input 
                      ref={aadharInputRef}
                      type="file" 
                      accept="image/*"
                      className="hidden" 
                      onChange={handleAadharChange}
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full h-12 text-lg" disabled={loading || uploadingPhoto || uploadingAadhar}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Submit for Verification"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
