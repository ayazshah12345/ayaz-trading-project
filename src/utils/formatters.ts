export const formatCurrency = (val: number, _currency = 'USD'): string => {
  const sign = val < 0 ? '-' : '';
  const absVal = Math.abs(val);
  return `${sign}$${absVal.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const formatPrice = (price: number, symbol = ''): string => {
  if (!price && price !== 0) return '0.00';
  if (symbol.includes('JPY')) {
    return price.toFixed(3);
  }
  if (price >= 1000) {
    return price.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  if (price < 1) {
    return price.toFixed(5);
  }
  return price.toFixed(2);
};

export const formatPercent = (val: number): string => {
  const sign = val > 0 ? '+' : '';
  return `${sign}${val.toFixed(2)}%`;
};

export const formatRMultiple = (r: number): string => {
  const sign = r > 0 ? '+' : '';
  return `${sign}${r.toFixed(2)}R`;
};

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
};

export const formatDateTime = (dateStr: string, timeStr = ''): string => {
  if (!dateStr) return '';
  const dateStrFormatted = formatDate(dateStr);
  return timeStr ? `${dateStrFormatted} at ${timeStr}` : dateStrFormatted;
};
