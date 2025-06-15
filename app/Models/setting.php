<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
        'type',
        'group',
        'description',
    ];

    protected $casts = [
        'value' => 'array',
    ];

    // Static methods for easy access
    public static function get($key, $default = null)
    {
        $setting = static::where('key', $key)->first();

        if (!$setting) {
            return $default;
        }

        return match($setting->type) {
            'boolean' => (bool) $setting->value['value'] ?? $default,
            'integer' => (int) $setting->value['value'] ?? $default,
            'decimal' => (float) $setting->value['value'] ?? $default,
            'json' => $setting->value ?? $default,
            default => $setting->value['value'] ?? $default,
        };
    }

    public static function set($key, $value, $type = 'string', $group = 'general')
    {
        return static::updateOrCreate(
            ['key' => $key],
            [
                'value' => ['value' => $value],
                'type' => $type,
                'group' => $group,
            ]
        );
    }
}
