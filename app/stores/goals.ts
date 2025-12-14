import { defineStore, skipHydrate } from 'pinia'

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

const generateId = () => `goal_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

const goalColors = [
    '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#0ea5e9',
]

const STORAGE_KEY = 'exam-sprint-goals'

export const useGoalsStore = defineStore('goals', () => {
    const goals = ref<Goal[]>([])

    // Load from localStorage on client
    if (import.meta.client) {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
            try {
                const data = JSON.parse(saved)
                goals.value = data.goals || []
            } catch (e) {
                console.error('Failed to load goals state:', e)
            }
        }
    }

    const save = () => {
        if (!import.meta.client) return
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            goals: goals.value,
        }))
    }

    // Getters
    const allGoals = computed(() => goals.value)

    const activeGoals = computed(() =>
        goals.value.filter(g => g.current < g.target)
    )

    const completedGoals = computed(() =>
        goals.value.filter(g => g.current >= g.target)
    )

    // Actions
    const getGoal = (id: string) => {
        return goals.value.find(g => g.id === id)
    }

    const getProgress = (id: string) => {
        const goal = goals.value.find(g => g.id === id)
        if (!goal) return 0
        return Math.min(100, Math.round((goal.current / goal.target) * 100))
    }

    const addGoal = (goalData: Omit<Goal, 'id' | 'createdAt' | 'current' | 'color'>) => {
        const newGoal: Goal = {
            ...goalData,
            id: generateId(),
            createdAt: new Date().toISOString(),
            current: 0,
            color: goalColors[goals.value.length % goalColors.length],
        }
        goals.value.push(newGoal)
        save()
        return newGoal
    }

    const updateGoal = (id: string, updates: Partial<Omit<Goal, 'id' | 'createdAt'>>) => {
        const index = goals.value.findIndex(g => g.id === id)
        if (index !== -1) {
            goals.value[index] = { ...goals.value[index], ...updates }
            save()
        }
    }

    const updateProgress = (id: string, value: number) => {
        const goal = goals.value.find(g => g.id === id)
        if (goal) {
            goal.current = value
            save()
        }
    }

    const incrementProgress = (id: string, amount: number = 1) => {
        const goal = goals.value.find(g => g.id === id)
        if (goal) {
            goal.current = Math.min(goal.target, goal.current + amount)
            save()
        }
    }

    const deleteGoal = (id: string) => {
        const index = goals.value.findIndex(g => g.id === id)
        if (index !== -1) {
            goals.value.splice(index, 1)
            save()
        }
    }

    return {
        // State
        goals: skipHydrate(goals),
        // Getters
        allGoals,
        activeGoals,
        completedGoals,
        // Actions
        getGoal,
        getProgress,
        addGoal,
        updateGoal,
        updateProgress,
        incrementProgress,
        deleteGoal,
    }
})
