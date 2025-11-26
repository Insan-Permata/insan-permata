import FooterComponent from "./(component)/FooterComponent";
import HeaderComponent from "./(component)/HeaderComponent";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div >
            <HeaderComponent />
            <main className="flex-1 p-8">
                {children}
            </main>
            <FooterComponent />

        </div>
    );
}
