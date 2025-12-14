import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

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

export interface TasksState {
    tasks: Task[]
}

const generateId = () => `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

export const useTasksStore = defineStore('tasks', () => {
    const state = useLocalStorage<TasksState>('exam-sprint-tasks', { tasks: [] })

    // Getters
    const allTasks = computed(() => state.value.tasks)

    const incompleteTasks = computed(() =>
        state.value.tasks.filter(t => !t.completed).sort((a, b) => a.order - b.order)
    )

    const completedTasks = computed(() =>
        state.value.tasks.filter(t => t.completed)
    )

    const todayTasks = computed(() => {
        const today = new Date().toISOString().split('T')[0]
        return state.value.tasks.filter(t => {
            if (t.completed) return false
            if (!t.dueDate) return true // Tasks without due date show in "today"
            return t.dueDate <= today
        }).sort((a, b) => {
            // Sort by priority first, then by order
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

        return state.value.tasks.filter(t => {
            if (t.completed) return false
            if (!t.dueDate) return false
            return t.dueDate <= weekEndStr
        }).sort((a, b) => a.order - b.order)
    })

    const tasksByGoal = (goalId: string) => computed(() =>
        state.value.tasks.filter(t => t.goalId === goalId)
    )

    const todayCompletedCount = computed(() => {
        const today = new Date().toISOString().split('T')[0]
        return state.value.tasks.filter(t =>
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
            order: state.value.tasks.length,
        }
        state.value.tasks.push(newTask)
        return newTask
    }

    const updateTask = (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
        const index = state.value.tasks.findIndex(t => t.id === id)
        if (index !== -1) {
            state.value.tasks[index] = { ...state.value.tasks[index], ...updates }
        }
    }

    const toggleComplete = (id: string) => {
        const task = state.value.tasks.find(t => t.id === id)
        if (task) {
            task.completed = !task.completed
            task.completedAt = task.completed ? new Date().toISOString() : null
        }
    }

    const deleteTask = (id: string) => {
        const index = state.value.tasks.findIndex(t => t.id === id)
        if (index !== -1) {
            state.value.tasks.splice(index, 1)
        }
    }

    const reorderTasks = (taskIds: string[]) => {
        taskIds.forEach((id, index) => {
            const task = state.value.tasks.find(t => t.id === id)
            if (task) {
                task.order = index
            }
        })
    }

    const incrementPomodoro = (id: string) => {
        const task = state.value.tasks.find(t => t.id === id)
        if (task) {
            task.completedPomodoros++
        }
    }

    return {
        state,
        allTasks,
        incompleteTasks,
        completedTasks,
        todayTasks,
        thisWeekTasks,
        tasksByGoal,
        todayCompletedCount,
        addTask,
        updateTask,
        toggleComplete,
        deleteTask,
        reorderTasks,
        incrementPomodoro,
    }
})
