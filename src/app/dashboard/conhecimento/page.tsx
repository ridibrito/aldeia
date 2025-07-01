'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, BookOpen, Calendar, Video, ExternalLink, Clock, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Course {
  id: string
  title: string
  description: string
  duration: string
  level: 'iniciante' | 'intermediário' | 'avançado'
  url: string
  category: string
}

interface Live {
  id: string
  title: string
  date: string
  time: string
  speaker: string
  url: string
  isUpcoming: boolean
}

export default function ConhecimentoPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'cursos' | 'lives' | 'calendario'>('cursos')

  // Dados mockados - em produção viriam do banco
  const courses: Course[] = [
    {
      id: '1',
      title: 'Entendendo Altas Habilidades/Superdotação',
      description: 'Fundamentos sobre AH/SD, identificação e características principais.',
      duration: '2h 30min',
      level: 'iniciante',
      url: 'https://example.com/curso-1',
      category: 'Fundamentos'
    },
    {
      id: '2',
      title: 'Estratégias de Comunicação com Crianças AH/SD',
      description: 'Técnicas práticas para melhorar a comunicação e conexão familiar.',
      duration: '3h 15min',
      level: 'intermediário',
      url: 'https://example.com/curso-2',
      category: 'Comunicação'
    },
    {
      id: '3',
      title: 'Gestão Emocional para Pais e Cuidadores',
      description: 'Ferramentas para lidar com a intensidade emocional e o estresse.',
      duration: '4h',
      level: 'intermediário',
      url: 'https://example.com/curso-3',
      category: 'Saúde Mental'
    },
    {
      id: '4',
      title: 'Criando Ambientes Enriquecidos',
      description: 'Como adaptar o ambiente para estimular o desenvolvimento da criança.',
      duration: '2h 45min',
      level: 'avançado',
      url: 'https://example.com/curso-4',
      category: 'Ambiente'
    }
  ]

  const lives: Live[] = [
    {
      id: '1',
      title: 'Como Lidar com a Perfeccionismo em Crianças AH/SD',
      date: '2024-02-15',
      time: '20:00',
      speaker: 'Dra. Maria Silva',
      url: 'https://youtube.com/live-1',
      isUpcoming: true
    },
    {
      id: '2',
      title: 'Estratégias para o Tédio Escolar',
      date: '2024-02-08',
      time: '19:30',
      speaker: 'Prof. João Santos',
      url: 'https://youtube.com/live-2',
      isUpcoming: false
    },
    {
      id: '3',
      title: 'Fortalecendo a Autoestima',
      date: '2024-02-01',
      time: '20:00',
      speaker: 'Psicóloga Ana Costa',
      url: 'https://youtube.com/live-3',
      isUpcoming: false
    }
  ]

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'iniciante': return 'bg-green-100 text-green-800'
      case 'intermediário': return 'bg-yellow-100 text-yellow-800'
      case 'avançado': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Fundamentos': return 'bg-blue-100 text-blue-800'
      case 'Comunicação': return 'bg-purple-100 text-purple-800'
      case 'Saúde Mental': return 'bg-pink-100 text-pink-800'
      case 'Ambiente': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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
              <div className="bg-orange-100 p-2 rounded-full mr-3">
                <BookOpen className="h-6 w-6 text-orange-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">A Cabana do Conhecimento</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex space-x-1 mb-6">
            {[
              { key: 'cursos', label: 'A Prateleira dos Guias', icon: BookOpen },
              { key: 'lives', label: 'Lives da Tribo', icon: Video },
              { key: 'calendario', label: 'Calendário da Tribo', icon: Calendar }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === key
                    ? 'bg-orange-600 text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'cursos' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Cursos Disponíveis</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {courses.map((course) => (
                  <div key={course.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                        {course.level}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{course.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(course.category)}`}>
                          {course.category}
                        </span>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {course.duration}
                        </div>
                      </div>
                    </div>
                    
                    <a
                      href={course.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                    >
                      <span>Acessar Curso</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'lives' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Lives da Tribo</h2>
              <div className="space-y-6">
                {lives.map((live) => (
                  <div key={live.id} className={`border-l-4 p-6 rounded-r-lg ${
                    live.isUpcoming ? 'border-orange-500 bg-orange-50' : 'border-gray-300 bg-gray-50'
                  }`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{live.title}</h3>
                        <p className="text-gray-600">Com {live.speaker}</p>
                      </div>
                      {live.isUpcoming && (
                        <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                          Próxima
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(live.date).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {live.time}
                      </div>
                    </div>
                    
                    <a
                      href={live.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                        live.isUpcoming
                          ? 'bg-orange-600 text-white hover:bg-orange-700'
                          : 'bg-gray-600 text-white hover:bg-gray-700'
                      }`}
                    >
                      <span>{live.isUpcoming ? 'Participar' : 'Assistir Gravação'}</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'calendario' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Calendário da Tribo</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid md:grid-cols-7 gap-4">
                  {/* Cabeçalho dos dias */}
                  {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                    <div key={day} className="text-center font-medium text-gray-700 py-2">
                      {day}
                    </div>
                  ))}
                  
                  {/* Dias do mês (exemplo para fevereiro 2024) */}
                  {Array.from({ length: 35 }, (_, i) => {
                    const day = i - 3 + 1 // Começa em 1 de fevereiro
                    const isCurrentMonth = day > 0 && day <= 29
                    const hasEvent = day === 15 // Live no dia 15
                    
                    return (
                      <div
                        key={i}
                        className={`p-2 text-center rounded-lg ${
                          isCurrentMonth
                            ? hasEvent
                              ? 'bg-orange-100 border-2 border-orange-300'
                              : 'bg-white'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        <div className="text-sm">{isCurrentMonth ? day : ''}</div>
                        {hasEvent && (
                          <div className="w-2 h-2 bg-orange-500 rounded-full mx-auto mt-1"></div>
                        )}
                      </div>
                    )
                  })}
                </div>
                
                <div className="mt-6">
                  <h3 className="font-medium text-gray-900 mb-2">Próximos Eventos</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">15/02 - Live: Como Lidar com o Perfeccionismo</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{courses.length}</div>
            <div className="text-sm text-gray-600">Cursos Disponíveis</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <Video className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{lives.filter(l => l.isUpcoming).length}</div>
            <div className="text-sm text-gray-600">Lives Próximas</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">150+</div>
            <div className="text-sm text-gray-600">Membros da Tribo</div>
          </div>
        </div>
      </main>
    </div>
  )
} 