import PageHero from '../(component)/PageHero';
import DonationForm from './DonationForm';
import { createClient } from '@/lib/utils/supabase/server';

export default async function SupportPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-[#F5F5F3]">
      {/* Hero Section */}
      <PageHero
        imageSrc="/home_bg_photos/2.jpg"
        imageAlt="Support Insan Permata"
        title="Support Our Mission"
        height="60vh"
        overlayOpacity={0.5}
      />

      {/* Introduction Section */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <DonationForm accountEmail={user?.email} />

        {/* Other Ways to Support */}
        <div className="mb-16">
          <h2 className="text-3xl font-normal tracking-tight text-[#292826] text-center mb-8">
            Other Ways to Support
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm text-center">
              <div className="w-16 h-16 bg-[#355872] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#292826] mb-3">Volunteer Your Time</h3>
              <p className="text-[#292826] opacity-70 mb-4">
                Share your skills and time with our children. Tutoring, mentoring, or helping with activities.
              </p>
              <a href="/contact" className="text-[#355872] font-medium underline hover:no-underline">
                Learn More
              </a>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm text-center">
              <div className="w-16 h-16 bg-[#355872] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#292826] mb-3">Donate Goods</h3>
              <p className="text-[#292826] opacity-70 mb-4">
                Clothing, books, toys, and other items are always welcome and appreciated.
              </p>
              <a href="/contact" className="text-[#355872] font-medium underline hover:no-underline">
                Contact Us
              </a>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm text-center">
              <div className="w-16 h-16 bg-[#355872] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#292826] mb-3">Spread the Word</h3>
              <p className="text-[#292826] opacity-70 mb-4">
                Share our mission with friends and family. Every voice helps raise awareness.
              </p>
              <a href="/contact" className="text-[#355872] font-medium underline hover:no-underline">
                Get Involved
              </a>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-lg p-8 md:p-12 shadow-sm">
          <h2 className="text-3xl font-normal tracking-tight text-[#292826] text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6 max-w-3xl mx-auto">
            <div>
              <h3 className="text-lg font-semibold text-[#292826] mb-2">
                Who processes my donation?
              </h3>
              <p className="text-[#292826] opacity-70">
                Donations are received and processed by Acts Ministries International (AMI), a U.S. 501(c)(3) nonprofit based in Anaheim, California. AMI raises funds for, and grants them in support of, Panti Asuhan Insan Permata in Indonesia. AMI retains full discretion and control over how contributed funds are used.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#292826] mb-2">
                Is my donation tax-deductible?
              </h3>
              <p className="text-[#292826] opacity-70">
                For U.S. taxpayers, donations to AMI are generally tax-deductible to the extent allowed by law (AMI&apos;s EIN appears on your receipt and statement). Once your donor account is set up, you can log in and generate your year-end contribution statement directly from your account. Please consult your tax advisor for your specific situation.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#292826] mb-2">
                How will I know my donation is being used properly?
              </h3>
              <p className="text-[#292826] opacity-70">
                All donations are processed, managed, and disbursed by AMI. Donors receive access to our private news section, where we share frequent updates and stories from the children and daily life at Insan Permata.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#292826] mb-2">
                Can I visit the orphanage?
              </h3>
              <p className="text-[#292826] opacity-70">
                Yes! We welcome visitors. Please contact us in advance to schedule a visit so we can
                ensure the best experience for both you and our children.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
