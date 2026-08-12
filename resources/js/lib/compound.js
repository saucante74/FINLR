function buildPoint(year, contributions, grossCapital, netCapital, taxRate) {
    const netGainsBeforeTax = netCapital - contributions;
    const netReal =
        contributions +
        (netGainsBeforeTax > 0
            ? netGainsBeforeTax * (1 - taxRate / 100)
            : netGainsBeforeTax);

    return {
        year,
        contributions,
        gross: grossCapital,
        netReal,
    };
}

export function computeCompound(inputs) {
    const {
        initialCapital,
        monthlyContribution,
        annualRate,
        years,
        wrapperFee,
        fundFee,
        taxRate,
    } = inputs;

    const safeYears = Math.max(0, Math.round(years) || 0);
    const months = safeYears * 12;

    const grossMonthlyRate = annualRate / 100 / 12;
    const netAnnualRate = annualRate - wrapperFee - fundFee;
    const netMonthlyRate = netAnnualRate / 100 / 12;

    let grossCapital = initialCapital;
    let netCapital = initialCapital;
    let contributions = initialCapital;

    const points = [buildPoint(0, contributions, grossCapital, netCapital, taxRate)];

    for (let month = 1; month <= months; month += 1) {
        grossCapital = grossCapital * (1 + grossMonthlyRate) + monthlyContribution;
        netCapital = netCapital * (1 + netMonthlyRate) + monthlyContribution;
        contributions += monthlyContribution;

        if (month % 12 === 0) {
            points.push(
                buildPoint(month / 12, contributions, grossCapital, netCapital, taxRate),
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
        shortfall: grossGains - netRealGains,
    };
}

export function formatCurrency(value, locale = 'fr') {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0,
    }).format(Number.isFinite(value) ? value : 0);
}

export function formatCompact(value, locale = 'fr') {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'EUR',
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(Number.isFinite(value) ? value : 0);
}
