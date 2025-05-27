'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

axios.defaults.baseURL = 'http://localhost:3001';
axios.defaults.headers.post['Content-Type'] = 'application/json';

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/login', form);
      console.log(response);
      
      localStorage.setItem('token', response.data.accessToken);
      router.push('/tasks');
    } catch {
      alert('Login inválido');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="text-black p-6 rounded shadow-md w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input className="border p-2 w-full mb-4" placeholder="Email" type='email' value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="border p-2 w-full mb-4" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Entrar</button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">Criar Conta</button>
      </form>
    </div>
  );
}