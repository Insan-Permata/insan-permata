'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, X } from 'lucide-react';
import ImageUpload from '../../../(components)/ImageUpload';

export default function NewChildPage() {
    const router = useRouter();
    const [interests, setInterests] = useState<string[]>([]);
    const [currentInterest, setCurrentInterest] = useState('');
    const [photoFile, setPhotoFile] = useState<File | null>(null);

    const handleAddInterest = () => {
        if (currentInterest.trim() && !interests.includes(currentInterest.trim())) {
            setInterests([...interests, currentInterest.trim()]);
            setCurrentInterest('');
        }
    };

    const handleRemoveInterest = (interest: string) => {
        setInterests(interests.filter(i => i !== interest));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // TODO: Implement create functionality with Supabase
        const formData = new FormData(e.currentTarget);
        console.log('Form data:', Object.fromEntries(formData));
        console.log('Interests:', interests);
        console.log('Photo:', photoFile);

        // Redirect back to children list
        router.push('/admin/children');
    };

    return (
        <div className="max-w-3xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/children"
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Add New Child</h1>
                    <p className="text-foreground/60 mt-1">Create a new child profile</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                {/* Name */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                        Name <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown focus:border-transparent"
                        placeholder="Enter child's name"
                    />
                </div>

                {/* Date of Birth */}
                <div>
                    <label htmlFor="dob" className="block text-sm font-medium text-foreground mb-2">
                        Date of Birth <span className="text-red-600">*</span>
                    </label>
                    <input
                        type="date"
                        id="dob"
                        name="date_of_birth"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown focus:border-transparent"
                    />
                </div>

                {/* Gender */}
                <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-foreground mb-2">
                        Gender <span className="text-red-600">*</span>
                    </label>
                    <select
                        id="gender"
                        name="gender"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown focus:border-transparent"
                    >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>

                {/* Educational Stage */}
                <div>
                    <label htmlFor="educational_stage" className="block text-sm font-medium text-foreground mb-2">
                        Educational Stage
                    </label>
                    <select
                        id="educational_stage"
                        name="educational_stage"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown focus:border-transparent"
                    >
                        <option value="-">-</option>
                        <option value="playgroup">Playgroup</option>
                        <option value="kindergarten">Kindergarten</option>
                        <option value="elementary">Elementary</option>
                        <option value="middle_school">Middle School</option>
                        <option value="high_school">High School</option>
                        <option value="college">College</option>
                    </select>
                </div>

                {/* Interests */}
                <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                        Interests
                    </label>
                    <div className="flex gap-2 mb-3">
                        <input
                            type="text"
                            value={currentInterest}
                            onChange={(e) => setCurrentInterest(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInterest())}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown focus:border-transparent"
                            placeholder="Add an interest"
                        />
                        <button
                            type="button"
                            onClick={handleAddInterest}
                            className="px-4 py-2 bg-brown text-white rounded-lg hover:opacity-90 transition-opacity"
                        >
                            <Plus className="w-5 h-5" />
                        </button>
                    </div>
                    {interests.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {interests.map((interest) => (
                                <span
                                    key={interest}
                                    className="inline-flex items-center gap-2 bg-brown/10 text-brown px-3 py-1 rounded-full text-sm"
                                >
                                    {interest}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveInterest(interest)}
                                        className="hover:text-brown/70"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Story */}
                <div>
                    <label htmlFor="story" className="block text-sm font-medium text-foreground mb-2">
                        Story
                    </label>
                    <textarea
                        id="story"
                        name="story"
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown focus:border-transparent resize-none"
                        placeholder="Tell us about this child..."
                    />
                </div>

                {/* Bible Verse */}
                <div>
                    <label htmlFor="bible_verse" className="block text-sm font-medium text-foreground mb-2">
                        Bible Verse
                    </label>
                    <textarea
                        id="bible_verse"
                        name="bible_verse"
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown focus:border-transparent resize-none"
                        placeholder="Favorite Bible verse..."
                    />
                </div>

                {/* Photo Upload */}
                <ImageUpload
                    label="Photo"
                    onImageChange={setPhotoFile}
                />

                {/* Joined Date */}
                <div>
                    <label htmlFor="joined_date" className="block text-sm font-medium text-foreground mb-2">
                        Joined Date
                    </label>
                    <input
                        type="date"
                        id="joined_date"
                        name="joined_date"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown focus:border-transparent"
                    />
                </div>

                {/* Form Actions */}
                <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                    <Link
                        href="/admin/children"
                        className="px-6 py-2 border border-gray-300 rounded-lg text-foreground hover:bg-gray-50 transition-colors font-medium"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-brown text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                    >
                        Create Child
                    </button>
                </div>
            </form>
        </div>
    );
}
