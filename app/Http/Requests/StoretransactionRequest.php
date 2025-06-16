<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
class StoretransactionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */

    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'payment_method' => 'required|in:COD,Midtrans,Dummy',
            'payment_status' => 'nullable|in:belum_dibayar,dibayar,batal',
            'tax_amount' => 'nullable|numeric|min:0',
            'paid_amount' => 'nullable|numeric|min:0',
            'customer_name' => 'nullable|string|max:255',
            'table_number' => 'nullable|string|max:50',
            'notes' => 'nullable|string',
            'discount_code' => 'nullable|string|exists:discounts,code',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.notes' => 'nullable|string',
        ];
    }
    public function messages(): array
    {
        return [
            'payment_method.required' => 'Metode pembayaran harus dipilih.',
            'items.required' => 'Minimal harus ada 1 item.',
            'items.*.product_id.required' => 'Produk harus dipilih.',
            'items.*.product_id.exists' => 'Produk tidak valid.',
            'items.*.quantity.required' => 'Jumlah harus diisi.',
            'items.*.quantity.min' => 'Jumlah minimal 1.',
            'discount_code.exists' => 'Kode diskon tidak valid.',
        ];
    }

}
