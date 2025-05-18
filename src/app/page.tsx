"use client";

import { useState, useEffect } from "react";
import TaskForm from "@/components/TaskForm";

type Task = {
  title: string;
  duration: string;
  tags: string[];
  completed: boolean;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);

  // Carregar tasks do localStorage quando o componente monta
  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) {
      setTasks(JSON.parse(saved));
    }
  }, []);

  // Guardar tasks no localStorage sempre que elas mudarem
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function addTask(newTask: Omit<Task, "completed">) {
    setTasks((prev) => [...prev, { ...newTask, completed: false }]);
  }


  return (
    <main>
      <TaskForm onAddTask={addTask} />
    </main>
  );
}
