<?php

namespace App\Modules\Calculator\Controllers;

use App\Modules\Calculator\Actions\CalculateFreeInvestmentAction;
use App\Modules\Calculator\Requests\CalculateFreeInvestmentRequest;
use App\Modules\Calculator\Support\CalculatorPageProps;
use App\Modules\Shared\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class CalculateFreeInvestmentController extends Controller
{
    public function __invoke(CalculateFreeInvestmentRequest $request, CalculateFreeInvestmentAction $action): Response
    {
        return Inertia::render('Calculator', [
            ...CalculatorPageProps::base(),
            'freeResult' => $action->handle($request->toDto()),
        ]);
    }
}
