'use client'

import { Heart, Settings, AlertCircle } from 'lucide-react'

export default function ConfigError() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 p-4 rounded-full">
            <AlertCircle className="h-12 w-12 text-red-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Configuração Necessária
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <Settings className="h-5 w-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">
              Variáveis de Ambiente
            </h2>
          </div>
          
          <p className="text-gray-600 mb-4">
            Para que a plataforma funcione corretamente, você precisa configurar as variáveis de ambiente do Supabase.
          </p>
          
          <div className="bg-gray-50 p-4 rounded-md text-left">
            <p className="text-sm font-mono text-gray-800 mb-2">
              Crie um arquivo <code>.env.local</code> na raiz do projeto:
            </p>
            <pre className="text-xs text-gray-700 bg-white p-3 rounded border">
{`NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase`}
            </pre>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">Como obter as credenciais:</h3>
          <ol className="text-sm text-blue-800 text-left space-y-1">
            <li>1. Acesse <a href="https://supabase.com" target="_blank" rel="noopener" className="underline">supabase.com</a></li>
            <li>2. Crie um novo projeto ou use um existente</li>
            <li>3. Vá em <strong>Settings</strong> → <strong>API</strong></li>
            <li>4. Copie a <strong>Project URL</strong> e <strong>anon public</strong> key</li>
            <li>5. Cole no arquivo <code>.env.local</code></li>
            <li>6. Reinicie o servidor de desenvolvimento</li>
          </ol>
        </div>
        
        <div className="mt-6 flex items-center justify-center">
          <Heart className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-sm text-gray-600">
            Jornada da Aldeia - Comunidade de Apoio para AH/SD
          </span>
        </div>
      </div>
    </div>
  )
} 