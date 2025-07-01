'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { 
  Heart, 
  LogOut, 
  Map, 
  BarChart3, 
  BookOpen, 
  Plus,
  User,
  Briefcase
} from 'lucide-react'

// Componente de loading otimizado
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
    </div>
  )
}

// Componente de card otimizado
function DashboardCard({ 
  icon: Icon, 
  title, 
  description, 
  color, 
  onClick 
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  description: string
  color: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`${color} text-white p-6 rounded-lg hover:opacity-90 transition-all duration-200 transform hover:scale-105 text-center`}
    >
      <Icon className="h-8 w-8 mx-auto mb-2" />
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm opacity-90">{description}</p>
    </button>
  )
}

export default function DashboardPage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [currentWeek, setCurrentWeek] = useState(1)
  const [showCheckinModal, setShowCheckinModal] = useState(false)
  const [checkinData, setCheckinData] = useState({
    cansaço: 5,
    confiança: 5,
    conexão_familiar: 5,
    tesouro: '',
    pedra_caminho: '',
    ferramenta: '',
    paisagem: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      calculateCurrentWeek()
      // Removido o check automático para melhorar performance
    }
  }, [user])

  const calculateCurrentWeek = () => {
    const startDate = new Date('2024-01-01')
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - startDate.getTime())
    const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7))
    setCurrentWeek(Math.min(diffWeeks, 52))
  }

  const handleNavigation = (path: string) => {
    setIsLoading(true)
    router.push(path)
  }

  const handleCheckinSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      const { error } = await supabase
        .from('weekly_checkins')
        .insert({
          user_id: user.id,
          semana: currentWeek,
          ...checkinData
        })

      if (error) throw error

      setShowCheckinModal(false)
      setCheckinData({
        cansaço: 5,
        confiança: 5,
        conexão_familiar: 5,
        tesouro: '',
        pedra_caminho: '',
        ferramenta: '',
        paisagem: ''
      })
    } catch (error) {
      console.error('Erro ao salvar checkin:', error)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  const dashboardCards = [
    {
      icon: Plus,
      title: 'Diário da Fogueira',
      description: 'Registrar esta semana',
      color: 'bg-green-600',
      path: () => setShowCheckinModal(true)
    },
    {
      icon: Map,
      title: 'Mapa da Jornada',
      description: 'Visualizar progresso',
      color: 'bg-blue-600',
      path: () => handleNavigation('/dashboard/jornada')
    },
    {
      icon: BarChart3,
      title: 'Clima da Jornada',
      description: 'Ver gráficos',
      color: 'bg-purple-600',
      path: () => handleNavigation('/dashboard/clima')
    },
    {
      icon: BookOpen,
      title: 'Cabana do Conhecimento',
      description: 'Cursos e lives',
      color: 'bg-orange-600',
      path: () => handleNavigation('/dashboard/conhecimento')
    },
    {
      icon: User,
      title: 'Meu Perfil',
      description: 'Estrutura familiar',
      color: 'bg-indigo-600',
      path: () => handleNavigation('/dashboard/perfil')
    },
    {
      icon: Briefcase,
      title: 'Mochila de Ferramentas',
      description: 'Notas pessoais',
      color: 'bg-yellow-600',
      path: () => handleNavigation('/dashboard/mochila')
    }
  ]

  if (isLoading) {
    return <LoadingSpinner />
  }

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
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Semana {currentWeek} de 52</span>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="h-5 w-5" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Bem-vindo de volta!
          </h2>
          <p className="text-gray-600">
            Continue sua jornada de transformação. Esta é a semana {currentWeek} de 52.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {dashboardCards.map((card, index) => (
            <DashboardCard
              key={index}
              icon={card.icon}
              title={card.title}
              description={card.description}
              color={card.color}
              onClick={card.path}
            />
          ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Atividade Recente</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-full">
                <Heart className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Check-in da semana {currentWeek - 1} completado</p>
                <p className="text-xs text-gray-500">Há 2 dias</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-2 rounded-full">
                <Map className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Jornada iniciada</p>
                <p className="text-xs text-gray-500">Há 1 semana</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Check-in Modal */}
      {showCheckinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Diário da Fogueira - Semana {currentWeek}
                </h3>
                <button
                  onClick={() => setShowCheckinModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCheckinSubmit} className="space-y-6">
                {/* Bússola da Semana */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-4">A Bússola da Semana</h4>
                  <div className="space-y-4">
                    {['cansaço', 'confiança', 'conexão_familiar'].map((field) => (
                      <div key={field}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {field === 'cansaço' ? 'Cansaço' : 
                           field === 'confiança' ? 'Confiança' : 'Conexão Familiar'}: {checkinData[field as keyof typeof checkinData]}
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={checkinData[field as keyof typeof checkinData]}
                          onChange={(e) => setCheckinData(prev => ({ 
                            ...prev, 
                            [field]: parseInt(e.target.value) 
                          }))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Muito baixo</span>
                          <span>Muito alto</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Campos de texto */}
                {[
                  { key: 'tesouro', label: 'O Tesouro', placeholder: 'Qual foi sua maior conquista desta semana?' },
                  { key: 'pedra_caminho', label: 'A Pedra no Caminho', placeholder: 'Qual foi o maior desafio que enfrentou?' },
                  { key: 'ferramenta', label: 'A Ferramenta', placeholder: 'Que ferramenta ou estratégia mais te ajudou?' },
                  { key: 'paisagem', label: 'A Paisagem', placeholder: 'Como você se sente olhando para o futuro?' }
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {label}
                    </label>
                    <textarea
                      value={checkinData[key as keyof typeof checkinData]}
                      onChange={(e) => setCheckinData(prev => ({ 
                        ...prev, 
                        [key]: e.target.value 
                      }))}
                      required
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder={placeholder}
                    />
                  </div>
                ))}

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowCheckinModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Registrar na Fogueira
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 