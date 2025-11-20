<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'categories_id',
        'price',
        'stock',
        'image',
        'description'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'categories_id');
    }
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

}
