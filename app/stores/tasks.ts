import { defineStore, skipHydrate } from 'pinia'

export interface Task {
    id: string
    title: string
    notes: string
    dueDate: string | null
    priority: 'P0' | 'P1' | 'P2'
    goalId: string | null
    tags: string[]
    estimatedPomodoros: number
    completedPomodoros: number
    completed: boolean
    createdAt: string
    completedAt: string | null
    order: number
}

const generateId = () => `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

const STORAGE_KEY = 'exam-sprint-tasks'

export const useTasksStore = defineStore('tasks', () => {
    const tasks = ref<Task[]>([])

    // Load from localStorage on client
    if (import.meta.client) {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
            try {
                const data = JSON.parse(saved)
                tasks.value = data.tasks || []
            } catch (e) {
                console.error('Failed to load tasks state:', e)
            }
        }
    }

    const save = () => {
        if (!import.meta.client) return
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            tasks: tasks.value,
        }))
    }

    // Getters
    const allTasks = computed(() => tasks.value)

    const incompleteTasks = computed(() =>
        tasks.value.filter(t => !t.completed).sort((a, b) => a.order - b.order)
    )

    const completedTasks = computed(() =>
        tasks.value.filter(t => t.completed)
    )

    const todayTasks = computed(() => {
        const today = new Date().toISOString().split('T')[0]
        return tasks.value.filter(t => {
            if (t.completed) return false
            if (!t.dueDate) return true
            return t.dueDate <= today
        }).sort((a, b) => {
            const priorityOrder = { P0: 0, P1: 1, P2: 2 }
            const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
            if (priorityDiff !== 0) return priorityDiff
            return a.order - b.order
        })
    })

    const thisWeekTasks = computed(() => {
        const today = new Date()
        const weekEnd = new Date(today)
        weekEnd.setDate(today.getDate() + 7)
        const weekEndStr = weekEnd.toISOString().split('T')[0]

        return tasks.value.filter(t => {
            if (t.completed) return false
            if (!t.dueDate) return false
            return t.dueDate <= weekEndStr
        }).sort((a, b) => a.order - b.order)
    })

    const todayCompletedCount = computed(() => {
        const today = new Date().toISOString().split('T')[0]
        return tasks.value.filter(t =>
            t.completed && t.completedAt?.startsWith(today)
        ).length
    })

    // Actions
    const addTask = (taskData: Omit<Task, 'id' | 'createdAt' | 'completedAt' | 'order' | 'completedPomodoros'>) => {
        const newTask: Task = {
            ...taskData,
            id: generateId(),
            createdAt: new Date().toISOString(),
            completedAt: null,
            completedPomodoros: 0,
            order: tasks.value.length,
        }
        tasks.value.push(newTask)
        save()
        return newTask
    }

    const updateTask = (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
        const index = tasks.value.findIndex(t => t.id === id)
        if (index !== -1) {
            tasks.value[index] = { ...tasks.value[index], ...updates }
            save()
        }
    }

    const toggleComplete = (id: string) => {
        const task = tasks.value.find(t => t.id === id)
        if (task) {
            task.completed = !task.completed
            task.completedAt = task.completed ? new Date().toISOString() : null
            save()
        }
    }

    const deleteTask = (id: string) => {
        const index = tasks.value.findIndex(t => t.id === id)
        if (index !== -1) {
            tasks.value.splice(index, 1)
            save()
        }
    }

    const reorderTasks = (taskIds: string[]) => {
        taskIds.forEach((id, index) => {
            const task = tasks.value.find(t => t.id === id)
            if (task) {
                task.order = index
            }
        })
        save()
    }

    const incrementPomodoro = (id: string) => {
        const task = tasks.value.find(t => t.id === id)
        if (task) {
            task.completedPomodoros++
            save()
        }
    }

    return {
        // State
        tasks: skipHydrate(tasks),
        // Getters
        allTasks,
        incompleteTasks,
        completedTasks,
        todayTasks,
        thisWeekTasks,
        todayCompletedCount,
        // Actions
        addTask,
        updateTask,
        toggleComplete,
        deleteTask,
        reorderTasks,
        incrementPomodoro,
    }
})
