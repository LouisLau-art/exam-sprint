import { defineStore, skipHydrate } from 'pinia'
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
    // Use useLocalStorage for automatic persistence
    const examDate = ref<string | null>(null)
    const examName = ref('')
    const milestones = ref<Milestone[]>([])

    // Load from localStorage on client
    if (import.meta.client) {
        const saved = localStorage.getItem('exam-sprint-countdown')
        if (saved) {
            try {
                const data = JSON.parse(saved)
                examDate.value = data.examDate || null
                examName.value = data.examName || ''
                milestones.value = data.milestones || []
            } catch (e) {
                console.error('Failed to load countdown state:', e)
            }
        }
    }

    // Save helper
    const save = () => {
        if (!import.meta.client) return
        localStorage.setItem('exam-sprint-countdown', JSON.stringify({
            examDate: examDate.value,
            examName: examName.value,
            milestones: milestones.value,
        }))
    }

    // Getters
    const examCountdown = computed(() => {
        if (!examDate.value) return null

        const now = new Date()
        const exam = new Date(examDate.value)
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

    const sortedMilestones = computed(() => {
        return [...milestones.value].sort((a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        )
    })

    const upcomingMilestones = computed(() => {
        const now = new Date()
        return sortedMilestones.value.filter(m => new Date(m.date) > now)
    })

    // Actions
    const setExam = (name: string, date: string) => {
        examName.value = name
        examDate.value = date
        save()
    }

    const clearExam = () => {
        examName.value = ''
        examDate.value = null
        save()
    }

    const addMilestone = (name: string, date: string) => {
        const milestone: Milestone = {
            id: generateId(),
            name,
            date,
            color: milestoneColors[milestones.value.length % milestoneColors.length],
        }
        milestones.value.push(milestone)
        save()
        return milestone
    }

    const updateMilestone = (id: string, updates: Partial<Omit<Milestone, 'id'>>) => {
        const index = milestones.value.findIndex(m => m.id === id)
        if (index !== -1) {
            milestones.value[index] = { ...milestones.value[index], ...updates }
            save()
        }
    }

    const deleteMilestone = (id: string) => {
        const index = milestones.value.findIndex(m => m.id === id)
        if (index !== -1) {
            milestones.value.splice(index, 1)
            save()
        }
    }

    const getMilestoneCountdown = (id: string) => {
        const milestone = milestones.value.find(m => m.id === id)
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
    }

    return {
        // State
        examDate: skipHydrate(examDate),
        examName: skipHydrate(examName),
        milestones: skipHydrate(milestones),
        // Getters
        examCountdown,
        sortedMilestones,
        upcomingMilestones,
        // Actions
        setExam,
        clearExam,
        addMilestone,
        updateMilestone,
        deleteMilestone,
        getMilestoneCountdown,
    }
})
