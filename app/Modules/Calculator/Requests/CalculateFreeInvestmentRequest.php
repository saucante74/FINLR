<?php

namespace App\Modules\Calculator\Requests;

use App\Modules\Calculator\DTOs\FreeCalculationInput;
use Illuminate\Foundation\Http\FormRequest;

class CalculateFreeInvestmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'initial_capital' => ['required', 'numeric', 'min:0'],
            'monthly_contribution' => ['required', 'numeric', 'min:0'],
            'annual_rate' => ['required', 'numeric'],
            'years' => ['required', 'integer', 'min:0', 'max:100'],
            'wrapper_fee' => ['required', 'numeric', 'min:0'],
            'fund_fee' => ['required', 'numeric', 'min:0'],
            'tax_rate' => ['required', 'numeric', 'min:0', 'max:100'],
            'inflation_rate' => ['required', 'numeric'],
            'inflation_enabled' => ['required', 'boolean'],
        ];
    }

    public function toDto(): FreeCalculationInput
    {
        return new FreeCalculationInput(
            initialCapital: $this->float('initial_capital'),
            monthlyContribution: $this->float('monthly_contribution'),
            annualRate: $this->float('annual_rate'),
            years: $this->integer('years'),
            wrapperFee: $this->float('wrapper_fee'),
            fundFee: $this->float('fund_fee'),
            taxRate: $this->float('tax_rate'),
            inflationRate: $this->float('inflation_rate'),
            inflationEnabled: $this->boolean('inflation_enabled'),
        );
    }
}
