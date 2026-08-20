<?php

namespace App\Modules\Scenarios\Models;

use App\Modules\Scenarios\Enums\CalculatorType;
use App\Modules\User\Models\User;
use Database\Factories\ScenarioFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['user_id', 'calculator_type', 'input_payload', 'result_payload', 'engine_version'])]
class Scenario extends Model
{
    /** @use HasFactory<ScenarioFactory> */
    use HasFactory;

    protected static function newFactory(): ScenarioFactory
    {
        return ScenarioFactory::new();
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'calculator_type' => CalculatorType::class,
            'input_payload' => 'array',
            'result_payload' => 'array',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
