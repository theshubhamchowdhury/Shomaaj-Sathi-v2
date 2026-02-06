import { useState, useRef } from 'react';
import { Camera, Upload, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import axios from 'axios';

interface ImageUploadProps {
  value: string | null;
  onChange: (imageUrl: string | null) => void;
  token?: string;
}

export function ImageUpload({ value, onChange, token }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (file: File | null) => {
    if (!file) return;

    if (token) {
      // Upload to Cloudinary
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        
        onChange(response.data.url);
      } catch (error) {
        console.error('Upload failed:', error);
        alert('Failed to upload image. Please try again.');
      } finally {
        setIsUploading(false);
      }
    } else {
      // Fallback to base64 if no token
      const reader = new FileReader();
      reader.onload = (e) => {
        onChange(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileChange(file);
    }
  };

  if (value) {
    return (
      <div className="relative rounded-2xl overflow-hidden bg-muted aspect-video">
        <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
        <button
          type="button"
          onClick={() => onChange(null)}
          className="absolute top-2 right-2 p-2 bg-destructive text-destructive-foreground rounded-full shadow-lg hover:bg-destructive/90 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  if (isUploading) {
    return (
      <div className="border-2 border-dashed rounded-2xl p-8 text-center border-primary bg-secondary">
        <Loader2 className="w-10 h-10 mx-auto animate-spin text-primary" />
        <p className="text-sm text-muted-foreground mt-4">Uploading image...</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'border-2 border-dashed rounded-2xl p-8 text-center transition-colors',
        isDragging ? 'border-primary bg-secondary' : 'border-border'
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
      />

      <div className="space-y-4">
        <div className="flex justify-center gap-4">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="gap-2"
            onClick={() => {
              fileInputRef.current?.setAttribute('capture', 'environment');
              fileInputRef.current?.click();
            }}
          >
            <Camera className="w-5 h-5" />
            Camera
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="gap-2"
            onClick={() => {
              fileInputRef.current?.removeAttribute('capture');
              fileInputRef.current?.click();
            }}
          >
            <Upload className="w-5 h-5" />
            Gallery
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Take a photo or upload from gallery
        </p>
      </div>
    </div>
  );
}
