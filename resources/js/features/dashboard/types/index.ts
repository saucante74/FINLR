export type CalculatorType = 'single_envelope';

export interface ScenarioSummary {
    id: number;
    calculatorType: CalculatorType;
    headlineFigure: number;
    createdAt: string | null;
}

export interface DashboardPageProps {
    scenarios: ScenarioSummary[];
}
