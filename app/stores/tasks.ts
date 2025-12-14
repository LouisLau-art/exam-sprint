import { defineStore } from 'pinia'

export interface Task {
    id: string
    title: string
    notes: string
    dueDate: string | null
    priority: 'P0' | 'P1' | 'P2'
    estimatedPomodoros: number
    tags: string[]
    goalId: string | null
    completed: boolean
    createdAt?: string
    updatedAt?: string
}

export const useTasksStore = defineStore('tasks', () => {
    const tasks = ref<Task[]>([])
    const loading = ref(false)
    const initialized = ref(false)

    // Fetch all tasks from API
    const fetchTasks = async () => {
        if (initialized.value) return
        loading.value = true
        try {
            const data = await $fetch<Task[]>('/api/tasks')
            tasks.value = data
            initialized.value = true
        } catch (error) {
            console.error('Failed to fetch tasks:', error)
        } finally {
            loading.value = false
        }
    }

    // Initialize on client side
    if (import.meta.client) {
        fetchTasks()
    }

    // Computed
    const allTasks = computed(() => tasks.value)

    const incompleteTasks = computed(() =>
        tasks.value.filter(t => !t.completed)
    )

    const completedTasks = computed(() =>
        tasks.value.filter(t => t.completed)
    )

    const todayTasks = computed(() => {
        const today = new Date().toISOString().split('T')[0]
        return tasks.value.filter(t => t.dueDate === today || !t.dueDate)
    })

    const todayCompletedCount = computed(() => {
        const today = new Date().toISOString().split('T')[0]
        return tasks.value.filter(t =>
            t.completed &&
            t.updatedAt?.startsWith(today)
        ).length
    })

    // Actions
    const addTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
        try {
            const newTask = await $fetch<Task>('/api/tasks', {
                method: 'POST',
                body: taskData,
            })
            tasks.value.unshift(newTask)
            return newTask
        } catch (error) {
            console.error('Failed to add task:', error)
            throw error
        }
    }

    const updateTask = async (id: string, updates: Partial<Task>) => {
        try {
            await $fetch(`/api/tasks/${id}`, {
                method: 'PUT',
                body: updates,
            })
            const index = tasks.value.findIndex(t => t.id === id)
            if (index !== -1) {
                tasks.value[index] = { ...tasks.value[index], ...updates }
            }
        } catch (error) {
            console.error('Failed to update task:', error)
            throw error
        }
    }

    const deleteTask = async (id: string) => {
        try {
            await $fetch(`/api/tasks/${id}`, { method: 'DELETE' })
            tasks.value = tasks.value.filter(t => t.id !== id)
        } catch (error) {
            console.error('Failed to delete task:', error)
            throw error
        }
    }

    const toggleTask = async (id: string) => {
        const task = tasks.value.find(t => t.id === id)
        if (task) {
            await updateTask(id, { completed: !task.completed })
        }
    }

    const getTasksByGoal = (goalId: string) => {
        return tasks.value.filter(t => t.goalId === goalId)
    }

    return {
        tasks,
        loading,
        allTasks,
        incompleteTasks,
        completedTasks,
        todayTasks,
        todayCompletedCount,
        fetchTasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTask,
        getTasksByGoal,
    }
})
