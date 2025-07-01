import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

interface UseSupabaseQueryOptions {
  enabled?: boolean
  cacheTime?: number
}

interface UseSupabaseQueryResult<T> {
  data: T | null
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

// Cache simples em memória
const cache = new Map<string, { data: any; timestamp: number }>()

export function useSupabaseQuery<T>(
  queryKey: string,
  queryFn: () => Promise<{ data: T | null; error: any }>,
  options: UseSupabaseQueryOptions = {}
): UseSupabaseQueryResult<T> {
  const { enabled = true, cacheTime = 5 * 60 * 1000 } = options // 5 minutos por padrão
  
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const executeQuery = useCallback(async () => {
    // Verificar cache primeiro
    const cached = cache.get(queryKey)
    if (cached && Date.now() - cached.timestamp < cacheTime) {
      setData(cached.data)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const result = await queryFn()
      
      if (result.error) {
        throw new Error(result.error.message)
      }

      setData(result.data)
      
      // Salvar no cache
      cache.set(queryKey, {
        data: result.data,
        timestamp: Date.now()
      })
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro desconhecido'))
    } finally {
      setLoading(false)
    }
  }, [queryKey, queryFn, cacheTime])

  const refetch = useCallback(async () => {
    // Limpar cache para forçar nova consulta
    cache.delete(queryKey)
    await executeQuery()
  }, [queryKey, executeQuery])

  useEffect(() => {
    if (enabled) {
      executeQuery()
    }
  }, [enabled, executeQuery])

  return { data, loading, error, refetch }
}

// Hook específico para checkins semanais
export function useWeeklyCheckins(userId: string | undefined) {
  return useSupabaseQuery(
    `weekly-checkins-${userId}`,
    async () => {
      if (!userId) return { data: null, error: null }
      
      return await supabase
        .from('weekly_checkins')
        .select('*')
        .eq('user_id', userId)
        .order('semana', { ascending: true })
    },
    { enabled: !!userId }
  )
}

// Hook específico para dados do usuário
export function useUserData(userId: string | undefined) {
  return useSupabaseQuery(
    `user-data-${userId}`,
    async () => {
      if (!userId) return { data: null, error: null }
      
      return await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()
    },
    { enabled: !!userId }
  )
}

// Hook específico para estrutura familiar
export function useFamilyStructure(userId: string | undefined) {
  return useSupabaseQuery(
    `family-structure-${userId}`,
    async () => {
      if (!userId) return { data: null, error: null }
      
      return await supabase
        .from('family_structure')
        .select('*')
        .eq('user_id', userId)
        .single()
    },
    { enabled: !!userId }
  )
}

// Hook específico para notas do usuário
export function useUserNotes(userId: string | undefined) {
  return useSupabaseQuery(
    `user-notes-${userId}`,
    async () => {
      if (!userId) return { data: null, error: null }
      
      return await supabase
        .from('user_notes')
        .select('*')
        .eq('user_id', userId)
        .single()
    },
    { enabled: !!userId }
  )
} 