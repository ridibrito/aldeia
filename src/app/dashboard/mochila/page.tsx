'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, Briefcase, Save, Edit3, FileText } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function MochilaPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)

  useEffect(() => {
    if (user) {
      loadNotes()
    }
  }, [user])

  useEffect(() => {
    if (autoSaveEnabled && content && !loading) {
      const timeoutId = setTimeout(() => {
        saveNotes()
      }, 2000) // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timeoutId)
    }
  }, [content, autoSaveEnabled, loading])

  const loadNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('user_notes')
        .select('*')
        .eq('user_id', user?.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        setContent(data.conteudo || '')
        setLastSaved(new Date(data.updated_at))
      }
    } catch (error) {
      console.error('Erro ao carregar notas:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveNotes = async () => {
    if (!user || !content.trim()) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('user_notes')
        .upsert({
          user_id: user.id,
          conteudo: content,
          updated_at: new Date().toISOString()
        })

      if (error) throw error

      setLastSaved(new Date())
    } catch (error) {
      console.error('Erro ao salvar notas:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleSave = () => {
    saveNotes()
  }

  const formatDate = (date: Date) => {
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando sua mochila...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center">
                <div className="bg-yellow-100 p-2 rounded-full mr-3">
                  <Briefcase className="h-6 w-6 text-yellow-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Sua Mochila de Ferramentas</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="autoSave"
                  checked={autoSaveEnabled}
                  onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <label htmlFor="autoSave" className="text-sm text-gray-600">
                  Auto-salvar
                </label>
              </div>
              
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{saving ? 'Salvando...' : 'Salvar'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Bar */}
        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Notas Pessoais</span>
              </div>
              
              {lastSaved && (
                <div className="text-sm text-gray-500">
                  Última edição: {formatDate(lastSaved)}
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {saving && (
                <div className="flex items-center space-x-2 text-green-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
                  <span className="text-sm">Salvando...</span>
                </div>
              )}
              
              {autoSaveEnabled && (
                <div className="text-sm text-gray-500">
                  Auto-salvo ativado
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="border-b border-gray-200 p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Suas Ferramentas e Reflexões</h2>
            <p className="text-sm text-gray-600">
              Use este espaço para anotar estratégias, reflexões, insights e ferramentas que você descobriu durante sua jornada.
            </p>
          </div>
          
          <div className="p-6">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Comece a escrever suas reflexões, estratégias e ferramentas aqui...

Exemplos do que você pode anotar:
• Estratégias que funcionaram bem com seu filho
• Reflexões sobre momentos desafiadores
• Ferramentas e recursos que você descobriu
• Insights sobre o desenvolvimento da criança
• Notas sobre reuniões com professores ou especialistas
• Momentos de conquista e celebração
• Perguntas para fazer em próximas consultas
• Ideias para atividades e estimulação

Este é seu espaço privado e seguro para organizar seus pensamentos e aprendizados."
              className="w-full h-96 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
              style={{ fontFamily: 'inherit' }}
            />
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Dicas para usar sua mochila</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>• Anote estratégias que funcionaram bem</li>
              <li>• Registre momentos de conquista</li>
              <li>• Guarde insights sobre o desenvolvimento</li>
              <li>• Organize perguntas para especialistas</li>
              <li>• Documente recursos e ferramentas úteis</li>
            </ul>
          </div>
          
          <div className="bg-green-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-3">🔒 Privacidade e Segurança</h3>
            <ul className="space-y-2 text-sm text-green-800">
              <li>• Suas notas são totalmente privadas</li>
              <li>• Apenas você tem acesso ao conteúdo</li>
              <li>• Dados criptografados e seguros</li>
              <li>• Auto-salvamento para não perder nada</li>
              <li>• Backup automático no servidor</li>
            </ul>
          </div>
        </div>

        {/* Word Count */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center space-x-4 bg-white rounded-lg shadow-lg px-6 py-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{content.length}</div>
              <div className="text-sm text-gray-600">Caracteres</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{content.split(/\s+/).filter(word => word.length > 0).length}</div>
              <div className="text-sm text-gray-600">Palavras</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{content.split('\n').filter(line => line.trim().length > 0).length}</div>
              <div className="text-sm text-gray-600">Linhas</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 