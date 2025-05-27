'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, CheckCircle, ChevronLeft, ChevronRight, Plus, Trash2, X } from 'lucide-react';
import { getToken, requestData, requestDelete, requestPost, requestUpdate, setToken, validateToken } from '@/services/requests';

export default function TaskPage() {
    const router = useRouter();
    const [tasks, setTasks] = useState([]);
    const [page, setPage] = useState(1);
    const [modal, setModal] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', description: '' });
    const [metaDataPage, setMetaDataPages] = useState();
    const [isLoading, setIsLoading] = useState(false);

    const fetchTasks = async () => {
        setIsLoading(true);
        try {
            const response = await requestData(`/tasks?page=${page}`);

            setTasks(response.data);
            setMetaDataPages(response.meta)
        } catch (err) {
            if (err.response?.status === 401) {
                router.push('/login');
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const token = getToken();
                setToken(token);
                await validateToken();
            } catch (err) {
                router.push('/');
            }
        };
        fetchToken();
    }, [router]);

    useEffect(() => { fetchTasks(); }, [page]);

    const handleAdd = async () => {
        setIsLoading(true);
        try {
            await requestPost('/tasks', newTask);
            setModal(false);
            setNewTask({ title: '', description: '' });
            fetchTasks();
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggle = async (task) => {
        await requestUpdate(`/tasks/${task.id}`, { checked: !task.checked });
        fetchTasks();
    };

    const handleDelete = async (id) => {
        await requestDelete(`/tasks/${id}`);
        fetchTasks();
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Minhas Tarefas</h1>
                    <button
                        onClick={() => setModal(true)}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        <Plus size={20} />
                        Nova Tarefa
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                    </div>
                ) : (
                    <>
                        <ul className="space-y-3">
                            {tasks.map((task) => (
                                <li
                                    key={task.id}
                                    className={`bg-white p-4 rounded-xl shadow-sm border transition-all duration-200 ${task.checked ? 'border-green-200 bg-green-50' : 'border-gray-200 hover:shadow-md'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <button
                                            onClick={() => handleToggle(task)}
                                            className={`mt-1 flex-shrink-0 rounded-full p-1 ${task.checked
                                                    ? 'text-green-600 bg-green-100'
                                                    : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'
                                                }`}
                                        >
                                            {task.checked ? <CheckCircle size={20} /> : <Check size={20} />}
                                        </button>
                                        <div className="flex-1 min-w-0">
                                            <h2
                                                className={`text-lg font-medium ${task.checked ? 'line-through text-gray-500' : 'text-gray-800'
                                                    }`}
                                            >
                                                {task.title}
                                            </h2>
                                            {task.description && (
                                                <p
                                                    className={`text-sm mt-1 ${task.checked ? 'line-through text-gray-400' : 'text-gray-600'
                                                        }`}
                                                >
                                                    {task.description}
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => handleDelete(task.id)}
                                            className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-8 flex justify-center items-center gap-4">
                            <button
                                onClick={() => setPage(p => Math.max(p - 1, 1))}
                                disabled={page === 1}
                                className={`flex items-center gap-1 px-4 py-2 rounded-lg border ${page === 1
                                        ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                                        : 'text-gray-700 border-gray-300 hover:bg-gray-100'
                                    }`}
                            >
                                <ChevronLeft size={18} />
                                Anterior
                            </button>
                            <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-medium">
                                Página {page}
                            </span>
                            <button
                                onClick={() => setPage(p => p + 1)}
                                disabled={!metaDataPage || page >= metaDataPage.totalPages}
                                className={`flex items-center gap-1 px-4 py-2 rounded-lg border ${!metaDataPage ||metaDataPage.total <  metaDataPage.limit
                                        ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                                        : 'text-gray-700 border-gray-300 hover:bg-gray-100'
                                    }`}
                            >
                                Próxima
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </>
                )}
            </div>

            {modal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md animate-fade-in">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Nova Tarefa</h2>
                            <button
                                onClick={() => setModal(false)}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                                <input
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Título da tarefa"
                                    value={newTask.title}
                                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                <textarea
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    rows={3}
                                    placeholder="Descrição (opcional)"
                                    value={newTask.description}
                                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setModal(false)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleAdd}
                                disabled={!newTask.title || isLoading}
                                className={`px-4 py-2 rounded-lg transition-colors ${!newTask.title || isLoading
                                        ? 'bg-indigo-300 cursor-not-allowed'
                                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                                    }`}
                            >
                                {isLoading ? 'Salvando...' : 'Salvar Tarefa'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}