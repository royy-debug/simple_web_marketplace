<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {   
        // filter untuk kategori
        $query = Product::query();
        if ($request->has('category')){
            $query->where('categories_id', $request->category);
        }  
        // filter untuk harga
        if ($request->has('price')){
            $query->where('price',$request->price);
        }
        if ($request->has('search')){
            $query->where('name','like','%'.$request->search.'%');
        }
        return response()->json($query->get());
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
  public function store(Request $request)
{
    // Validasi semua field
    $validated = $request->validate([
        'name' => 'required|string',
        'categories_id' => 'required|integer|exists:categories,id',
        'price' => 'required|integer',
        'stock' => 'required|integer',
        'image' => 'required', // bisa file atau URL
        'description' => 'required|string',
    ]);

    // Tangani image: file upload atau URL
    if ($request->hasFile('image')) {
        $imagePath = $request->file('image')->store('products', 'public');
    } else {
        $imagePath = $request->image; // URL string
    }

    // Buat product
    $product = Product::create([
        'name' => $validated['name'],
        'categories_id' => $validated['categories_id'],
        'price' => $validated['price'],
        'stock' => $validated['stock'],
        'image' => $imagePath,
        'description' => $validated['description']
    ]);

    return response()->json([
        'message' => 'Product successfully added',
        'data' => $product
    ], 200);
}




    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Product::with('category')->findOrFail($id);
    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product, $id)
    {

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
{
    $product = Product::findOrFail($id);

    $validate = $request->validate([
        'name'=> 'sometimes|string',
        'categories_id'=> 'sometimes|integer|exists:categories,id',
        'price'=> 'sometimes|integer',
        'stock'=> 'sometimes|integer',
        'image'=> 'sometimes', // bisa file atau string
        'description'=>'sometimes|string'
    ]);

    if ($request->hasFile('image')) {
        $imagePath = $request->file('image')->store('products', 'public');
        $validate['image'] = $imagePath;
    } elseif ($request->has('image')) {
        $validate['image'] = $request->image; // URL string
    }

    $product->update($validate);

    return response()->json([
        'message'=> 'Product successfully updated',
        'data'=> $product
    ], 200);
}



    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $product = Product::findOrFail(($id));
        $product->delete();
        return response()->json(['message' => 'Product Successfully Deleted'], 200);
    }


}

