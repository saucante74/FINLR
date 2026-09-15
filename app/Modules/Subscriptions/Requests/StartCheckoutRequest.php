<?php

namespace App\Modules\Subscriptions\Requests;

use App\Modules\Subscriptions\Enums\BillingPeriod;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StartCheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'period' => ['required', Rule::enum(BillingPeriod::class)],
        ];
    }

    public function period(): BillingPeriod
    {
        return BillingPeriod::from($this->string('period')->toString());
    }
}
