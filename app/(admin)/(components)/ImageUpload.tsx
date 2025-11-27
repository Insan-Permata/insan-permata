import { Upload, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useState, useRef } from 'react';
import { uploadImageAction } from '@/lib/actions/upload.actions';

type ImageUploadProps = {
    label: string;
    name?: string;
    currentImage?: string;
    folder: string;
    onImageChange?: (file: File | null) => void; // Deprecated, keeping for backward compat if needed temporarily
    onUrlChange?: (url: string) => void;
    onUploadStatusChange?: (isUploading: boolean) => void;
};

export default function ImageUpload({
    label,
    name,
    currentImage,
    folder,
    onUrlChange,
    onUploadStatusChange
}: ImageUploadProps) {
    const [preview, setPreview] = useState<string | null>(currentImage || null);
    const [isUploading, setIsUploading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Show preview immediately
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);

            // Start Upload
            setIsUploading(true);
            onUploadStatusChange?.(true);

            const formData = new FormData();
            formData.append('file', file);
            formData.append('folder', folder);

            try {
                const result = await uploadImageAction(formData);
                if (result.success && result.url) {
                    onUrlChange?.(result.url);
                    // Update the hidden input value if needed, but we'll use a controlled input or just the callback
                } else {
                    console.error('Upload failed:', result.error);
                    alert('Image upload failed. Please try again.');
                    setPreview(null); // Revert preview on failure
                }
            } catch (error) {
                console.error('Upload error:', error);
                alert('Image upload failed.');
                setPreview(null);
            } finally {
                setIsUploading(false);
                onUploadStatusChange?.(false);
            }
        }
    };

    const handleRemove = () => {
        setPreview(null);
        onUrlChange?.('');
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const triggerUpload = () => {
        if (!isUploading) {
            inputRef.current?.click();
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium text-foreground mb-2">
                {label}
            </label>

            {/* Hidden input to store the URL for form submission if name is provided */}
            {name && <input type="hidden" name={name} value={preview || ''} />}

            <input
                ref={inputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
            />

            {preview ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-gray-200">
                    <Image
                        src={preview}
                        alt="Preview"
                        fill
                        className="object-cover"
                    />
                    {isUploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Loader2 className="w-8 h-8 text-white animate-spin" />
                        </div>
                    )}
                    {!isUploading && (
                        <button
                            type="button"
                            onClick={handleRemove}
                            className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>
            ) : (
                <div
                    onClick={triggerUpload}
                    className={`flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-brown transition-colors bg-gray-50 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <div className="flex flex-col items-center justify-center py-6">
                        {isUploading ? (
                            <Loader2 className="w-12 h-12 text-brown animate-spin mb-3" />
                        ) : (
                            <Upload className="w-12 h-12 text-foreground/40 mb-3" />
                        )}
                        <p className="text-sm text-foreground/60 font-medium">
                            {isUploading ? 'Uploading...' : 'Click to upload image'}
                        </p>
                        <p className="text-xs text-foreground/40 mt-1">PNG, JPG up to 10MB</p>
                    </div>
                </div>
            )}
        </div>
    );
}
