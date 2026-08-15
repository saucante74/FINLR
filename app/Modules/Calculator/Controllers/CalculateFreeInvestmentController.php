<?php

namespace App\Modules\Calculator\Controllers;

use App\Modules\Calculator\Actions\CalculateFreeInvestmentAction;
use App\Modules\Calculator\Requests\CalculateFreeInvestmentRequest;
use App\Modules\Shared\Controllers\Controller;
use Illuminate\Http\JsonResponse;

class CalculateFreeInvestmentController extends Controller
{
    public function __invoke(CalculateFreeInvestmentRequest $request, CalculateFreeInvestmentAction $action): JsonResponse
    {
        return response()->json($action->handle($request->toDto()));
    }
}
