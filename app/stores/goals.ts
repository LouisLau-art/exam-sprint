import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

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
    '#6366f1', // Indigo
    '#8b5cf6', // Violet  
    '#ec4899', // Pink
    '#f59e0b', // Amber
    '#10b981', // Emerald
    '#0ea5e9', // Sky
]

export const useGoalsStore = defineStore('goals', () => {
    const state = useLocalStorage<GoalsState>('exam-sprint-goals', { goals: [] })

    // Getters
    const allGoals = computed(() => state.value.goals)

    const activeGoals = computed(() =>
        state.value.goals.filter(g => g.current < g.target)
    )

    const completedGoals = computed(() =>
        state.value.goals.filter(g => g.current >= g.target)
    )

    const getGoal = (id: string) => computed(() =>
        state.value.goals.find(g => g.id === id)
    )

    const getProgress = (id: string) => computed(() => {
        const goal = state.value.goals.find(g => g.id === id)
        if (!goal) return 0
        return Math.min(100, Math.round((goal.current / goal.target) * 100))
    })

    // Actions
    const addGoal = (goalData: Omit<Goal, 'id' | 'createdAt' | 'current' | 'color'>) => {
        const newGoal: Goal = {
            ...goalData,
            id: generateId(),
            createdAt: new Date().toISOString(),
            current: 0,
            color: goalColors[state.value.goals.length % goalColors.length],
        }
        state.value.goals.push(newGoal)
        return newGoal
    }

    const updateGoal = (id: string, updates: Partial<Omit<Goal, 'id' | 'createdAt'>>) => {
        const index = state.value.goals.findIndex(g => g.id === id)
        if (index !== -1) {
            state.value.goals[index] = { ...state.value.goals[index], ...updates }
        }
    }

    const updateProgress = (id: string, value: number) => {
        const goal = state.value.goals.find(g => g.id === id)
        if (goal) {
            goal.current = value
        }
    }

    const incrementProgress = (id: string, amount: number = 1) => {
        const goal = state.value.goals.find(g => g.id === id)
        if (goal) {
            goal.current = Math.min(goal.target, goal.current + amount)
        }
    }

    const deleteGoal = (id: string) => {
        const index = state.value.goals.findIndex(g => g.id === id)
        if (index !== -1) {
            state.value.goals.splice(index, 1)
        }
    }

    return {
        state,
        allGoals,
        activeGoals,
        completedGoals,
        getGoal,
        getProgress,
        addGoal,
        updateGoal,
        updateProgress,
        incrementProgress,
        deleteGoal,
    }
})
