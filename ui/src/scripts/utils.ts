export const collapseAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const collapseText = (value: string): string => {
    return `${value.slice(0, 6)}...${value.slice(-6)}`;
};

export const toCurrency = (value: number): string => {
    return Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
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