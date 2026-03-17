import Link from 'next/link'
import PageHero from '../../(component)/PageHero'

export default function DonationSuccessPage() {
    return (
        <div className="min-h-screen bg-[#F5F5F3]">
            <PageHero
                imageSrc="/home_bg_photos/2.jpg"
                imageAlt="Thank you for your donation"
                title="Thank You!"
                height="40vh"
                overlayOpacity={0.5}
            />

            <section className="max-w-2xl mx-auto px-6 py-20 text-center">
                {/* Success icon */}
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h2 className="text-3xl font-bold text-[#292826] mb-4">
                    Your donation was received!
                </h2>
                <p className="text-lg text-[#292826] opacity-70 mb-4 leading-relaxed">
                    Thank you so much for your generosity. Your support directly impacts the lives of the children at Panti Asuhan Insan Permata.
                </p>
                <p className="text-[#292826] opacity-60 mb-10">
                    We will send login details to the email address you provided, so you can access our private supporter page.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="bg-[#355872] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#7AAACE] transition-colors"
                    >
                        Return Home
                    </Link>
                    <Link
                        href="/support"
                        className="bg-white text-[#355872] border-2 border-[#355872] px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                    >
                        Donate Again
                    </Link>
                </div>
            </section>
        </div>
    )
}
