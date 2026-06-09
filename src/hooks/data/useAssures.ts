'use client'

import useSWR from 'swr'
import { listAssures, getAssure } from '@/lib/services/assures'

export function useAssures() {
  const { data, error, isLoading, mutate } = useSWR('assures', listAssures)
  return { assures: data ?? [], error, isLoading, mutate }
}

export function useAssure(id: number) {
  const { data, error, isLoading, mutate } = useSWR(
    Number.isFinite(id) ? ['assure', id] : null,
    () => getAssure(id),
  )
  return { assure: data ?? null, error, isLoading, mutate }
}
