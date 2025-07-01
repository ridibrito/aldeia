-- Configuração das tabelas para a plataforma "Jornada da Aldeia"

-- Tabela de usuários (estendida do auth.users do Supabase)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT NOT NULL,
    nome TEXT NOT NULL,
    data_cadastro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    onboarding_completo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de dados do onboarding
CREATE TABLE IF NOT EXISTS public.onboarding_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    tempestade TEXT NOT NULL,
    raio_sol TEXT NOT NULL,
    cansaço INTEGER NOT NULL CHECK (cansaço >= 1 AND cansaço <= 10),
    confiança INTEGER NOT NULL CHECK (confiança >= 1 AND confiança <= 10),
    conexão_familiar INTEGER NOT NULL CHECK (conexão_familiar >= 1 AND conexão_familiar <= 10),
    explorador TEXT NOT NULL,
    expectativas TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de check-ins semanais
CREATE TABLE IF NOT EXISTS public.weekly_checkins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    semana INTEGER NOT NULL CHECK (semana >= 1 AND semana <= 52),
    cansaço INTEGER NOT NULL CHECK (cansaço >= 1 AND cansaço <= 10),
    confiança INTEGER NOT NULL CHECK (confiança >= 1 AND confiança <= 10),
    conexão_familiar INTEGER NOT NULL CHECK (conexão_familiar >= 1 AND conexão_familiar <= 10),
    tesouro TEXT NOT NULL,
    pedra_caminho TEXT NOT NULL,
    ferramenta TEXT NOT NULL,
    paisagem TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, semana)
);

-- Tabela de notas do usuário
CREATE TABLE IF NOT EXISTS public.user_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    conteudo TEXT DEFAULT '',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Tabela de estrutura familiar
CREATE TABLE IF NOT EXISTS public.family_structure (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    structure_type TEXT NOT NULL CHECK (structure_type IN ('pai_mae', 'so_pai', 'so_mae', 'duas_maes', 'dois_pais', 'outro')),
    children_count INTEGER NOT NULL CHECK (children_count >= 1 AND children_count <= 10),
    family_members JSONB DEFAULT '[]'::jsonb,
    additional_info TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Função para atualizar o timestamp de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_notes_updated_at BEFORE UPDATE ON public.user_notes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_family_structure_updated_at BEFORE UPDATE ON public.family_structure
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Políticas de segurança RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.onboarding_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.family_structure ENABLE ROW LEVEL SECURITY;

-- Políticas para usuários (cada usuário só vê seus próprios dados)
CREATE POLICY "Users can view own data" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own data" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas para onboarding_data
CREATE POLICY "Users can view own onboarding data" ON public.onboarding_data
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own onboarding data" ON public.onboarding_data
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para weekly_checkins
CREATE POLICY "Users can view own checkins" ON public.weekly_checkins
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own checkins" ON public.weekly_checkins
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own checkins" ON public.weekly_checkins
    FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para user_notes
CREATE POLICY "Users can view own notes" ON public.user_notes
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notes" ON public.user_notes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own notes" ON public.user_notes
    FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para family_structure
CREATE POLICY "Users can view own family structure" ON public.family_structure
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own family structure" ON public.family_structure
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own family structure" ON public.family_structure
    FOR UPDATE USING (auth.uid() = user_id);

-- Função para criar usuário automaticamente após signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, nome)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'nome', 'Usuário')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar usuário após signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 