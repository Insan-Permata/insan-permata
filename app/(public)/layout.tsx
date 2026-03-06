import FooterComponent from "./(component)/FooterComponent";
import HeaderComponent from "./(component)/HeaderComponent";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <HeaderComponent />
            {children}
            <FooterComponent />
        </div>
    );
}
