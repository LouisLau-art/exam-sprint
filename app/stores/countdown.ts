import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export interface Milestone {
    id: string
    name: string
    date: string
    color: string
}

export interface CountdownState {
    examDate: string | null
    examName: string
    milestones: Milestone[]
}

const generateId = () => `milestone_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

const milestoneColors = ['#ef4444', '#f59e0b', '#10b981', '#0ea5e9', '#8b5cf6']

export const useCountdownStore = defineStore('countdown', () => {
    const state = useLocalStorage<CountdownState>('exam-sprint-countdown', {
        examDate: null,
        examName: '',
        milestones: [],
    })

    // Computed
    const examCountdown = computed(() => {
        if (!state.value.examDate) return null

        const now = new Date()
        const exam = new Date(state.value.examDate)
        const diff = exam.getTime() - now.getTime()

        if (diff <= 0) {
            return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 }
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)

        return { days, hours, minutes, seconds, total: diff }
    })

    const sortedMilestones = computed(() =>
        [...state.value.milestones].sort((a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        )
    )

    const upcomingMilestones = computed(() => {
        const now = new Date()
        return sortedMilestones.value.filter(m => new Date(m.date) > now)
    })

    const getMilestoneCountdown = (id: string) => computed(() => {
        const milestone = state.value.milestones.find(m => m.id === id)
        if (!milestone) return null

        const now = new Date()
        const target = new Date(milestone.date)
        const diff = target.getTime() - now.getTime()

        if (diff <= 0) {
            return { days: 0, hours: 0, minutes: 0, total: 0 }
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

        return { days, hours, minutes, total: diff }
    })

    // Actions
    const setExam = (name: string, date: string) => {
        state.value.examName = name
        state.value.examDate = date
    }

    const clearExam = () => {
        state.value.examName = ''
        state.value.examDate = null
    }

    const addMilestone = (name: string, date: string) => {
        const milestone: Milestone = {
            id: generateId(),
            name,
            date,
            color: milestoneColors[state.value.milestones.length % milestoneColors.length],
        }
        state.value.milestones.push(milestone)
        return milestone
    }

    const updateMilestone = (id: string, updates: Partial<Omit<Milestone, 'id'>>) => {
        const index = state.value.milestones.findIndex(m => m.id === id)
        if (index !== -1) {
            state.value.milestones[index] = { ...state.value.milestones[index], ...updates }
        }
    }

    const deleteMilestone = (id: string) => {
        const index = state.value.milestones.findIndex(m => m.id === id)
        if (index !== -1) {
            state.value.milestones.splice(index, 1)
        }
    }

    return {
        state,
        examCountdown,
        sortedMilestones,
        upcomingMilestones,
        getMilestoneCountdown,
        setExam,
        clearExam,
        addMilestone,
        updateMilestone,
        deleteMilestone,
    }
})
