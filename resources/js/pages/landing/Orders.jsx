import React, { useState } from 'react';
try {
// Example: await postJSON('/orders', form);
await new Promise(r => setTimeout(r, 700)); // mock
setMsg('Pesanan berhasil dikirim (mock).');
} catch (err) {
setMsg('Terjadi kesalahan: ' + err.message);
} finally {
setLoading(false);
}



return (
<div className="container mx-auto px-4 py-20">
<h2 className="text-3xl font-bold mb-6 text-center">Form Pemesanan</h2>


<form onSubmit={submit} className="max-w-lg mx-auto p-6 border rounded-lg">
<label className="block mb-4">
<div className="text-sm text-gray-700">Nama</div>
<Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
</label>


<label className="block mb-4">
<div className="text-sm text-gray-700">Produk</div>
<select className="mt-1 p-2 border rounded w-full" value={form.product} onChange={e => setForm({ ...form, product: e.target.value })}>
<option value="">Pilih produk</option>
<option value="Produk A">Produk A</option>
<option value="Produk B">Produk B</option>
</select>
</label>


<label className="block mb-6">
<div className="text-sm text-gray-700">Jumlah</div>
<Input type="number" min="1" value={form.qty} onChange={e => setForm({ ...form, qty: Number(e.target.value) })} />
</label>


<button className="w-full bg-blue-600 text-white py-2 rounded" disabled={loading}>
{loading ? 'Memproses...' : 'Pesan Sekarang'}
</button>


{msg && <div className="mt-4 text-center text-sm text-gray-700">{msg}</div>}
</form>
</div>
);
