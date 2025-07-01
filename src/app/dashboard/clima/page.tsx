'use client'

import { useState, useEffect, lazy, Suspense } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import LoadingSpinner from '@/components/LoadingSpinner'

// Lazy load do Recharts para melhorar performance
const LineChart = lazy(() => import('recharts').then(module => ({ default: module.LineChart })))
const Line = lazy(() => import('recharts').then(module => ({ default: module.Line })))
const XAxis = lazy(() => import('recharts').then(module => ({ default: module.XAxis })))
const YAxis = lazy(() => import('recharts').then(module => ({ default: module.YAxis })))
const CartesianGrid = lazy(() => import('recharts').then(module => ({ default: module.CartesianGrid })))
const Tooltip = lazy(() => import('recharts').then(module => ({ default: module.Tooltip })))
const Legend = lazy(() => import('recharts').then(module => ({ default: module.Legend })))
const ResponsiveContainer = lazy(() => import('recharts').then(module => ({ default: module.ResponsiveContainer })))

interface CheckinData {
  semana: number
  cansaço: number
  confiança: number
  conexão_familiar: number
  created_at: string
}

export default function ClimaPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [checkins, setCheckins] = useState<CheckinData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMetric, setSelectedMetric] = useState<'all' | 'cansaço' | 'confiança' | 'conexão_familiar'>('all')

  useEffect(() => {
    if (user) {
      loadCheckins()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const chartData = checkins.map(checkin => ({
    semana: checkin.semana,
    cansaço: checkin.cansaço,
    confiança: checkin.confiança,
    'conexão familiar': checkin.conexão_familiar,
  }))

  const getTrend = (metric: string) => {
    if (checkins.length < 2) return { trend: 'stable', value: 0 }
    
    const first = checkins[0][metric as keyof CheckinData] as number
    const last = checkins[checkins.length - 1][metric as keyof CheckinData] as number
    const change = last - first
    
    if (change > 0) return { trend: 'up', value: change }
    if (change < 0) return { trend: 'down', value: Math.abs(change) }
    return { trend: 'stable', value: 0 }
  }

  const getMetricColor = (metric: string) => {
    switch (metric) {
      case 'cansaço': return '#ef4444'
      case 'confiança': return '#22c55e'
      case 'conexão_familiar': return '#3b82f6'
      default: return '#6b7280'
    }
  }

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'cansaço': return '😴'
      case 'confiança': return '💪'
      case 'conexão_familiar': return '❤️'
      default: return '📊'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <LoadingSpinner message="Carregando dados do clima..." size="lg" />
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
              <div className="bg-purple-100 p-2 rounded-full mr-3">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">O Clima da sua Jornada</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metrics Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {['cansaço', 'confiança', 'conexão_familiar'].map((metric) => {
            const trend = getTrend(metric)
            const lastValue = checkins.length > 0 ? checkins[checkins.length - 1][metric as keyof CheckinData] as number : 0
            
            return (
              <div key={metric} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">{getMetricIcon(metric)}</span>
                    <h3 className="text-lg font-semibold text-gray-900 capitalize">
                      {metric === 'conexão_familiar' ? 'Conexão Familiar' : metric}
                    </h3>
                  </div>
                  <div className={`flex items-center space-x-1 ${
                    trend.trend === 'up' ? 'text-green-600' : 
                    trend.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {trend.trend === 'up' && <TrendingUp className="h-4 w-4" />}
                    {trend.trend === 'down' && <TrendingDown className="h-4 w-4" />}
                    {trend.trend === 'stable' && <Minus className="h-4 w-4" />}
                    <span className="text-sm font-medium">
                      {trend.trend === 'up' ? '+' : trend.trend === 'down' ? '-' : ''}{trend.value}
                    </span>
                  </div>
                </div>
                
                <div className="text-3xl font-bold text-gray-900 mb-2">{lastValue}/10</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(lastValue / 10) * 100}%`,
                      backgroundColor: getMetricColor(metric)
                    }}
                  ></div>
                </div>
                
                <p className="text-sm text-gray-600 mt-2">
                  {checkins.length > 0 ? `${checkins.length} registros` : 'Nenhum registro ainda'}
                </p>
              </div>
            )
          })}
        </div>

        {/* Chart Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Evolução ao Longo do Tempo</h2>
            <div className="flex space-x-2">
              {[
                { key: 'all', label: 'Todas' },
                { key: 'cansaço', label: 'Cansaço' },
                { key: 'confiança', label: 'Confiança' },
                { key: 'conexão_familiar', label: 'Conexão' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setSelectedMetric(key as 'all' | 'cansaço' | 'confiança' | 'conexão_familiar')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    selectedMetric === key
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Chart */}
          <div className="h-96">
            {chartData.length > 0 ? (
              <Suspense fallback={<LoadingSpinner message="Carregando gráfico..." size="md" />}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="semana" 
                      label={{ value: 'Semana', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      domain={[0, 10]}
                      label={{ value: 'Pontuação', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      formatter={(value: unknown, name: unknown) => [value as number, name as string]}
                      labelFormatter={(label: string) => `Semana ${label}`}
                    />
                    <Legend />
                    {selectedMetric === 'all' ? (
                      <>
                        <Line 
                          type="monotone" 
                          dataKey="cansaço" 
                          stroke="#ef4444" 
                          strokeWidth={2}
                          dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="confiança" 
                          stroke="#22c55e" 
                          strokeWidth={2}
                          dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="conexão familiar" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      </>
                    ) : (
                      <Line 
                        type="monotone" 
                        dataKey={selectedMetric === 'conexão_familiar' ? 'conexão familiar' : selectedMetric}
                        stroke={getMetricColor(selectedMetric)}
                        strokeWidth={3}
                        dot={{ fill: getMetricColor(selectedMetric), strokeWidth: 2, r: 5 }}
                        activeDot={{ r: 7 }}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </Suspense>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhum dado disponível ainda</p>
                  <p className="text-sm text-gray-400">Complete seu primeiro &quot;Diário da Fogueira&quot; para ver os gráficos</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Insights */}
        {checkins.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights da sua Jornada</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Melhor Semana</h4>
                <p className="text-gray-600">
                  Semana {checkins.reduce((best, current) => 
                    (current.confiança + current.conexão_familiar - current.cansaço) > 
                    (best.confiança + best.conexão_familiar - best.cansaço) ? current : best
                  ).semana}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Consistência</h4>
                <p className="text-gray-600">
                  {checkins.length} de 52 semanas registradas ({Math.round((checkins.length / 52) * 100)}%)
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}