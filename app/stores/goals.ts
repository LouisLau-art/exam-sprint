import { defineStore } from 'pinia'

export interface Goal {
    id: string
    title: string
    description: string
    deadline: string | null
    type: 'task-driven' | 'time-driven'
    target: number
    current: number
    unit: string
    color: string
    createdAt: string
}

export interface GoalsState {
    goals: Goal[]
}

const generateId = () => `goal_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

const goalColors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#0ea5e9',
]

const STORAGE_KEY = 'exam-sprint-goals'

const loadState = (): GoalsState => {
    if (typeof window === 'undefined') {
        return { goals: [] }
    }

    try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
            return JSON.parse(saved)
        }
    } catch (e) {
        console.error('Failed to load goals state:', e)
    }

    return { goals: [] }
}

const saveState = (state: GoalsState) => {
    if (typeof window === 'undefined') return

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (e) {
        console.error('Failed to save goals state:', e)
    }
}

export const useGoalsStore = defineStore('goals', {
    state: (): GoalsState => loadState(),

    getters: {
        allGoals: (state) => state.goals,

        activeGoals: (state) =>
            state.goals.filter(g => g.current < g.target),

        completedGoals: (state) =>
            state.goals.filter(g => g.current >= g.target),
    },

    actions: {
        getGoal(id: string) {
            return this.goals.find(g => g.id === id)
        },

        getProgress(id: string) {
            const goal = this.goals.find(g => g.id === id)
            if (!goal) return 0
            return Math.min(100, Math.round((goal.current / goal.target) * 100))
        },

        addGoal(goalData: Omit<Goal, 'id' | 'createdAt' | 'current' | 'color'>) {
            const newGoal: Goal = {
                ...goalData,
                id: generateId(),
                createdAt: new Date().toISOString(),
                current: 0,
                color: goalColors[this.goals.length % goalColors.length],
            }
            this.goals.push(newGoal)
            saveState(this.$state)
            return newGoal
        },

        updateGoal(id: string, updates: Partial<Omit<Goal, 'id' | 'createdAt'>>) {
            const index = this.goals.findIndex(g => g.id === id)
            if (index !== -1) {
                this.goals[index] = { ...this.goals[index], ...updates }
                saveState(this.$state)
            }
        },

        updateProgress(id: string, value: number) {
            const goal = this.goals.find(g => g.id === id)
            if (goal) {
                goal.current = value
                saveState(this.$state)
            }
        },

        incrementProgress(id: string, amount: number = 1) {
            const goal = this.goals.find(g => g.id === id)
            if (goal) {
                goal.current = Math.min(goal.target, goal.current + amount)
                saveState(this.$state)
            }
        },

        deleteGoal(id: string) {
            const index = this.goals.findIndex(g => g.id === id)
            if (index !== -1) {
                this.goals.splice(index, 1)
                saveState(this.$state)
            }
        },
    },
})
