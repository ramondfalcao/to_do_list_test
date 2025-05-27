'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, UserPlus } from 'lucide-react';
import { requestPost } from '@/services/requests';

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await requestPost('/auth/login', form);
      localStorage.setItem('token', response.accessToken);
      router.push('/home');
    } catch {
      alert('Login inválido');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    router.push('/register');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-md">
        <div className="bg-indigo-600 p-6 text-white text-center">
          <h1 className="text-2xl font-bold">Bem-vindo de volta</h1>
          <p className="opacity-90">Faça login para acessar sua conta</p>
        </div>
        
        <form className="p-6 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="seu@email.com"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={isLoading}
              className={`flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg transition-colors ${
                isLoading
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              {isLoading ? (
                'Entrando...'
              ) : (
                <>
                  Entrar <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>

          <div className="text-center text-sm text-gray-600">
            <p>Não tem uma conta?{' '}
              <button
                onClick={handleRegister}
                className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center justify-center gap-1 mx-auto cursor-pointer"
              >
                <UserPlus size={16} /> Criar conta
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}