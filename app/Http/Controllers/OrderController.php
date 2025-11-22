<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Display all orders (ADMIN only)
     */
    public function index()
    {
        $orders = Order::with('items.product', 'user')->get();
        return response()->json($orders, 200);
    }

    /**
     * Display orders for authenticated user
     */
    public function myOrders(Request $request)
    {
        $orders = Order::with('items.product')
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json($orders, 200);
    }

    /**
     * Create a new order (multiple items, without payment proof)
     */
    public function createOrder(Request $request)
    {
        $request->validate([
            'items' => 'required|array'
        ]);

        $order = Order::create([
            'user_id' => $request->user()->id,
            'total_price' => 0,
            'status' => 'pending'
        ]);

        $total = 0;

        foreach ($request->items as $item) {
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
     * Store a new order (single product with payment proof)
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'payment_proof' => 'required|image|mimes:jpeg,jpg,png,webp|max:5120',
            'notes' => 'nullable|string|max:500',
        ]);

        $product = Product::findOrFail($request->product_id);
        $totalPrice = $product->price * $request->quantity;

        $paymentPath = $request->file('payment_proof')->store('payments', 'public');

        $order = Order::create([
            'user_id' => $request->user()->id,
            'total_price' => $totalPrice,
            'payment_proof' => $paymentPath,
            'notes' => $request->notes,
            'status' => 'paid'
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'quantity' => $request->quantity,
            'price' => $totalPrice
        ]);

        return response()->json([
            'message' => 'Order created successfully',
            'order' => $order->load('items.product')
        ], 201);
    }

    /**
     * Display a specific order (user only sees their own)
     */
    public function show(Request $request, $id)
    {
        $order = Order::with('items.product', 'user')->findOrFail($id);
        
        if ($order->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($order, 200);
    }

    /**
     * ADMIN: show order detail (admin always allowed)
     */
    public function adminShow($id)
    {
        $order = Order::with('items.product', 'user')->findOrFail($id);
        return response()->json($order, 200);
    }

    /**
     * Upload payment proof
     */
    public function uploadPayment(Request $request, $id)
    {
        $request->validate([
            'payment_proof' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:5120'
        ]);

        $order = Order::findOrFail($id);

        if ($order->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($order->payment_proof && \Storage::disk('public')->exists($order->payment_proof)) {
            \Storage::disk('public')->delete($order->payment_proof);
        }

        $file = $request->file('payment_proof')->store('payments', 'public');

        $order->update([
            'payment_proof' => $file,
            'status' => 'paid'
        ]);

        return response()->json([
            'message' => 'Payment uploaded successfully', 
            'order' => $order->load('items.product')
        ], 200);
    }

    /**
     * Cancel an order
     */
    public function cancel(Request $request, $id)
    {
        $order = Order::findOrFail($id);

        if ($order->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($order->status === 'completed') {
            return response()->json(['message' => 'Cannot cancel completed order'], 400);
        }

        $order->update(['status' => 'canceled']);

        return response()->json([
            'message' => 'Order canceled successfully',
            'order' => $order
        ], 200);
    }

    /**
     * ADMIN: Delete order
     */
    public function destroy($id)
    {
        $order = Order::find($id);

        if (! $order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        $order->delete();

        return response()->json(['message' => 'Order deleted successfully'], 200);
    }
}
