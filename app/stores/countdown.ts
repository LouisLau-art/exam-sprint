import { defineStore } from 'pinia'

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

const STORAGE_KEY = 'exam-sprint-countdown'

// Load from localStorage
const loadState = (): CountdownState => {
    if (typeof window === 'undefined') {
        return { examDate: null, examName: '', milestones: [] }
    }

    try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
            return JSON.parse(saved)
        }
    } catch (e) {
        console.error('Failed to load countdown state:', e)
    }

    return { examDate: null, examName: '', milestones: [] }
}

// Save to localStorage
const saveState = (state: CountdownState) => {
    if (typeof window === 'undefined') return

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (e) {
        console.error('Failed to save countdown state:', e)
    }
}

export const useCountdownStore = defineStore('countdown', {
    state: (): CountdownState => loadState(),

    getters: {
        examCountdown: (state) => {
            if (!state.examDate) return null

            const now = new Date()
            const exam = new Date(state.examDate)
            const diff = exam.getTime() - now.getTime()

            if (diff <= 0) {
                return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 }
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24))
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((diff % (1000 * 60)) / 1000)

            return { days, hours, minutes, seconds, total: diff }
        },

        sortedMilestones: (state) => {
            return [...state.milestones].sort((a, b) =>
                new Date(a.date).getTime() - new Date(b.date).getTime()
            )
        },

        upcomingMilestones(): Milestone[] {
            const now = new Date()
            return this.sortedMilestones.filter(m => new Date(m.date) > now)
        },
    },

    actions: {
        setExam(name: string, date: string) {
            this.examName = name
            this.examDate = date
            saveState(this.$state)
        },

        clearExam() {
            this.examName = ''
            this.examDate = null
            saveState(this.$state)
        },

        addMilestone(name: string, date: string) {
            const milestone: Milestone = {
                id: generateId(),
                name,
                date,
                color: milestoneColors[this.milestones.length % milestoneColors.length],
            }
            this.milestones.push(milestone)
            saveState(this.$state)
            return milestone
        },

        updateMilestone(id: string, updates: Partial<Omit<Milestone, 'id'>>) {
            const index = this.milestones.findIndex(m => m.id === id)
            if (index !== -1) {
                this.milestones[index] = { ...this.milestones[index], ...updates }
                saveState(this.$state)
            }
        },

        deleteMilestone(id: string) {
            const index = this.milestones.findIndex(m => m.id === id)
            if (index !== -1) {
                this.milestones.splice(index, 1)
                saveState(this.$state)
            }
        },

        getMilestoneCountdown(id: string) {
            const milestone = this.milestones.find(m => m.id === id)
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
        },
    },
})
