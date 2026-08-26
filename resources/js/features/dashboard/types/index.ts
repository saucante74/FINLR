export type CalculatorType = 'single_envelope';

export interface ScenarioSummary {
    id: number;
    calculatorType: CalculatorType;
    headlineFigure: number;
    createdAt: string | null;
    // Mirrors the backend DTO's plain `string`: legacy scenarios may carry
    // an empty string, or (historically) a wrapper no longer offered.
    wrapper: string;
    years: number;
    name: string | null;
}

export interface DashboardPageProps {
    scenarios: ScenarioSummary[];
}
