'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, User, Users, Edit3, Save, Plus, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface FamilyMember {
  id: string
  name: string
  relationship: string
  age: number
  occupation: string
  notes: string
}

interface FamilyStructure {
  id: string
  user_id: string
  structure_type: 'pai_mae' | 'so_pai' | 'so_mae' | 'duas_maes' | 'dois_pais' | 'outro'
  children_count: number
  family_members: FamilyMember[]
  additional_info: string
  created_at: string
  updated_at: string
}

export default function PerfilPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [familyData, setFamilyData] = useState<FamilyStructure>({
    id: '',
    user_id: user?.id || '',
    structure_type: 'pai_mae',
    children_count: 1,
    family_members: [],
    additional_info: '',
    created_at: '',
    updated_at: ''
  })

  const structureTypes = [
    { value: 'pai_mae', label: 'Pai e Mãe' },
    { value: 'so_pai', label: 'Só Pai' },
    { value: 'so_mae', label: 'Só Mãe' },
    { value: 'duas_maes', label: 'Duas Mães' },
    { value: 'dois_pais', label: 'Dois Pais' },
    { value: 'outro', label: 'Outro' }
  ]

  const relationshipTypes = [
    'Pai', 'Mãe', 'Filho(a)', 'Irmão(a)', 'Avô/Avó', 'Tio(a)', 'Primo(a)', 'Outro'
  ]

  useEffect(() => {
    if (user) {
      loadFamilyData()
    }
  }, [user])

  const loadFamilyData = async () => {
    try {
      const { data, error } = await supabase
        .from('family_structure')
        .select('*')
        .eq('user_id', user?.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        setFamilyData(data)
      }
    } catch (error) {
      console.error('Erro ao carregar dados familiares:', error)
    } finally {
      setLoading(false)
    }
  }

  const saveFamilyData = async () => {
    if (!user) return

    setSaving(true)
    try {
      const dataToSave = {
        ...familyData,
        user_id: user.id
      }

      let result
      if (familyData.id) {
        // Update
        result = await supabase
          .from('family_structure')
          .update(dataToSave)
          .eq('id', familyData.id)
      } else {
        // Insert
        result = await supabase
          .from('family_structure')
          .insert(dataToSave)
      }

      if (result.error) throw result.error

      if (result.data) {
        setFamilyData(prev => ({ ...prev, id: result.data[0]?.id || prev.id }))
      }

      setEditing(false)
    } catch (error) {
      console.error('Erro ao salvar dados familiares:', error)
    } finally {
      setSaving(false)
    }
  }

  const addFamilyMember = () => {
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: '',
      relationship: 'Pai',
      age: 0,
      occupation: '',
      notes: ''
    }
    setFamilyData(prev => ({
      ...prev,
      family_members: [...prev.family_members, newMember]
    }))
  }

  const updateFamilyMember = (id: string, field: keyof FamilyMember, value: any) => {
    setFamilyData(prev => ({
      ...prev,
      family_members: prev.family_members.map(member =>
        member.id === id ? { ...member, [field]: value } : member
      )
    }))
  }

  const removeFamilyMember = (id: string) => {
    setFamilyData(prev => ({
      ...prev,
      family_members: prev.family_members.filter(member => member.id !== id)
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando perfil...</p>
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
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {editing ? (
                <>
                  <button
                    onClick={() => setEditing(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={saveFamilyData}
                    disabled={saving}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>{saving ? 'Salvando...' : 'Salvar'}</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Editar</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Informações Pessoais</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <input
                type="text"
                value={user?.user_metadata?.nome || ''}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Family Structure */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center mb-6">
            <Users className="h-6 w-6 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Estrutura Familiar</h2>
          </div>

          <div className="space-y-6">
            {/* Structure Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Estrutura Familiar
              </label>
              <select
                value={familyData.structure_type}
                onChange={(e) => setFamilyData(prev => ({ ...prev, structure_type: e.target.value as any }))}
                disabled={!editing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
              >
                {structureTypes.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            {/* Children Count */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Filhos
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={familyData.children_count}
                onChange={(e) => setFamilyData(prev => ({ ...prev, children_count: parseInt(e.target.value) }))}
                disabled={!editing}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>

            {/* Family Members */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Membros da Família
                </label>
                {editing && (
                  <button
                    onClick={addFamilyMember}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Adicionar Membro</span>
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {familyData.family_members.map((member) => (
                  <div key={member.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => updateFamilyMember(member.id, 'name', e.target.value)}
                          disabled={!editing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Relacionamento</label>
                        <select
                          value={member.relationship}
                          onChange={(e) => updateFamilyMember(member.id, 'relationship', e.target.value)}
                          disabled={!editing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                        >
                          {relationshipTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Idade</label>
                        <input
                          type="number"
                          min="0"
                          max="120"
                          value={member.age}
                          onChange={(e) => updateFamilyMember(member.id, 'age', parseInt(e.target.value))}
                          disabled={!editing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Profissão</label>
                        <input
                          type="text"
                          value={member.occupation}
                          onChange={(e) => updateFamilyMember(member.id, 'occupation', e.target.value)}
                          disabled={!editing}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Observações</label>
                      <textarea
                        value={member.notes}
                        onChange={(e) => updateFamilyMember(member.id, 'notes', e.target.value)}
                        disabled={!editing}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                        placeholder="Informações adicionais sobre este membro da família..."
                      />
                    </div>
                    
                    {editing && (
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={() => removeFamilyMember(member.id)}
                          className="flex items-center space-x-2 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Remover</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Info */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Informações Adicionais
              </label>
              <textarea
                value={familyData.additional_info}
                onChange={(e) => setFamilyData(prev => ({ ...prev, additional_info: e.target.value }))}
                disabled={!editing}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
                placeholder="Outras informações relevantes sobre sua família..."
              />
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo da Família</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{familyData.children_count}</div>
              <div className="text-sm text-gray-600">Filho(s)</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{familyData.family_members.length}</div>
              <div className="text-sm text-gray-600">Membros Cadastrados</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {structureTypes.find(s => s.value === familyData.structure_type)?.label}
              </div>
              <div className="text-sm text-gray-600">Estrutura</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 