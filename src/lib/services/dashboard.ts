import { USE_MOCK } from '@/lib/api/config'
import { apiFetch } from '@/lib/api/client'
import { statCards, recentActivities } from '@/data/mock'

export interface DashboardStats {
  totalRemboursements: number
  virements: number
  cash: number
  nbAssures: number
  nbMedecins: number
  feuillesEnAttente: number
}

export interface Activity {
  id: number
  action: string
  date: string
  type: string
}

export interface DashboardData {
  stats: DashboardStats
  recentActivities: Activity[]
}

export async function getDashboard(): Promise<DashboardData> {
  if (USE_MOCK) {
    return { stats: statCards, recentActivities }
  }
  return apiFetch<DashboardData>('/dashboard')
}
