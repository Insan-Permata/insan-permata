'use client'

import { useState } from 'react';
import { Upload, Trash2, GripVertical } from 'lucide-react';
import Image from 'next/image';

export default function CarouselsPage() {
    const [backgroundImages, setBackgroundImages] = useState([
        '/home_bg_photos/1.jpg',
        '/home_bg_photos/2.jpg',
        '/home_bg_photos/3.jpg',
        '/home_bg_photos/4.jpg',
    ]);

    const [storyImages, setStoryImages] = useState([
        '/home_story_and_mission_photos/1.jpg',
        '/home_story_and_mission_photos/2.jpg',
        '/home_story_and_mission_photos/3.jpg',
        '/home_story_and_mission_photos/4.jpg',
        '/home_story_and_mission_photos/5.jpg',
        '/home_story_and_mission_photos/6.jpg',
    ]);

    const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            // TODO: Implement upload to Supabase Storage
            console.log('Uploading background images:', files);
        }
    };

    const handleStoryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            // TODO: Implement upload to Supabase Storage
            console.log('Uploading story images:', files);
        }
    };

    const handleDeleteBackground = (index: number) => {
        // TODO: Implement delete from Supabase Storage
        setBackgroundImages(backgroundImages.filter((_, i) => i !== index));
    };

    const handleDeleteStory = (index: number) => {
        // TODO: Implement delete from Supabase Storage
        setStoryImages(storyImages.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground">Carousel Management</h1>
                <p className="text-foreground/60 mt-1">Manage homepage carousel images</p>
            </div>

            {/* Background Carousel Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-foreground">Background Carousel</h2>
                        <p className="text-sm text-foreground/60 mt-1">Hero section background images</p>
                    </div>
                    <label className="flex items-center gap-2 bg-brown text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity cursor-pointer font-medium">
                        <Upload className="w-5 h-5" />
                        Upload Images
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={handleBackgroundUpload}
                        />
                    </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {backgroundImages.map((image, index) => (
                        <div key={index} className="relative group">
                            <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200">
                                <Image
                                    src={image}
                                    alt={`Background ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2">
                                    <button
                                        type="button"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-white rounded-lg hover:bg-gray-100"
                                        title="Reorder"
                                    >
                                        <GripVertical className="w-5 h-5 text-foreground" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteBackground(index)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-red-600 rounded-lg hover:bg-red-700"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-5 h-5 text-white" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-sm text-foreground/60 mt-2 text-center">Image {index + 1}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Story Carousel Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-foreground">Story & Mission Carousel</h2>
                        <p className="text-sm text-foreground/60 mt-1">Our Story section images</p>
                    </div>
                    <label className="flex items-center gap-2 bg-brown text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity cursor-pointer font-medium">
                        <Upload className="w-5 h-5" />
                        Upload Images
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={handleStoryUpload}
                        />
                    </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {storyImages.map((image, index) => (
                        <div key={index} className="relative group">
                            <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-gray-200">
                                <Image
                                    src={image}
                                    alt={`Story ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2">
                                    <button
                                        type="button"
                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-white rounded-lg hover:bg-gray-100"
                                        title="Reorder"
                                    >
                                        <GripVertical className="w-5 h-5 text-foreground" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteStory(index)}
                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-red-600 rounded-lg hover:bg-red-700"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-5 h-5 text-white" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-sm text-foreground/60 mt-2 text-center">Image {index + 1}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
