# Jornada da Aldeia

Uma plataforma exclusiva para pais e cuidadores de crianças com Altas Habilidades/Superdotação (AH/SD). Fundamentada no provérbio "É preciso uma aldeia inteira para criar uma criança", a plataforma serve como o coração digital da comunidade.

## 🚀 Funcionalidades

- **Onboarding Personalizado**: "O Mapa do Agora" para mapear o ponto de partida
- **Diário da Fogueira**: Check-ins semanais para registrar sentimentos e conquistas
- **Mapa da Jornada**: Visualização do progresso ao longo de 52 semanas
- **Clima da Jornada**: Gráficos de evolução da confiança, cansaço e conexão familiar
- **Cabana do Conhecimento**: Acesso a cursos e lives da comunidade
- **Mochila de Ferramentas**: Editor de notas pessoais
- **Perfil Completo**: Anamnese familiar detalhada

## 🛠️ Tecnologias

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Styling**: Tailwind CSS
- **Charts**: Recharts (lazy loaded)
- **Icons**: Lucide React
- **Performance**: Otimizações avançadas de carregamento

## ⚡ Otimizações de Performance

- **Lazy Loading**: Componentes pesados carregados sob demanda
- **Cache Inteligente**: Sistema de cache para consultas ao Supabase
- **Code Splitting**: Bundle otimizado com divisão automática
- **Loading States**: Feedback visual durante carregamentos
- **Memoização**: Evita re-renders desnecessários
- **Compressão**: Gzip e otimizações de assets

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta no Supabase

## 🔧 Configuração

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd aldeia
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o Supabase

1. Crie um projeto no [Supabase](https://supabase.com)
2. Vá em **Settings** → **API** e copie:
   - Project URL
   - anon public key

3. Crie um arquivo `.env.local` na raiz do projeto:
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### 4. Configure o banco de dados

1. No painel do Supabase, vá em **SQL Editor**
2. Execute o script `supabase-schema.sql` para criar as tabelas e políticas de segurança

### 5. Execute o projeto
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 📊 Estrutura do Banco de Dados

### Tabelas principais:

- **users**: Dados dos usuários e status do onboarding
- **onboarding_data**: Respostas do "Mapa do Agora"
- **weekly_checkins**: Check-ins semanais do "Diário da Fogueira"
- **user_notes**: Notas pessoais da "Mochila de Ferramentas"
- **family_structure**: Estrutura familiar e anamnese

### Políticas de Segurança (RLS):
- Cada usuário só acessa seus próprios dados
- Autenticação obrigatória para todas as operações

## 🎯 Fluxo do Usuário

1. **Landing Page** → Apresentação da plataforma
2. **Login/Registro** → Autenticação via Supabase
3. **Onboarding** → "O Mapa do Agora" (apenas na primeira vez)
4. **Dashboard** → Página principal com acesso a todas as funcionalidades
5. **Check-ins Semanais** → "Diário da Fogueira" automático
6. **Visualizações** → Mapa e gráficos do progresso
7. **Perfil** → Anamnese familiar completa
8. **Notas** → Editor pessoal de ferramentas

## 🔒 Segurança

- Autenticação via Supabase Auth
- Row Level Security (RLS) habilitado
- Dados criptografados em trânsito
- Conformidade com LGPD
- Validação de entrada em todos os formulários

## 📱 Responsividade

A plataforma é totalmente responsiva e funciona em:
- Desktop
- Tablet
- Mobile

## ⚡ Performance

### Métricas de Performance:
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3s
- **Bundle Size**: Otimizado com code splitting

### Otimizações Implementadas:
- Lazy loading de componentes pesados
- Cache inteligente para consultas
- Compressão de assets
- Otimização de imagens
- Bundle splitting automático

## 🚀 Deploy

### Vercel (Recomendado)
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático com otimizações

### Outras plataformas
A plataforma pode ser deployada em qualquer plataforma que suporte Next.js.

## 🧪 Testes

Para testar a performance:
```bash
npm run build
npm run start
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para dúvidas ou suporte, entre em contato através dos canais da comunidade.

---

**"É preciso uma aldeia inteira para criar uma criança"** - Provérbio Africano
