<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    // Helper: Convert image path to full URL
    private function formatProduct($product)
    {
        if ($product->image && !str_starts_with($product->image, 'http')) {
            $product->image = asset('storage/' . $product->image);
        }
        return $product;
    }

    // Tampilkan semua product (public)
    public function index(Request $request)
    {
        $query = Product::query();

        if ($request->has('category')) {
            $query->where('categories_id', $request->category);
        }
        if ($request->has('price')) {
            $query->where('price', $request->price);
        }
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $products = $query->get()->map(fn($p) => $this->formatProduct($p));

        return response()->json($products);
    }

    // Simpan product baru
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'categories_id' => 'required|integer|exists:categories,id',
            'price' => 'required|integer',
            'stock' => 'required|integer',
            'description' => 'required|string',
            'image' => 'required|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        $imagePath = $request->file('image')->store('products', 'public');

        $product = Product::create([
            'name' => $validated['name'],
            'categories_id' => $validated['categories_id'],
            'price' => $validated['price'],
            'stock' => $validated['stock'],
            'description' => $validated['description'],
            'image' => $imagePath,
        ]);

        return response()->json([
            'message' => 'Product successfully added',
            'data' => $this->formatProduct($product)
        ]);
    }

    // Tampilkan detail product
    public function show($id)
    {
        $product = Product::with('category')->findOrFail($id);
        return $this->formatProduct($product);
    }

    // Update product
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string',
            'categories_id' => 'sometimes|integer|exists:categories,id',
            'price' => 'sometimes|integer',
            'stock' => 'sometimes|integer',
            'image' => 'sometimes|image',
            'description' => 'sometimes|string',
        ]);

        if ($request->hasFile('image')) {
            // Hapus gambar lama jika ada
            if ($product->image && Storage::disk('public')->exists($product->image)) {
                Storage::disk('public')->delete($product->image);
            }
            $validated['image'] = $request->file('image')->store('products', 'public');
        }

        $product->update($validated);

        return response()->json([
            'message' => 'Product successfully updated',
            'data' => $this->formatProduct($product)
        ], 200);
    }

    // Delete product
    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        
        // Hapus gambar dari storage
        if ($product->image && Storage::disk('public')->exists($product->image)) {
            Storage::disk('public')->delete($product->image);
        }
        
        $product->delete();

        return response()->json(['message' => 'Product successfully deleted'], 200);
    }
}