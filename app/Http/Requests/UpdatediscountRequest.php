<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class UpdatediscountRequest extends FormRequest
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
            'name' => 'required|string|max:255',
            'code' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('discounts', 'code')->ignore($this->discount->id)
            ],
            'description' => 'nullable|string',
            'type' => 'required|in:percentage,fixed,buy_one_get_one',
            'value' => 'required|numeric|min:0',
            'minimum_amount' => 'nullable|numeric|min:0',
            'maximum_discount' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'is_active' => 'boolean',
            'starts_at' => 'required|date',
            'expires_at' => 'required|date|after:starts_at',
            'products' => 'nullable|array',
            'products.*' => 'exists:products,id',
        ];
    }
     public function messages(): array
    {
        return [
            'name.required' => 'Nama diskon harus diisi.',
            'code.unique' => 'Kode diskon sudah digunakan.',
            'type.required' => 'Tipe diskon harus dipilih.',
            'value.required' => 'Nilai diskon harus diisi.',
            'starts_at.required' => 'Tanggal mulai harus diisi.',
            'expires_at.required' => 'Tanggal berakhir harus diisi.',
            'expires_at.after' => 'Tanggal berakhir harus setelah tanggal mulai.',
        ];
    }
}
