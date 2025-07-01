import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Validação das variáveis de ambiente
if (!supabaseUrl) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL não está configurada. Verifique seu arquivo .env.local')
}

if (!supabaseAnonKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY não está configurada. Verifique seu arquivo .env.local')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para as tabelas do banco
export interface User {
  id: string
  email: string
  nome: string
  data_cadastro: string
  onboarding_completo: boolean
}

export interface OnboardingData {
  id: string
  user_id: string
  tempestade: string
  raio_sol: string
  cansaço: number
  confiança: number
  conexão_familiar: number
  explorador: string
  expectativas: string
  created_at: string
}

export interface WeeklyCheckin {
  id: string
  user_id: string
  semana: number
  cansaço: number
  confiança: number
  conexão_familiar: number
  tesouro: string
  pedra_caminho: string
  ferramenta: string
  paisagem: string
  created_at: string
}

export interface UserNotes {
  id: string
  user_id: string
  conteudo: string
  updated_at: string
} 