<?php

// File: app/Http/Requests/StoreProductRequest.php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProductRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Adjust based on your authorization logic
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'category_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:products,slug'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
            'gallery' => ['nullable', 'array'],
            'gallery.*' => ['image', 'mimes:jpeg,png,jpg,gif', 'max:2048'],
            'status' => ['required', Rule::in(['available', 'unavailable', 'out_of_stock'])],
            'stock' => ['nullable', 'integer', 'min:0'],
            'min_stock' => ['nullable', 'integer', 'min:0'],
            'is_discountable' => ['boolean'],
            'is_featured' => ['boolean'],
            'preparation_time' => ['required', 'integer', 'min:1'],
            'cost_price' => ['nullable', 'numeric', 'min:0'],
            'ingredients' => ['nullable', 'array'],
            'ingredients.*' => ['string', 'max:255'],
            'allergens' => ['nullable', 'array'],
            'allergens.*' => ['string', 'max:255'],
            'calories' => ['nullable', 'integer', 'min:0'],
            'is_spicy' => ['boolean'],
            'is_vegetarian' => ['boolean'],
            'is_vegan' => ['boolean'],
            'sort_order' => ['integer', 'min:0'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'category_id.required' => 'Kategori produk harus dipilih.',
            'category_id.exists' => 'Kategori yang dipilih tidak valid.',
            'name.required' => 'Nama produk harus diisi.',
            'name.max' => 'Nama produk tidak boleh lebih dari 255 karakter.',
            'slug.unique' => 'Slug produk sudah digunakan.',
            'price.required' => 'Harga produk harus diisi.',
            'price.numeric' => 'Harga produk harus berupa angka.',
            'price.min' => 'Harga produk tidak boleh kurang dari 0.',
            'image.image' => 'File yang diupload harus berupa gambar.',
            'image.mimes' => 'Format gambar harus jpeg, png, jpg, atau gif.',
            'image.max' => 'Ukuran gambar tidak boleh lebih dari 2MB.',
            'gallery.array' => 'Gallery harus berupa array gambar.',
            'gallery.*.image' => 'Setiap file gallery harus berupa gambar.',
            'gallery.*.mimes' => 'Format gambar gallery harus jpeg, png, jpg, atau gif.',
            'gallery.*.max' => 'Ukuran setiap gambar gallery tidak boleh lebih dari 2MB.',
            'status.required' => 'Status produk harus dipilih.',
            'status.in' => 'Status produk tidak valid.',
            'stock.integer' => 'Stok harus berupa angka bulat.',
            'stock.min' => 'Stok tidak boleh kurang dari 0.',
            'min_stock.integer' => 'Minimum stok harus berupa angka bulat.',
            'min_stock.min' => 'Minimum stok tidak boleh kurang dari 0.',
            'preparation_time.required' => 'Waktu persiapan harus diisi.',
            'preparation_time.integer' => 'Waktu persiapan harus berupa angka bulat.',
            'preparation_time.min' => 'Waktu persiapan minimal 1 menit.',
            'cost_price.numeric' => 'Harga pokok harus berupa angka.',
            'cost_price.min' => 'Harga pokok tidak boleh kurang dari 0.',
            'calories.integer' => 'Kalori harus berupa angka bulat.',
            'calories.min' => 'Kalori tidak boleh kurang dari 0.',
            'sort_order.integer' => 'Urutan harus berupa angka bulat.',
            'sort_order.min' => 'Urutan tidak boleh kurang dari 0.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_discountable' => $this->boolean('is_discountable'),
            'is_featured' => $this->boolean('is_featured'),
            'is_spicy' => $this->boolean('is_spicy'),
            'is_vegetarian' => $this->boolean('is_vegetarian'),
            'is_vegan' => $this->boolean('is_vegan'),
        ]);
    }
}
