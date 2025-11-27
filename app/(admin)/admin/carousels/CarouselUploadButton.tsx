'use client';

import { Plus } from 'lucide-react';
import { createCarouselAction } from '@/lib/actions/carousels.actions';
import { useRef } from 'react';

interface CarouselUploadButtonProps {
    type: 'background' | 'story';
}

export default function CarouselUploadButton({ type }: CarouselUploadButtonProps) {
    const formRef = useRef<HTMLFormElement>(null);

    const handleFileChange = () => {
        formRef.current?.requestSubmit();
    };

    return (
        <form ref={formRef} action={createCarouselAction}>
            <input type="hidden" name="type" value={type} />
            <label className="flex items-center gap-2 px-4 py-2 bg-brown text-white rounded-lg hover:opacity-90 transition-opacity font-medium cursor-pointer">
                <Plus className="w-5 h-5" />
                Add Images
                <input
                    type="file"
                    name="images"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                />
            </label>
        </form>
    );
}
