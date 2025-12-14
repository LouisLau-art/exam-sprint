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
    color?: string
    createdAt?: string
    updatedAt?: string
}

export const useGoalsStore = defineStore('goals', () => {
    const goals = ref<Goal[]>([])
    const loading = ref(false)
    const initialized = ref(false)

    // Fetch all goals from API
    const fetchGoals = async () => {
        if (initialized.value) return
        loading.value = true
        try {
            const data = await $fetch<Goal[]>('/api/goals')
            goals.value = data
            initialized.value = true
        } catch (error) {
            console.error('Failed to fetch goals:', error)
        } finally {
            loading.value = false
        }
    }

    // Initialize on client side
    if (import.meta.client) {
        fetchGoals()
    }

    // Computed
    const allGoals = computed(() => goals.value)

    const activeGoals = computed(() =>
        goals.value.filter(g => g.current < g.target)
    )

    const completedGoals = computed(() =>
        goals.value.filter(g => g.current >= g.target)
    )

    // Actions
    const addGoal = async (goalData: Omit<Goal, 'id' | 'current' | 'createdAt' | 'updatedAt'>) => {
        try {
            const newGoal = await $fetch<Goal>('/api/goals', {
                method: 'POST',
                body: { ...goalData, current: 0 },
            })
            goals.value.unshift(newGoal)
            return newGoal
        } catch (error) {
            console.error('Failed to add goal:', error)
            throw error
        }
    }

    const updateGoal = async (id: string, updates: Partial<Goal>) => {
        try {
            await $fetch(`/api/goals/${id}`, {
                method: 'PUT',
                body: updates,
            })
            const index = goals.value.findIndex(g => g.id === id)
            if (index !== -1) {
                goals.value[index] = { ...goals.value[index], ...updates }
            }
        } catch (error) {
            console.error('Failed to update goal:', error)
            throw error
        }
    }

    const deleteGoal = async (id: string) => {
        try {
            await $fetch(`/api/goals/${id}`, { method: 'DELETE' })
            goals.value = goals.value.filter(g => g.id !== id)
        } catch (error) {
            console.error('Failed to delete goal:', error)
            throw error
        }
    }

    const incrementGoalProgress = async (id: string, amount: number = 1) => {
        const goal = goals.value.find(g => g.id === id)
        if (goal) {
            await updateGoal(id, { current: goal.current + amount })
        }
    }

    const getGoalProgress = (id: string) => {
        const goal = goals.value.find(g => g.id === id)
        if (!goal) return 0
        return Math.min(100, Math.round((goal.current / goal.target) * 100))
    }

    return {
        goals,
        loading,
        allGoals,
        activeGoals,
        completedGoals,
        fetchGoals,
        addGoal,
        updateGoal,
        deleteGoal,
        incrementGoalProgress,
        getGoalProgress,
    }
})
