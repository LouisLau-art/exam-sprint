import { defineStore } from 'pinia'

export interface Milestone {
    id: string
    name: string
    date: string
    color: string
}

export interface CountdownState {
    examName: string | null
    examDate: string | null
    milestones: Milestone[]
}

export const useCountdownStore = defineStore('countdown', () => {
    const examName = ref<string | null>(null)
    const examDate = ref<string | null>(null)
    const milestones = ref<Milestone[]>([])
    const loading = ref(false)
    const initialized = ref(false)

    // Fetch countdown data from API
    const fetchCountdown = async () => {
        if (initialized.value) return
        loading.value = true
        try {
            const data = await $fetch<CountdownState>('/api/countdown')
            examName.value = data.examName
            examDate.value = data.examDate
            milestones.value = data.milestones
            initialized.value = true
        } catch (error) {
            console.error('Failed to fetch countdown:', error)
        } finally {
            loading.value = false
        }
    }

    // Initialize on client side
    if (import.meta.client) {
        fetchCountdown()
    }

    // Computed
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

    const upcomingMilestones = computed(() => {
        const now = new Date()
        return milestones.value
            .filter(m => new Date(m.date) > now)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    })

    // Actions
    const setExam = async (name: string, date: string) => {
        try {
            await $fetch('/api/countdown', {
                method: 'PUT',
                body: { examName: name, examDate: date },
            })
            examName.value = name
            examDate.value = date
        } catch (error) {
            console.error('Failed to set exam:', error)
            throw error
        }
    }

    const addMilestone = async (name: string, date: string) => {
        try {
            const newMilestone = await $fetch<Milestone>('/api/countdown/milestones', {
                method: 'POST',
                body: { name, date },
            })
            milestones.value.push(newMilestone)
        } catch (error) {
            console.error('Failed to add milestone:', error)
            throw error
        }
    }

    const deleteMilestone = async (id: string) => {
        try {
            await $fetch(`/api/countdown/milestones/${id}`, { method: 'DELETE' })
            milestones.value = milestones.value.filter(m => m.id !== id)
        } catch (error) {
            console.error('Failed to delete milestone:', error)
            throw error
        }
    }

    const getMilestoneCountdown = (id: string) => {
        const milestone = milestones.value.find(m => m.id === id)
        if (!milestone) return null

        const now = new Date()
        const target = new Date(milestone.date)
        const diff = target.getTime() - now.getTime()

        if (diff <= 0) return { days: 0 }

        return { days: Math.ceil(diff / (1000 * 60 * 60 * 24)) }
    }

    return {
        examName,
        examDate,
        milestones,
        loading,
        examCountdown,
        upcomingMilestones,
        fetchCountdown,
        setExam,
        addMilestone,
        deleteMilestone,
        getMilestoneCountdown,
    }
})
