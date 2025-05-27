'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function TaskPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`/tasks`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(response);
      

      setTasks(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        router.push('/');
      }
    }
  };

  useEffect(() => { fetchTasks(); }, [page]);

  const handleAdd = async () => {
    await axios.post('/tasks', newTask, { headers: { Authorization: `Bearer ${token}` } });
    setModal(false);
    setNewTask({ title: '', description: '' });
    fetchTasks();
  };

  const handleToggle = async (task: any) => {
    await axios.put(`/tasks/${task.id}`, { ...task, checked: !task.checked }, { headers: { Authorization: `Bearer ${token}` } });
    fetchTasks();
  };

  const handleDelete = async (id: number) => {
    await axios.delete(`/tasks/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    fetchTasks();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Minhas Tarefas</h1>
      <button className="bg-blue-500 text-white px-4 py-2 rounded mb-4" onClick={() => setModal(true)}>Nova Tarefa</button>
      <ul>
        {tasks.map((task: any) => (
          <li key={task.id} className={`border p-4 mb-2 rounded ${task.checked ? 'bg-green-100' : 'bg-white'}`}>
            <h2 className="text-xl font-semibold">{task.title}</h2>
            <p>{task.description}</p>
            <div className="flex gap-2 mt-2">
              <button onClick={() => handleToggle(task)} className="text-sm text-blue-500">{task.checked ? 'Desmarcar' : 'Concluir'}</button>
              <button onClick={() => handleDelete(task.id)} className="text-sm text-red-500">Excluir</button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex gap-2">
        <button onClick={() => setPage(p => Math.max(p - 1, 1))} className="px-3 py-1 border rounded">Anterior</button>
        <button onClick={() => setPage(p => p + 1)} className="px-3 py-1 border rounded">Próxima</button>
      </div>
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Nova Tarefa</h2>
            <input className="border p-2 w-full mb-2" placeholder="Título" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} />
            <textarea className="border p-2 w-full mb-2" placeholder="Descrição" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} />
            <div className="flex gap-2 justify-end">
              <button onClick={() => setModal(false)} className="px-4 py-2 border rounded">Cancelar</button>
              <button onClick={handleAdd} className="bg-green-500 text-white px-4 py-2 rounded">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
