import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Products = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('/api/products') // ambil semua produk
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <section id="products" className="py-20 px-6 md:px-20 text-center bg-gray-50">
      <h2 className="text-3xl font-bold mb-12">Produk Terbaru</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {products.map(product => (
          <div key={product.id} className="bg-white border rounded-lg p-4 hover:shadow-lg transition">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover mb-4 rounded"
            />
            <h3 className="font-semibold mb-1">{product.name}</h3>
            <p className="text-blue-600 font-bold">Rp {product.price}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Products;
