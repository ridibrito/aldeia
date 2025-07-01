'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { Heart, Map, Users, Target } from 'lucide-react'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Verificar se o usuário completou o onboarding
        checkOnboardingStatus()
      } else {
        // Se não está logado, ir para login
        router.push('/login')
      }
    }
  }, [user, loading, router])

  const checkOnboardingStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('onboarding_completo')
        .eq('id', user?.id)
        .single()

      if (error) throw error

      if (data?.onboarding_completo) {
        router.push('/dashboard')
      } else {
        router.push('/onboarding')
      }
    } catch (error) {
      console.error('Erro ao verificar onboarding:', error)
      // Em caso de erro, assume que precisa fazer onboarding
      router.push('/onboarding')
    }
  }

  // Página de carregamento enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  // Página de landing para usuários não autenticados
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-full mr-3">
                <Heart className="h-6 w-6 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Jornada da Aldeia</h1>
            </div>
            <button
              onClick={() => router.push('/login')}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Entrar
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            É preciso uma aldeia inteira para criar uma criança
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Uma plataforma exclusiva para pais e cuidadores de crianças com Altas Habilidades/Superdotação. 
            Acompanhe sua jornada de transformação em 52 semanas.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="bg-blue-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Map className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Mapeie sua Jornada</h3>
            <p className="text-gray-600">
              Registre seus sentimentos, desafios e conquistas semanais com o "Diário da Fogueira"
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Comunidade de Apoio</h3>
            <p className="text-gray-600">
              Conecte-se com outros pais e especialistas em um espaço seguro e acolhedor
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="bg-purple-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Target className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Visualize o Progresso</h3>
            <p className="text-gray-600">
              Acompanhe sua evolução através de gráficos e mapas visuais da sua jornada
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => router.push('/login')}
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition-colors text-lg font-medium"
          >
            Começar Minha Jornada
          </button>
        </div>
      </main>
    </div>
  )
}
