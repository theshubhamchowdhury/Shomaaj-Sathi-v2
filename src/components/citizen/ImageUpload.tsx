import { useState, useRef } from 'react';
import { Camera, Upload, X, Loader2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import axios from 'axios';

interface ImageUploadProps {
  value: string[];
  onChange: (imageUrls: string[]) => void;
  token?: string;
  maxImages?: number;
}

export function ImageUpload({ value = [], onChange, token, maxImages = 4 }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (file: File | null) => {
    if (!file) return;
    if (value.length >= maxImages) {
      alert(`You can only upload up to ${maxImages} images`);
      return;
    }

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
        
        onChange([...value, response.data.url]);
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
        onChange([...value, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    const newImages = value.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileChange(file);
    }
  };

  // Show uploaded images grid
  if (value.length > 0) {
    return (
      <div className="space-y-3">
        {/* Images Grid */}
        <div className="grid grid-cols-2 gap-3">
          {value.map((img, index) => (
            <div key={index} className="relative rounded-xl overflow-hidden bg-muted aspect-square">
              <img src={img} alt={`Upload ${index + 1}`} className="w-full h-full object-contain bg-gray-100" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full shadow-lg hover:bg-destructive/90 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
              <span className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                {index + 1}/{maxImages}
              </span>
            </div>
          ))}
          
          {/* Add More Button - Always show if less than max */}
          {value.length < maxImages && (
            <button
              type="button"
              onClick={() => {
                fileInputRef.current?.removeAttribute('capture');
                fileInputRef.current?.click();
              }}
              className="aspect-square rounded-xl border-2 border-dashed border-primary/50 bg-primary/5 hover:border-primary hover:bg-primary/10 transition-colors flex flex-col items-center justify-center gap-2"
            >
              {isUploading ? (
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              ) : (
                <>
                  <Plus className="w-8 h-8 text-primary" />
                  <span className="text-sm font-medium text-primary">Add More</span>
                </>
              )}
            </button>
          )}
        </div>
        
        <p className="text-xs text-muted-foreground text-center">
          {value.length} of {maxImages} photos uploaded
        </p>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
        />
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
          Upload up to {maxImages} photos of the problem
        </p>
      </div>
    </div>
  );
}
