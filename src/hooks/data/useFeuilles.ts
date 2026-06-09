'use client'

import useSWR from 'swr'
import { listFeuilles, getFeuille } from '@/lib/services/feuilles'

export function useFeuilles() {
  const { data, error, isLoading, mutate } = useSWR('feuilles', listFeuilles)
  return { feuilles: data ?? [], error, isLoading, mutate }
}

export function useFeuille(id: number) {
  const { data, error, isLoading, mutate } = useSWR(
    Number.isFinite(id) ? ['feuille', id] : null,
    () => getFeuille(id),
  )
  return { feuille: data ?? null, error, isLoading, mutate }
}
