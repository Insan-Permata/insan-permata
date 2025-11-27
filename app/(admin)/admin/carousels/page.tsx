import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import { getAllCarousels } from '@/lib/repositories/carousels.repository';
import { deleteCarouselAction } from '@/lib/actions/carousels.actions';
import CarouselUploadButton from './CarouselUploadButton';

export const dynamic = 'force-dynamic';

export default async function CarouselsPage() {
    const carousels = await getAllCarousels();
    const backgroundImages = carousels.filter(c => c.type === 'background');
    const storyImages = carousels.filter(c => c.type === 'story');

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-foreground">Carousels</h1>
                <p className="text-foreground/60 mt-1">Manage homepage carousel images</p>
            </div>

            {/* Background Carousel Section */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground">Background Carousel</h2>
                    <CarouselUploadButton type="background" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {backgroundImages.map((image) => (
                        <div key={image.id} className="group relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                            <Image
                                src={image.image_url}
                                alt="Carousel Image"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <form action={deleteCarouselAction.bind(null, image.id)}>
                                    <button
                                        type="submit"
                                        className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    ))}
                    {backgroundImages.length === 0 && (
                        <div className="col-span-full py-12 text-center text-foreground/40 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                            No background images. Add some to get started.
                        </div>
                    )}
                </div>
            </section>

            {/* Story Carousel Section */}
            <section className="space-y-4 pt-8 border-t border-gray-200">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-foreground">Story Carousel</h2>
                    <CarouselUploadButton type="story" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {storyImages.map((image) => (
                        <div key={image.id} className="group relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                            <Image
                                src={image.image_url}
                                alt="Story Image"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <form action={deleteCarouselAction.bind(null, image.id)}>
                                    <button
                                        type="submit"
                                        className="p-3 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </form>
                            </div>
                        </div>
                    ))}
                    {storyImages.length === 0 && (
                        <div className="col-span-full py-12 text-center text-foreground/40 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                            No story images. Add some to get started.
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
