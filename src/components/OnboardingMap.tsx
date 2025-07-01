'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Map, Sun, Compass, User, Target } from 'lucide-react'

export default function OnboardingMap() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    tempestade: '',
    raio_sol: '',
    cansaço: 5,
    confiança: 5,
    conexão_familiar: 5,
    explorador: '',
    expectativas: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    try {
      // Salvar dados do onboarding
      const { error } = await supabase
        .from('onboarding_data')
        .insert({
          user_id: user.id,
          ...formData
        })

      if (error) throw error

      // Marcar usuário como tendo completado o onboarding
      const { error: updateError } = await supabase
        .from('users')
        .update({ onboarding_completo: true })
        .eq('id', user.id)

      if (updateError) throw updateError

      router.push('/dashboard')
    } catch (error) {
      console.error('Erro ao salvar onboarding:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSliderChange = (field: string, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Map className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            O Mapa do Agora
          </h1>
          <p className="text-gray-600">
            Vamos mapear seu ponto de partida nesta jornada
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Tempestade */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 p-2 rounded-full mr-3">
                <Map className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">A Tempestade</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Quais são os principais desafios que você está enfrentando atualmente?
            </p>
            <textarea
              value={formData.tempestade}
              onChange={(e) => setFormData(prev => ({ ...prev, tempestade: e.target.value }))}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder="Descreva os desafios que você está enfrentando..."
            />
          </div>

          {/* Raio de Sol */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="bg-yellow-100 p-2 rounded-full mr-3">
                <Sun className="h-5 w-5 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">O Raio de Sol</h3>
            </div>
            <p className="text-gray-600 mb-4">
              O que está funcionando bem na sua jornada como cuidador?
            </p>
            <textarea
              value={formData.raio_sol}
              onChange={(e) => setFormData(prev => ({ ...prev, raio_sol: e.target.value }))}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              placeholder="Descreva o que está funcionando bem..."
            />
          </div>

          {/* Bússola do Cuidador */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-3">
                <Compass className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">A Bússola do Cuidador</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Como você se sente atualmente em cada uma dessas dimensões? (1 = muito baixo, 10 = muito alto)
            </p>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cansaço: {formData.cansaço}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.cansaço}
                  onChange={(e) => handleSliderChange('cansaço', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Muito baixo</span>
                  <span>Muito alto</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confiança: {formData.confiança}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.confiança}
                  onChange={(e) => handleSliderChange('confiança', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Muito baixo</span>
                  <span>Muito alto</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conexão Familiar: {formData.conexão_familiar}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.conexão_familiar}
                  onChange={(e) => handleSliderChange('conexão_familiar', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Muito baixo</span>
                  <span>Muito alto</span>
                </div>
              </div>
            </div>
          </div>

          {/* Explorador */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 p-2 rounded-full mr-3">
                <User className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">O Explorador</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Conte-nos um pouco sobre a criança que você está cuidando
            </p>
            <textarea
              value={formData.explorador}
              onChange={(e) => setFormData(prev => ({ ...prev, explorador: e.target.value }))}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Descreva a criança, suas características, interesses..."
            />
          </div>

          {/* Expectativas */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 p-2 rounded-full mr-3">
                <Target className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">As Expectativas</h3>
            </div>
            <p className="text-gray-600 mb-4">
              O que você espera desta jornada? Como gostaria de se sentir ao final?
            </p>
            <textarea
              value={formData.expectativas}
              onChange={(e) => setFormData(prev => ({ ...prev, expectativas: e.target.value }))}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Descreva suas expectativas e objetivos..."
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white py-3 px-8 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-lg font-medium"
            >
              {loading ? 'Iniciando Jornada...' : 'Iniciar Jornada'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 