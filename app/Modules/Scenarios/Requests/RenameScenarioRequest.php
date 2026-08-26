<?php

namespace App\Modules\Scenarios\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class RenameScenarioRequest extends FormRequest
{
    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['nullable', 'string', 'max:255'],
        ];
    }

    // An empty string clears the name back to the generic label, same as
    // when it was never set — never persisted as an empty string.
    public function name(): ?string
    {
        return $this->string('name')->toString() ?: null;
    }
}
