<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Builder;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'category_id',
        'name',
        'slug',
        'description',
        'price',
        'image',
        'gallery',
        'status',
        'stock',
        'min_stock',
        'is_discountable',
        'is_featured',
        'preparation_time',
        'cost_price',
        'ingredients',
        'allergens',
        'calories',
        'is_spicy',
        'is_vegetarian',
        'is_vegan',
        'sort_order',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'cost_price' => 'decimal:2',
        'gallery' => 'array',
        'ingredients' => 'array',
        'allergens' => 'array',
        'is_discountable' => 'boolean',
        'is_featured' => 'boolean',
        'is_spicy' => 'boolean',
        'is_vegetarian' => 'boolean',
        'is_vegan' => 'boolean',
        'stock' => 'integer',
        'min_stock' => 'integer',
        'preparation_time' => 'integer',
        'calories' => 'integer',
        'sort_order' => 'integer',
        'sold_count' => 'integer',
        'views' => 'integer',
    ];

    // Relationships
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function transactionItems(): HasMany
    {
        return $this->hasMany(transaction_items::class);
    }

    public function discounts(): BelongsToMany
    {
        return $this->belongsToMany(Discount::class, 'discount_products');
    }

    // Scopes
    public function scopeAvailable($query)
    {
        return $query->where('status', 'available');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeInStock($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('stock')
                ->orWhere('stock', '>', 0);
        });
    }

    public function scopeDiscountable($query)
    {
        return $query->where('is_discountable', true);
    }

    // Accessors
    public function getIsInStockAttribute()
    {
        return $this->stock === null || $this->stock > 0;
    }

    public function getIsLowStockAttribute()
    {
        return $this->stock !== null &&
            $this->stock <= $this->min_stock &&
            $this->stock > 0;
    }

    public function getStatusLabelAttribute()
    {
        return match ($this->status) {
            'available' => 'Tersedia',
            'unavailable' => 'Tidak Tersedia',
            'out_of_stock' => 'Habis',
            default => 'Unknown'
        };
    }

    public function getProfitMarginAttribute()
    {
        if (!$this->cost_price || $this->cost_price == 0) {
            return null;
        }

        return (($this->price - $this->cost_price) / $this->cost_price) * 100;
    }

    public function getFormattedPriceAttribute()
    {
        return 'Rp ' . number_format($this->price, 0, ',', '.');
    }

    public function scopePopular(Builder $query)
    {
        return $query->orderByDesc('sold_count')
                    ->orderByDesc('views');
    }

}
