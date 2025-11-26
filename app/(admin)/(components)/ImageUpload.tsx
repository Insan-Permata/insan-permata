'use client'

import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

type ImageUploadProps = {
    label: string;
    currentImage?: string;
    onImageChange: (file: File | null) => void;
};

export default function ImageUpload({ label, currentImage, onImageChange }: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(currentImage || null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onImageChange(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemove = () => {
        setPreview(null);
        onImageChange(null);
    };

    return (
        <div>
            <label className="block text-sm font-medium text-foreground mb-2">
                {label}
            </label>

            {preview ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-gray-200">
                    <Image
                        src={preview}
                        alt="Preview"
                        fill
                        className="object-cover"
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-brown transition-colors bg-gray-50">
                    <div className="flex flex-col items-center justify-center py-6">
                        <Upload className="w-12 h-12 text-foreground/40 mb-3" />
                        <p className="text-sm text-foreground/60 font-medium">Click to upload image</p>
                        <p className="text-xs text-foreground/40 mt-1">PNG, JPG up to 10MB</p>
                    </div>
                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                    />
                </label>
            )}
        </div>
    );
}
