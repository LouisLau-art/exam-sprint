import { defineStore } from 'pinia'

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

const STORAGE_KEY = 'exam-sprint-tasks'

const loadState = (): TasksState => {
    if (typeof window === 'undefined') {
        return { tasks: [] }
    }

    try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
            return JSON.parse(saved)
        }
    } catch (e) {
        console.error('Failed to load tasks state:', e)
    }

    return { tasks: [] }
}

const saveState = (state: TasksState) => {
    if (typeof window === 'undefined') return

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (e) {
        console.error('Failed to save tasks state:', e)
    }
}

export const useTasksStore = defineStore('tasks', {
    state: (): TasksState => loadState(),

    getters: {
        allTasks: (state) => state.tasks,

        incompleteTasks: (state) =>
            state.tasks.filter(t => !t.completed).sort((a, b) => a.order - b.order),

        completedTasks: (state) =>
            state.tasks.filter(t => t.completed),

        todayTasks: (state) => {
            const today = new Date().toISOString().split('T')[0]
            return state.tasks.filter(t => {
                if (t.completed) return false
                if (!t.dueDate) return true
                return t.dueDate <= today
            }).sort((a, b) => {
                const priorityOrder = { P0: 0, P1: 1, P2: 2 }
                const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
                if (priorityDiff !== 0) return priorityDiff
                return a.order - b.order
            })
        },

        thisWeekTasks: (state) => {
            const today = new Date()
            const weekEnd = new Date(today)
            weekEnd.setDate(today.getDate() + 7)
            const weekEndStr = weekEnd.toISOString().split('T')[0]

            return state.tasks.filter(t => {
                if (t.completed) return false
                if (!t.dueDate) return false
                return t.dueDate <= weekEndStr
            }).sort((a, b) => a.order - b.order)
        },

        todayCompletedCount: (state) => {
            const today = new Date().toISOString().split('T')[0]
            return state.tasks.filter(t =>
                t.completed && t.completedAt?.startsWith(today)
            ).length
        },
    },

    actions: {
        addTask(taskData: Omit<Task, 'id' | 'createdAt' | 'completedAt' | 'order' | 'completedPomodoros'>) {
            const newTask: Task = {
                ...taskData,
                id: generateId(),
                createdAt: new Date().toISOString(),
                completedAt: null,
                completedPomodoros: 0,
                order: this.tasks.length,
            }
            this.tasks.push(newTask)
            saveState(this.$state)
            return newTask
        },

        updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) {
            const index = this.tasks.findIndex(t => t.id === id)
            if (index !== -1) {
                this.tasks[index] = { ...this.tasks[index], ...updates }
                saveState(this.$state)
            }
        },

        toggleComplete(id: string) {
            const task = this.tasks.find(t => t.id === id)
            if (task) {
                task.completed = !task.completed
                task.completedAt = task.completed ? new Date().toISOString() : null
                saveState(this.$state)
            }
        },

        deleteTask(id: string) {
            const index = this.tasks.findIndex(t => t.id === id)
            if (index !== -1) {
                this.tasks.splice(index, 1)
                saveState(this.$state)
            }
        },

        reorderTasks(taskIds: string[]) {
            taskIds.forEach((id, index) => {
                const task = this.tasks.find(t => t.id === id)
                if (task) {
                    task.order = index
                }
            })
            saveState(this.$state)
        },

        incrementPomodoro(id: string) {
            const task = this.tasks.find(t => t.id === id)
            if (task) {
                task.completedPomodoros++
                saveState(this.$state)
            }
        },
    },
})
