'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, UserPlus, LogIn } from 'lucide-react';

export default function AuthPrompt({ message, showRegister = true }) {
  const router = useRouter();

  return (
    <Card className="max-w-md mx-auto mt-8 border-2 border-blue-200 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="flex items-center gap-3">
          <Lock className="h-8 w-8 text-blue-600" />
          <CardTitle className="text-xl">Acesso Restrito</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        <p className="text-gray-700 leading-relaxed">
          {message || 'Para acessar o conteúdo completo e salvar seu progresso, você precisa estar logado.'}
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <h4 className="font-semibold text-blue-900 mb-2">Benefícios de criar uma conta:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>✓ Salve seu progresso em todos os dispositivos</li>
            <li>✓ Acesse conteúdo exclusivo e detalhado</li>
            <li>✓ Acompanhe sua evolução com estatísticas</li>
            <li>✓ 100% gratuito, sempre</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          {showRegister && (
            <Button
              onClick={() => router.push('/register')}
              className="flex-1 gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Criar Conta Grátis
            </Button>
          )}
          <Button
            onClick={() => router.push('/login')}
            variant="outline"
            className="flex-1 gap-2"
          >
            <LogIn className="h-4 w-4" />
            Já tenho conta
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
