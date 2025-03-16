
import React, { useState } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ImageUploaderProps {
  initialImage: string | null;
  onImageChange: (file: File | null) => void;
  previewUrl: string | null;
}

export function ImageUploader({ initialImage, onImageChange, previewUrl }: ImageUploaderProps) {
  return (
    <div className="flex flex-col items-center justify-center mb-2">
      <div className="relative mb-4">
        <Avatar className="h-24 w-24 border-2">
          <AvatarImage src={previewUrl || initialImage || ''} />
          <AvatarFallback>
            <ImageIcon className="h-8 w-8 text-gray-400" />
          </AvatarFallback>
        </Avatar>
      </div>
      <label htmlFor="file-upload" className="cursor-pointer">
        <div className="flex items-center px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
          <Upload className="mr-2 h-4 w-4" />
          <span>Upload Image</span>
        </div>
        <input
          id="file-upload"
          name="file-upload"
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0] || null;
            onImageChange(file);
          }}
        />
      </label>
    </div>
  );
}
