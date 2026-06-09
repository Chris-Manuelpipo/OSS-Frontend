import { USE_MOCK } from '@/lib/api/config'
import { apiFetch, ApiError } from '@/lib/api/client'
import { assures, medecins } from '@/data/mock'
import { Assure } from '@/lib/types'
import { AssureFormData } from '@/lib/schemas'
import { mockDelay } from './_mock'

export async function listAssures(): Promise<Assure[]> {
  if (USE_MOCK) {
    await mockDelay()
    return [...assures]
  }
  return apiFetch<Assure[]>('/assures')
}

export async function getAssure(id: number): Promise<Assure | null> {
  if (USE_MOCK) {
    await mockDelay()
    return assures.find(a => a.numAssure === id) ?? null
  }
  try {
    return await apiFetch<Assure>(`/assures/${id}`)
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) return null
    throw e
  }
}

export async function createAssure(data: AssureFormData): Promise<Assure> {
  if (USE_MOCK) {
    await mockDelay()
    const numAssure = Math.max(0, ...assures.map(a => a.numAssure)) + 1
    const medecin = data.numMedecinTraitant
      ? medecins.find(m => m.numMedecin === data.numMedecinTraitant)
      : undefined
    const nouvel: Assure = {
      numAssure,
      nom: data.nom,
      prenom: data.prenom,
      email: data.email || undefined,
      dateNaissance: data.dateNaissance,
      sexe: data.sexe,
      numCompteBancaire: data.numCompteBancaire || undefined,
      numMedecinTraitant: data.numMedecinTraitant || undefined,
      nomMedecinTraitant: medecin ? `Dr. ${medecin.prenom} ${medecin.nom}` : undefined,
    }
    assures.push(nouvel)
    return nouvel
  }
  return apiFetch<Assure>('/assures', { method: 'POST', body: data })
}

export async function deleteAssure(id: number): Promise<void> {
  if (USE_MOCK) {
    await mockDelay()
    const idx = assures.findIndex(a => a.numAssure === id)
    if (idx !== -1) assures.splice(idx, 1)
    return
  }
  await apiFetch<void>(`/assures/${id}`, { method: 'DELETE' })
}
