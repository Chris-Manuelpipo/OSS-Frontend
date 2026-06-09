// Devise unique de l'application — Franc CFA.
export const DEVISE = 'FCFA'

/** Montant détaillé avec 2 décimales, suffixé « FCFA ». */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount) + ` ${DEVISE}`
}

/** Montant compact sans décimales (axes/légendes de graphiques), suffixé « FCFA ». */
export function formatMontant(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0,
  }).format(amount) + ` ${DEVISE}`
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString))
}

export function formatDateShort(dateString: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(dateString))
}

export function formatTaux(taux: number): string {
  return `${Math.round(taux * 100)}%`
}

export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}
