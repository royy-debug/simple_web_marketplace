<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Display a listing of orders
     */
    public function index()
    {
        $orders = Order::with('items.product', 'user')->get(); // load relasi
        return response()->json($orders, 200);
    }

    /**
     * Create a new order
     */
    public function createOrder(Request $request)
    {
        $request->validate([
            'items' => 'required|array'
        ]);

        // Buat order
        $order = Order::create([
            'user_id' => $request->user()->id, // perbaiki id() -> id
            'total_price' => 0,
            'status' => 'pending'
        ]);

        $total = 0;

        foreach ($request->items as $item) { // perbaiki $request->item -> $request->items
            $product = Product::findOrFail($item['product_id']);
            $price = $product->price * $item['quantity'];
            $total += $price;

            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'quantity' => $item['quantity'],
                'price' => $price
            ]);
        }

        $order->update(['total_price' => $total]);

        return response()->json([
            'message' => 'Order created successfully',
            'order' => $order->load('items.product')
        ], 201);
    }

    /**
     * Upload payment proof
     */
    public function uploadPayment(Request $request, $id)
    {
        $request->validate([
            'payment_proof' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048'
        ]);

        $order = Order::findOrFail($id);

        $file = $request->file('payment_proof')->store('payments', 'public');

        $order->update([
            'payment_proof' => $file,
            'status' => 'paid'
        ]);

        return response()->json(['message' => 'Payment uploaded successfully', 'order' => $order], 200);
    }
}
