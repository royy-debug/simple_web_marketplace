export default function Hero() {
    return (
        <section className="bg-white py-24">
            <div className="container mx-auto text-center">
                <h1 className="text-5xl font-bold mb-6">
                    Selamat Datang di Produk Kami
                </h1>

                <p className="text-gray-600 text-lg mb-8">
                    Platform modern untuk menampilkan produk terbaik Anda.
                </p>

                <div className="flex gap-4 justify-center">
                    <a href="/login" className="px-6 py-3 bg-blue-600 text-white rounded-lg">
                        Login
                    </a>
                    <a href="/register" className="px-6 py-3 bg-gray-200 text-black rounded-lg">
                        Register
                    </a>
                </div>
            </div>
        </section>
    );
}
