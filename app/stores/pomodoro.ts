import { defineStore } from 'pinia'

export interface PomodoroSession {
    id: string
    type: 'focus' | 'short-break' | 'long-break'
    duration: number
    taskId: string | null
    note: string
    startedAt: string
    completedAt: string
}

export interface PomodoroSettings {
    focusDuration: number
    shortBreakDuration: number
    longBreakDuration: number
    sessionsBeforeLongBreak: number
}

type TimerStatus = 'idle' | 'running' | 'paused'

export const usePomodoroStore = defineStore('pomodoro', () => {
    // Settings
    const settings = ref<PomodoroSettings>({
        focusDuration: 25,
        shortBreakDuration: 5,
        longBreakDuration: 15,
        sessionsBeforeLongBreak: 4,
    })

    // Timer state
    const type = ref<'focus' | 'short-break' | 'long-break'>('focus')
    const status = ref<TimerStatus>('idle')
    const timeRemaining = ref(settings.value.focusDuration * 60)
    const sessionCount = ref(0)
    const currentTaskId = ref<string | null>(null)
    const timerStartedAt = ref<string | null>(null)

    // Sessions from API
    const sessions = ref<PomodoroSession[]>([])
    const initialized = ref(false)

    // Timer interval
    let timerInterval: ReturnType<typeof setInterval> | undefined

    // Fetch sessions from API
    const fetchSessions = async () => {
        if (initialized.value) return
        try {
            const data = await $fetch<PomodoroSession[]>('/api/pomodoro/sessions')
            sessions.value = data
            initialized.value = true
        } catch (error) {
            console.error('Failed to fetch sessions:', error)
        }
    }

    // Initialize on client side
    if (import.meta.client) {
        fetchSessions()
    }

    // Computed
    const isIdle = computed(() => status.value === 'idle')
    const isRunning = computed(() => status.value === 'running')
    const isPaused = computed(() => status.value === 'paused')

    const formattedTime = computed(() => {
        const minutes = Math.floor(timeRemaining.value / 60)
        const seconds = timeRemaining.value % 60
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    })

    const totalDuration = computed(() => {
        switch (type.value) {
            case 'focus': return settings.value.focusDuration * 60
            case 'short-break': return settings.value.shortBreakDuration * 60
            case 'long-break': return settings.value.longBreakDuration * 60
        }
    })

    const progress = computed(() => {
        return ((totalDuration.value - timeRemaining.value) / totalDuration.value) * 100
    })

    const todayPomodoroCount = computed(() => {
        const today = new Date().toISOString().split('T')[0]
        return sessions.value.filter(s =>
            s.type === 'focus' &&
            s.completedAt.startsWith(today)
        ).length
    })

    const todayFocusMinutes = computed(() => {
        const today = new Date().toISOString().split('T')[0]
        return sessions.value
            .filter(s => s.type === 'focus' && s.completedAt.startsWith(today))
            .reduce((acc, s) => acc + s.duration, 0)
    })

    // Actions
    const setType = (newType: 'focus' | 'short-break' | 'long-break') => {
        if (status.value !== 'idle') return
        type.value = newType
        switch (newType) {
            case 'focus':
                timeRemaining.value = settings.value.focusDuration * 60
                break
            case 'short-break':
                timeRemaining.value = settings.value.shortBreakDuration * 60
                break
            case 'long-break':
                timeRemaining.value = settings.value.longBreakDuration * 60
                break
        }
    }

    const start = () => {
        if (status.value === 'running') return
        status.value = 'running'
        timerStartedAt.value = new Date().toISOString()

        timerInterval = setInterval(() => {
            if (timeRemaining.value > 0) {
                timeRemaining.value--
            } else {
                complete()
            }
        }, 1000)
    }

    const pause = () => {
        if (status.value !== 'running') return
        status.value = 'paused'
        if (timerInterval) {
            clearInterval(timerInterval)
            timerInterval = undefined
        }
    }

    const resume = () => {
        if (status.value !== 'paused') return
        start()
    }

    const stop = () => {
        status.value = 'idle'
        if (timerInterval) {
            clearInterval(timerInterval)
            timerInterval = undefined
        }
        timeRemaining.value = totalDuration.value
        timerStartedAt.value = null
    }

    const skip = () => {
        if (type.value === 'focus') return
        completeBreak()
    }

    const complete = async () => {
        if (timerInterval) {
            clearInterval(timerInterval)
            timerInterval = undefined
        }

        const completedAt = new Date().toISOString()
        const duration = type.value === 'focus'
            ? settings.value.focusDuration
            : type.value === 'short-break'
                ? settings.value.shortBreakDuration
                : settings.value.longBreakDuration

        // Save session to API
        try {
            const session = await $fetch<PomodoroSession>('/api/pomodoro/sessions', {
                method: 'POST',
                body: {
                    type: type.value,
                    duration,
                    taskId: currentTaskId.value,
                    note: '',
                    startedAt: timerStartedAt.value,
                    completedAt,
                },
            })
            sessions.value.unshift(session)
        } catch (error) {
            console.error('Failed to save session:', error)
        }

        // Handle next session
        if (type.value === 'focus') {
            sessionCount.value++
            if (sessionCount.value >= settings.value.sessionsBeforeLongBreak) {
                setType('long-break')
                sessionCount.value = 0
            } else {
                setType('short-break')
            }
        } else {
            setType('focus')
        }

        status.value = 'idle'
        timerStartedAt.value = null
    }

    const completeBreak = () => {
        if (timerInterval) {
            clearInterval(timerInterval)
            timerInterval = undefined
        }
        setType('focus')
        status.value = 'idle'
        timerStartedAt.value = null
    }

    const setCurrentTask = (taskId: string | null) => {
        currentTaskId.value = taskId
    }

    return {
        settings,
        type,
        status,
        timeRemaining,
        sessionCount,
        currentTaskId,
        sessions,
        isIdle,
        isRunning,
        isPaused,
        formattedTime,
        totalDuration,
        progress,
        todayPomodoroCount,
        todayFocusMinutes,
        fetchSessions,
        setType,
        start,
        pause,
        resume,
        stop,
        skip,
        complete,
        setCurrentTask,
    }
})
