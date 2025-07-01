import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import ConfigError from "@/components/ConfigError";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Jornada da Aldeia - Comunidade de Apoio para AH/SD",
  description: "Uma plataforma exclusiva para pais e cuidadores de crianças com Altas Habilidades/Superdotação. É preciso uma aldeia inteira para criar uma criança.",
};

// Verificar se as variáveis de ambiente estão configuradas
const checkEnvironmentVariables = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      error: true,
      message: `Variáveis de ambiente não configuradas. 
      NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? 'OK' : 'FALTANDO'}
      NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseAnonKey ? 'OK' : 'FALTANDO'}`
    };
  }
  
  return { error: false, message: '' };
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const envCheck = checkEnvironmentVariables();

  if (envCheck.error) {
    return (
      <html lang="pt-BR">
        <body className={`${inter.variable} ${robotoMono.variable} antialiased`}>
          <ConfigError />
        </body>
      </html>
    );
  }

  return (
    <html lang="pt-BR">
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
