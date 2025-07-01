'use client'

import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Map, Calendar, Heart, Star } from 'lucide-react'
import { useRouter } from 'next/navigation'
import LoadingSpinner from '@/components/LoadingSpinner'

interface CheckinData {
  id: string
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

export default function JornadaPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [checkins, setCheckins] = useState<CheckinData[]>([])
  const [selectedWeek, setSelectedWeek] = useState<CheckinData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadCheckins()
    }
  }, [user])

  const loadCheckins = async () => {
    try {
      const { data, error } = await supabase
        .from('weekly_checkins')
        .select('*')
        .eq('user_id', user?.id)
        .order('semana', { ascending: true })

      if (error) throw error
      setCheckins(data || [])
    } catch (error) {
      console.error('Erro ao carregar checkins:', error)
    } finally {
      setLoading(false)
    }
  }

  // Memoizar os dados para evitar recálculos desnecessários
  const weekData = useMemo(() => {
    return Array.from({ length: 52 }, (_, i) => i + 1).map(weekNumber => ({
      weekNumber,
      checkin: checkins.find(c => c.semana === weekNumber),
      status: (() => {
        const checkin = checkins.find(c => c.semana === weekNumber)
        if (checkin) return 'completed'
        if (weekNumber <= 52) return 'future'
        return 'locked'
      })()
    }))
  }, [checkins])

  const getWeekColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 hover:bg-green-600'
      case 'future':
        return 'bg-gray-300 hover:bg-gray-400'
      case 'locked':
        return 'bg-gray-100 cursor-not-allowed'
      default:
        return 'bg-gray-300'
    }
  }

  const handleWeekClick = (weekNumber: number) => {
    const checkin = checkins.find(c => c.semana === weekNumber)
    if (checkin) {
      setSelectedWeek(checkin)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <LoadingSpinner message="Carregando sua jornada..." size="lg" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center">
              <div className="bg-green-100 p-2 rounded-full mr-3">
                <Map className="h-6 w-6 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">O Mapa da sua Jornada</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Progresso da Jornada</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Completadas</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span className="text-sm text-gray-600">Futuras</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{checkins.length}</div>
              <div className="text-sm text-gray-600">Semanas Registradas</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{52 - checkins.length}</div>
              <div className="text-sm text-gray-600">Semanas Restantes</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{Math.round((checkins.length / 52) * 100)}%</div>
              <div className="text-sm text-gray-600">Jornada Completa</div>
            </div>
          </div>
        </div>

        {/* Journey Map */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Trilha da Montanha - 52 Semanas</h3>
          
          <div className="relative">
            {/* Mountain Background */}
            <div className="absolute inset-0 bg-gradient-to-t from-green-200 to-blue-200 rounded-lg opacity-20"></div>
            
            {/* Week Markers */}
            <div className="relative grid grid-cols-13 gap-1 p-4">
              {weekData.map(({ weekNumber, status }) => (
                <button
                  key={weekNumber}
                  onClick={() => handleWeekClick(weekNumber)}
                  disabled={status === 'locked'}
                  className={`
                    w-8 h-8 rounded-full text-xs font-medium text-white transition-all duration-200
                    ${getWeekColor(status)}
                    ${status === 'completed' ? 'shadow-lg transform hover:scale-110' : ''}
                    ${status === 'future' ? 'cursor-pointer' : ''}
                  `}
                  title={`Semana ${weekNumber}`}
                >
                  {weekNumber}
                </button>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Clique em uma semana completada para ver os detalhes do seu "Diário da Fogueira"</p>
          </div>
        </div>
      </main>

      {/* Week Details Modal */}
      {selectedWeek && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Semana {selectedWeek.semana} - Diário da Fogueira
                </h3>
                <button
                  onClick={() => setSelectedWeek(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Bússola da Semana */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                    A Bússola da Semana
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <div className="text-lg font-bold text-red-600">{selectedWeek.cansaço}</div>
                      <div className="text-xs text-gray-600">Cansaço</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">{selectedWeek.confiança}</div>
                      <div className="text-xs text-gray-600">Confiança</div>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">{selectedWeek.conexão_familiar}</div>
                      <div className="text-xs text-gray-600">Conexão</div>
                    </div>
                  </div>
                </div>

                {/* Reflections */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <Star className="h-4 w-4 mr-2 text-yellow-600" />
                      O Tesouro
                    </h4>
                    <p className="text-gray-700 bg-yellow-50 p-3 rounded-lg">{selectedWeek.tesouro}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <Heart className="h-4 w-4 mr-2 text-red-600" />
                      A Pedra no Caminho
                    </h4>
                    <p className="text-gray-700 bg-red-50 p-3 rounded-lg">{selectedWeek.pedra_caminho}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <Map className="h-4 w-4 mr-2 text-green-600" />
                      A Ferramenta
                    </h4>
                    <p className="text-gray-700 bg-green-50 p-3 rounded-lg">{selectedWeek.ferramenta}</p>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                      A Paisagem
                    </h4>
                    <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">{selectedWeek.paisagem}</p>
                  </div>
                </div>

                <div className="text-xs text-gray-500 text-center">
                  Registrado em {new Date(selectedWeek.created_at).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 