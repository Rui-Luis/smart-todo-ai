'use client';

import { useState } from 'react';

type Task = {
  title: string;
  duration: string;
  tags: string[];
  completed: boolean;
  originalDescription: string;
};

type TaskFormProps = {
  onAddTask: (task: Task) => void;
};

export default function TaskForm({ onAddTask }: TaskFormProps) {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Task[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ description }),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();

    const newTask = {
      ...data,
      completed: false,
      originalDescription: description,
    };

    setResults((prev) => [...prev, newTask]);
    onAddTask(newTask);

    setLoading(false);
    setDescription('');
  };

  // Função para alternar completed de uma task
  const toggleCompleted = (index: number) => {
    setResults((prev) =>
      prev.map((task, i) =>
        i === index ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    
    <div className="max-w-xl mx-auto p-4 text-center">
        <header className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white text-center font-bold text-3xl">
        Smart To-Do List
      </header>
      <main className="max-w-3xl mx-auto p-8 bg-gray-50 min-h-screen">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
        <textarea
          className="w-full p-2 border rounded-md"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the task..."
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Thinking...' : 'Generate task with AI'}
        </button>
      </form>
      
      {/* Lista acumulada de resultados */}
      <div className="mt-6 space-y-4">
        {results.map((result, i) => (
          <div
            key={i}
            className={`mx-auto p-4 border rounded-md bg-gray-50 max-w-md text-left flex items-start gap-4 ${
              result.completed ? 'bg-gray-300 line-through text-gray-600' : ''
            }`}
          >
            <input
              type="checkbox"
              checked={result.completed}
              onChange={() => toggleCompleted(i)}
              className="mt-1"
            />
            <div>
              <h2 className="text-xl font-bold">{result.title}</h2>
              <p className="text-sm text-gray-600">Duration: ~{result.duration}</p>
              <p className="text-sm text-gray-600">
                {result.originalDescription}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {result.tags.map((tag, j) => (
                  <span
                    key={j}
                    className="bg-blue-100 text-blue-800 px-2 py-1 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      </main>
    </div>
  );
}
