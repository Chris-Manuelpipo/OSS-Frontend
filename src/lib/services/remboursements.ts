import { USE_MOCK } from '@/lib/api/config'
import { apiFetch } from '@/lib/api/client'
import { feuillesMaladie } from '@/data/mock'
import { Remboursement, ModeReglement } from '@/lib/types'
import { mockDelay } from './_mock'

/** Marque un remboursement comme effectué avec le mode de règlement choisi. */
export async function effectuerRemboursement(
  numRemboursement: number,
  modeReglement: ModeReglement,
): Promise<Remboursement> {
  if (USE_MOCK) {
    await mockDelay()
    for (const f of feuillesMaladie) {
      const remb = f.remboursements.find(r => r.numRemboursement === numRemboursement)
      if (remb) {
        remb.statut = 'EFFECTUE'
        remb.modeReglement = modeReglement
        remb.dateRemboursement = new Date().toISOString().split('T')[0]
        remb.agentLogin = 'admin'
        return { ...remb }
      }
    }
    throw new Error('Remboursement introuvable')
  }
  return apiFetch<Remboursement>(`/remboursements/${numRemboursement}/effectuer`, {
    method: 'POST',
    body: { modeReglement },
  })
}
