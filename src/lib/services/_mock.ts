/** Petite latence simulée en mode mock, pour rendre visibles les états de chargement. */
export const mockDelay = (ms = 150) => new Promise<void>(resolve => setTimeout(resolve, ms))
