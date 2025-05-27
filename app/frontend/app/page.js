'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { requestPost } from '@/services/requests';

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await requestPost('/auth/login', form);
      localStorage.setItem('token', response.accessToken);
      router.push('/home');
    } catch {
      alert('Login inválido');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    router.push('/register');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input className="border p-2 w-full mb-4" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="border p-2 w-full mb-4" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />

        <div className='flex justify-between'>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleSubmit}>
            Entrar
          </button>
          <button 
            type="button"
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            onClick={handleRegister}>
            Cadastro
          </button>
        </div>
      </form>
    </div>
  );
}