import { USE_MOCK } from '@/lib/api/config'
import { apiFetch } from '@/lib/api/client'
import { utilisateurs, medecins } from '@/data/mock'
import { Role } from '@/lib/types'
import { mockDelay } from './_mock'

/** Utilisateur authentifié exposé à l'app (jamais de mot de passe). */
export interface AuthUser {
  login: string
  nom: string
  prenom: string
  role: Role
  numMedecin?: number
}

export interface LoginResult {
  token: string
  user: AuthUser
}

export async function login(login: string, motDePasse: string): Promise<LoginResult> {
  if (USE_MOCK) {
    await mockDelay()
    const found = utilisateurs.find(u => u.login === login && u.motDePasse === motDePasse)
    if (!found) {
      throw new Error('Identifiant ou mot de passe incorrect')
    }
    const numMedecin = medecins.find(m => m.login === found.login)?.numMedecin
    const user: AuthUser = {
      login: found.login,
      nom: found.nom,
      prenom: found.prenom,
      role: found.role,
      ...(numMedecin ? { numMedecin } : {}),
    }
    return { token: `mock.${found.login}`, user }
  }

  return apiFetch<LoginResult>('/auth/login', {
    method: 'POST',
    body: { login, motDePasse },
  })
}

/** Récupère l'utilisateur courant depuis le token (mode http uniquement). */
export async function me(): Promise<AuthUser> {
  return apiFetch<AuthUser>('/auth/me')
}
