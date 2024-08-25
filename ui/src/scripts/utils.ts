export const collapseAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const collapseText = (value: string): string => {
    return `${value.slice(0, 6)}...${value.slice(-6)}`;
};

export const toAptosUnits = (value: number): number => {
    return value * 100_000_000;
};

export const fromAptosUnits = (value: number): number => {
    return value / 100_000_000;
};

const getMinimumFractionDigits = (value: number): number => {
    const valueString = value.toString();

    if (valueString.includes('.')) {
        const count = valueString.split('.')[1].length;
        if (count > 6) return 6;
        return count;
    }

    return 2;
};

export const getProposalState = (value: number): string => {
    if (value == 0) {
        return 'Pending';
    } else if (value == 1) {
        return 'Resolve';
    }

    return 'Unknown';
};

export const toCurrency = (value: number): string => {
    return Intl.NumberFormat('en-US', {
        minimumFractionDigits: getMinimumFractionDigits(value),
        maximumFractionDigits: 6,
        style: 'currency',
        currency: 'USD'
    }).format(value).replace('$', '');
};

export const isEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
};

export const borrowString = (value?: string | null): string | undefined => {
    if (!value || value.length == 0) return undefined;
    return value;
};

export const toDays = (secs: number): { days: number, hours: string; } => {
    const totalHours = secs / 60 / 60;
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;
    return { days, hours: hours.toFixed(2) };
};