export function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

export function parseDate(dateString: string): Date {
    return new Date(dateString);
}

export function validateDateRange(startDate: Date, endDate: Date): boolean {
    return startDate <= endDate;
}
