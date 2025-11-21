<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
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

        return response()->json($query->get());
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
        'data' => $product
    ]);
}


    // Tampilkan detail product
    public function show($id)
    {
        return Product::with('category')->findOrFail($id);
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
            'image' => 'somtimes|image',
            'description' => 'sometimes|string',
        ]);

        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('products', 'public');
        } elseif ($request->has('image')) {
            $validated['image'] = $request->image;
        }

        $product->update($validated);

        return response()->json([
            'message' => 'Product successfully updated',
            'data' => $product
        ], 200);
    }

    // Delete product
    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json(['message' => 'Product successfully deleted'], 200);
    }
}
