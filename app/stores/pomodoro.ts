import { defineStore, skipHydrate } from 'pinia'

export interface PomodoroSession {
    id: string
    startTime: string
    endTime: string | null
    duration: number
    completed: boolean
    taskId: string | null
    note: string
    type: 'focus' | 'short-break' | 'long-break'
}

const generateId = () => `pomodoro_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

const STORAGE_KEY = 'exam-sprint-pomodoro'

const getSettings = () => {
    return { focusDuration: 25, shortBreak: 5, longBreak: 15, longBreakInterval: 4 }
}

export const usePomodoroStore = defineStore('pomodoro', () => {
    // State
    const status = ref<'idle' | 'running' | 'paused'>('idle')
    const type = ref<'focus' | 'short-break' | 'long-break'>('focus')
    const timeRemaining = ref(25 * 60)
    const currentSession = ref<PomodoroSession | null>(null)
    const sessions = ref<PomodoroSession[]>([])
    const consecutiveFocusSessions = ref(0)

    let timerId: NodeJS.Timeout | null = null

    // Load sessions from localStorage on client
    if (import.meta.client) {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
            try {
                const data = JSON.parse(saved)
                sessions.value = data.sessions || []
                consecutiveFocusSessions.value = data.consecutiveFocusSessions || 0
            } catch (e) {
                console.error('Failed to load pomodoro state:', e)
            }
        }
    }

    const save = () => {
        if (!import.meta.client) return
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            sessions: sessions.value,
            consecutiveFocusSessions: consecutiveFocusSessions.value,
        }))
    }

    // Getters
    const isRunning = computed(() => status.value === 'running')
    const isPaused = computed(() => status.value === 'paused')
    const isIdle = computed(() => status.value === 'idle')

    const formattedTime = computed(() => {
        const minutes = Math.floor(timeRemaining.value / 60)
        const seconds = timeRemaining.value % 60
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    })

    const progress = computed(() => {
        const settings = getSettings()
        let totalSeconds: number

        switch (type.value) {
            case 'focus':
                totalSeconds = settings.focusDuration * 60
                break
            case 'short-break':
                totalSeconds = settings.shortBreak * 60
                break
            case 'long-break':
                totalSeconds = settings.longBreak * 60
                break
        }

        return ((totalSeconds - timeRemaining.value) / totalSeconds) * 100
    })

    const todaySessions = computed(() => {
        const today = new Date().toISOString().split('T')[0]
        return sessions.value.filter(s =>
            s.completed && s.type === 'focus' && s.startTime.startsWith(today)
        )
    })

    const todayFocusMinutes = computed(() => {
        return todaySessions.value.reduce((sum, s) => sum + s.duration, 0)
    })

    const todayPomodoroCount = computed(() => {
        return todaySessions.value.length
    })

    // Actions
    const start = (taskId: string | null = null) => {
        const settings = getSettings()

        status.value = 'running'
        currentSession.value = {
            id: generateId(),
            startTime: new Date().toISOString(),
            endTime: null,
            duration: settings.focusDuration,
            completed: false,
            taskId,
            note: '',
            type: type.value,
        }

        startTimer()
    }

    const pause = () => {
        status.value = 'paused'
        stopTimer()
    }

    const resume = () => {
        status.value = 'running'
        startTimer()
    }

    const stop = () => {
        stopTimer()

        if (currentSession.value) {
            currentSession.value.endTime = new Date().toISOString()
            currentSession.value.completed = false
        }

        reset()
    }

    const skip = () => {
        completeSession()
    }

    const reset = () => {
        const settings = getSettings()
        status.value = 'idle'
        type.value = 'focus'
        timeRemaining.value = settings.focusDuration * 60
        currentSession.value = null
    }

    const setType = (newType: 'focus' | 'short-break' | 'long-break') => {
        if (status.value !== 'idle') return

        const settings = getSettings()
        type.value = newType

        switch (newType) {
            case 'focus':
                timeRemaining.value = settings.focusDuration * 60
                break
            case 'short-break':
                timeRemaining.value = settings.shortBreak * 60
                break
            case 'long-break':
                timeRemaining.value = settings.longBreak * 60
                break
        }
    }

    const startTimer = () => {
        if (timerId) {
            clearInterval(timerId)
        }

        timerId = setInterval(() => {
            if (timeRemaining.value > 0) {
                timeRemaining.value--
            } else {
                completeSession()
            }
        }, 1000)
    }

    const stopTimer = () => {
        if (timerId) {
            clearInterval(timerId)
            timerId = null
        }
    }

    const completeSession = () => {
        stopTimer()

        if (currentSession.value) {
            currentSession.value.endTime = new Date().toISOString()
            currentSession.value.completed = true
            sessions.value.push({ ...currentSession.value })

            if (type.value === 'focus') {
                consecutiveFocusSessions.value++
            }

            save()
        }

        const settings = getSettings()

        if (type.value === 'focus') {
            if (consecutiveFocusSessions.value >= settings.longBreakInterval) {
                type.value = 'long-break'
                timeRemaining.value = settings.longBreak * 60
                consecutiveFocusSessions.value = 0
            } else {
                type.value = 'short-break'
                timeRemaining.value = settings.shortBreak * 60
            }
        } else {
            type.value = 'focus'
            timeRemaining.value = settings.focusDuration * 60
        }

        status.value = 'idle'
        currentSession.value = null
    }

    return {
        // State
        status: skipHydrate(status),
        type: skipHydrate(type),
        timeRemaining: skipHydrate(timeRemaining),
        currentSession: skipHydrate(currentSession),
        sessions: skipHydrate(sessions),
        consecutiveFocusSessions: skipHydrate(consecutiveFocusSessions),
        // Getters
        isRunning,
        isPaused,
        isIdle,
        formattedTime,
        progress,
        todaySessions,
        todayFocusMinutes,
        todayPomodoroCount,
        // Actions
        start,
        pause,
        resume,
        stop,
        skip,
        reset,
        setType,
    }
})
