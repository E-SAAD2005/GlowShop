<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SkinProfile extends Model
{
    protected $fillable = [
        'user_id', 'session_token', 'skin_type', 'concerns', 'allergies', 'age_range', 'quiz_version'
    ];

    protected $casts = [
        'concerns' => 'array',
        'allergies' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
