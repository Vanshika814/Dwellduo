<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UserMatch extends Model
{
    protected $fillable = [
        'user1_id',
        'user2_id',
        'compatibility_score',
        'status',
    ];

    protected $attributes = [
        'status' => 'pending',
    ];

    protected $casts = [
        'compatibility_score' => 'float',
    ];

    /**
     * Get the first user in the match.
     */
    public function user1()
    {
        return $this->belongsTo(User::class, 'user1_id');
    }

    /**
     * Get the second user in the match.
     */
    public function user2()
    {
        return $this->belongsTo(User::class, 'user2_id');
    }

    /**
     * Get all messages for this match.
     */
    public function messages(): HasMany
    {
        return $this->hasMany(Message::class, 'match_id');
    }
}
