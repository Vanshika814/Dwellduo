<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserPreference extends Model
{
    protected $fillable = [
        'user_id',
        'budget',
        'preferred_location',
        'cleanliness_level',
        'lifestyle',
        'sleeping_schedule',
        'pet_friendly',
        'smoking',
        'drinking',
        'hobbies',
    ];

    protected $casts = [
        'pet_friendly' => 'boolean',
        'smoking' => 'boolean',
        'drinking' => 'boolean',
        'cleanliness_level' => 'integer',
        'budget' => 'integer',
    ];

    /**
     * Get the user that owns the preferences.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
