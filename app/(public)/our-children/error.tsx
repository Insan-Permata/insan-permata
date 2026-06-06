'use client'

export default function OurChildrenError() {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center px-6">
                <h1 className="text-2xl font-semibold text-foreground mb-2">Something went wrong</h1>
                <p className="text-foreground/60">Unable to load the children profiles. Please try again later.</p>
            </div>
        </div>
    )
}
