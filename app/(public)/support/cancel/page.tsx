import Link from 'next/link'
import PageHero from '../../(component)/PageHero'

export default function DonationCancelPage() {
    return (
        <div className="min-h-screen bg-[#F5F5F3]">
            <PageHero
                imageSrc="/home_bg_photos/2.jpg"
                imageAlt="Donation cancelled"
                title="Payment Cancelled"
                height="40vh"
                overlayOpacity={0.5}
            />

            <section className="max-w-2xl mx-auto px-6 py-20 text-center">
                {/* Cancel icon */}
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>

                <h2 className="text-3xl font-bold text-[#292826] mb-4">
                    Payment was not completed
                </h2>
                <p className="text-lg text-[#292826] opacity-70 mb-10 leading-relaxed">
                    No charge was made. If you changed your mind or ran into an issue, you are always welcome to try again.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/support"
                        className="bg-[#355872] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#7AAACE] transition-colors"
                    >
                        Try Again
                    </Link>
                    <Link
                        href="/"
                        className="bg-white text-[#355872] border-2 border-[#355872] px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                    >
                        Return Home
                    </Link>
                </div>
            </section>
        </div>
    )
}
