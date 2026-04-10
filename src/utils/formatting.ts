export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatDate(isoDate: string): string {
  const date = new Date(isoDate)
  return new Intl.DateTimeFormat('it-IT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

export function formatQuoteNumber(prefix: string, num: number): string {
  const year = new Date().getFullYear()
  return `${prefix}-${year}-${String(num).padStart(4, '0')}`
}
