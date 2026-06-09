'use client'

import useSWR from 'swr'
import { getDashboard } from '@/lib/services/dashboard'

export function useDashboard() {
  const { data, error, isLoading, mutate } = useSWR('dashboard', getDashboard)
  return { dashboard: data ?? null, error, isLoading, mutate }
}
