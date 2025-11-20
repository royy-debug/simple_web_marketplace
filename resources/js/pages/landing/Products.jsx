export default function Products() {
    return (
        <div className="container mx-auto py-20">
            <h2 className="text-4xl font-bold mb-10 text-center">Produk Kami</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-6 shadow rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">Produk 1</h3>
                    <p className="text-gray-600 mb-4">Deskripsi singkat produk...</p>
                    <a href="/orders" className="text-blue-600 font-medium">Order Sekarang →</a>
                </div>

                <div className="p-6 shadow rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">Produk 2</h3>
                    <p className="text-gray-600 mb-4">Deskripsi singkat produk...</p>
                    <a href="/orders" className="text-blue-600 font-medium">Order Sekarang →</a>
                </div>

                <div className="p-6 shadow rounded-lg">
                    <h3 className="text-xl font-semibold mb-2">Produk 3</h3>
                    <p className="text-gray-600 mb-4">Deskripsi singkat produk...</p>
                    <a href="/orders" className="text-blue-600 font-medium">Order Sekarang →</a>
                </div>
            </div>
        </div>
    );
}
