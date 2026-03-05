import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import * as TaskRepository from "../database/taskRepository";
import { Task, TaskFilter } from "../types/task";

interface useTaskReturn {
    tasks: Task[]
    allTasksCount: number
    pendingTasksCount: number
    completedTasksCount: number
    filter: TaskFilter
    loading: boolean
    setFilter: (filter: TaskFilter) => void
    toggleTask (id: number, currentCompleted: number): Promise<void>
    deleteTask (id: number): Promise<void>
}

export function useTasks(): UseTaskReturn {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filter, setFilter] = useState<TaskFilter>('all');
    const [loading, setLoading] = useState(true);

    const loadTasks = useCallback(async () =>{
        try {
        setLoading(true)
        const data = await TaskRepository.getTasks()
        setTasks(data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }, [])
    useFocusEffect(
        useCallback(() => {
            loadTasks()
        }, [loadTasks])
    )
}

  const filteredTasks = tasks.filter(task => {
    if(filter === 'pending') return task.completed === 0
    if(filter === 'completed') return task.completed === 1
    return true
  })

  const pendingTasksCount = tasks.filter(task => task.completed === 0).length
  const completedTasksCount = tasks.filter(task => task.completed === 1).length

   const toggleTask = useCallback(
    async (id: number, currentCompleted: number) => {
      try {
        const newCompleted = currentCompleted === 0 ? 1 : 0;
        await TaskRepository.toggleTaskComplete(id, newCompleted);
        await loadTasks();
      } catch (error) {
        console.error('Erro ao alterar status da tarefa:', error);
      }
    },
    [loadTasks],
  );