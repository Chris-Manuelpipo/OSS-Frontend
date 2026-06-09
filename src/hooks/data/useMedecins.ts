'use client'

import useSWR from 'swr'
import { listMedecins, getMedecin } from '@/lib/services/medecins'

export function useMedecins() {
  const { data, error, isLoading, mutate } = useSWR('medecins', listMedecins)
  return { medecins: data ?? [], error, isLoading, mutate }
}

export function useMedecin(id: number) {
  const { data, error, isLoading, mutate } = useSWR(
    Number.isFinite(id) ? ['medecin', id] : null,
    () => getMedecin(id),
  )
  return { medecin: data ?? null, error, isLoading, mutate }
}
