<?php

namespace App\Modules\SingleEnvelopeSimulator\Requests;

use App\Modules\SimulationEngine\DTOs\CalculationInputData;
use App\Modules\SimulationEngine\Enums\TaxWrapper;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RunSingleEnvelopeSimulationRequest extends FormRequest
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
            'initialCapital' => ['required', 'numeric', 'min:0'],
            'monthlyContribution' => ['required', 'numeric', 'min:0'],
            'annualRate' => ['required', 'numeric', 'min:0', 'max:100'],
            'years' => ['required', 'integer', 'min:1', 'max:60'],
            'wrapperFee' => ['required', 'numeric', 'min:0', 'max:100'],
            'fundFee' => ['required', 'numeric', 'min:0', 'max:100'],
            'taxRate' => ['required', 'numeric', 'min:0', 'max:100'],
            'inflationRate' => ['required', 'numeric', 'min:0', 'max:100'],
            'inflationEnabled' => ['required', 'boolean'],
            'wrapper' => ['required', Rule::enum(TaxWrapper::class)],
        ];
    }

    public function toData(): CalculationInputData
    {
        return new CalculationInputData(
            initialCapital: $this->float('initialCapital'),
            monthlyContribution: $this->float('monthlyContribution'),
            annualRate: $this->float('annualRate'),
            years: $this->integer('years'),
            wrapperFee: $this->float('wrapperFee'),
            fundFee: $this->float('fundFee'),
            taxRate: $this->float('taxRate'),
            inflationRate: $this->float('inflationRate'),
            inflationEnabled: $this->boolean('inflationEnabled'),
            wrapper: TaxWrapper::from($this->string('wrapper')->toString()),
        );
    }
}
