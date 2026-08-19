import {
    COMPACT_CURRENCY_FRACTION_DIGITS,
    CURRENCY,
    CURRENCY_FRACTION_DIGITS,
    FALLBACK_LOCALE,
} from '@/features/freemium-calculator/constants';
import type {
    CompoundInputs,
    CompoundPoint,
    CompoundResult,
} from '@/features/freemium-calculator/types';

function buildPoint(
    year: number,
    contributions: number,
    grossCapital: number,
    netCapital: number,
    taxRate: number,
    inflationRate: number,
): CompoundPoint {
    const netGainsBeforeTax = netCapital - contributions;
    const netReal =
        contributions +
        (netGainsBeforeTax > 0
            ? netGainsBeforeTax * (1 - taxRate / 100)
            : netGainsBeforeTax);
    const inflationFactor = (1 + inflationRate / 100) ** year;
    const netRealAdjusted = inflationFactor > 0 ? netReal / inflationFactor : netReal;

    return {
        year,
        contributions,
        gross: grossCapital,
        netReal,
        netRealAdjusted,
    };
}

export function computeCompound(inputs: CompoundInputs): CompoundResult {
    const {
        initialCapital,
        monthlyContribution,
        annualRate,
        years,
        wrapperFee,
        fundFee,
        taxRate,
        inflationRate,
        inflationEnabled,
    } = inputs;

    const safeYears = Math.max(0, Math.round(years) || 0);
    const months = safeYears * 12;

    const grossMonthlyRate = annualRate / 100 / 12;
    const netAnnualRate = annualRate - wrapperFee - fundFee;
    const netMonthlyRate = netAnnualRate / 100 / 12;

    let grossCapital = initialCapital;
    let netCapital = initialCapital;
    let contributions = initialCapital;

    const points = [
        buildPoint(0, contributions, grossCapital, netCapital, taxRate, inflationEnabled ? inflationRate : 0),
    ];

    for (let month = 1; month <= months; month += 1) {
        grossCapital = grossCapital * (1 + grossMonthlyRate) + monthlyContribution;
        netCapital = netCapital * (1 + netMonthlyRate) + monthlyContribution;
        contributions += monthlyContribution;

        if (month % 12 === 0) {
            points.push(
                buildPoint(
                    month / 12,
                    contributions,
                    grossCapital,
                    netCapital,
                    taxRate,
                    inflationEnabled ? inflationRate : 0,
                ),
            );
        }
    }

    const last = points[points.length - 1];
    const grossGains = last.gross - last.contributions;
    const netRealGains = last.netReal - last.contributions;

    return {
        points,
        invested: last.contributions,
        grossGains,
        finalGross: last.gross,
        netRealGains,
        finalNetReal: last.netReal,
        finalNetRealAdjusted: last.netRealAdjusted,
        shortfall: grossGains - netRealGains,
    };
}

export function formatCurrency(value: number, locale = FALLBACK_LOCALE): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: CURRENCY,
        maximumFractionDigits: CURRENCY_FRACTION_DIGITS,
    }).format(Number.isFinite(value) ? value : 0);
}

export function formatCompact(value: number, locale = FALLBACK_LOCALE): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: CURRENCY,
        notation: 'compact',
        maximumFractionDigits: COMPACT_CURRENCY_FRACTION_DIGITS,
    }).format(Number.isFinite(value) ? value : 0);
}
