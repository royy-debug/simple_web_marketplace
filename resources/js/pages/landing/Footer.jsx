export default function Footer() {
    return (
        <footer className="bg-gray-100 py-6 mt-auto border-t">
            <div className="max-w-6xl mx-auto px-4 text-center text-gray-600">
                <p>© {new Date().getFullYear()} Marketplace. All rights reserved.</p>
            </div>
        </footer>
    );
}
