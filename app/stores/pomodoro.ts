import { defineStore } from 'pinia'
import { useLocalStorage, useIntervalFn } from '@vueuse/core'

export interface PomodoroSession {
    id: string
    startTime: string
    endTime: string | null
    duration: number // in minutes
    completed: boolean
    taskId: string | null
    note: string
    type: 'focus' | 'short-break' | 'long-break'
}

export interface PomodoroState {
    status: 'idle' | 'running' | 'paused'
    type: 'focus' | 'short-break' | 'long-break'
    timeRemaining: number // in seconds
    currentSession: PomodoroSession | null
    sessions: PomodoroSession[]
    consecutiveFocusSessions: number
}

const generateId = () => `pomodoro_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

export const usePomodoroStore = defineStore('pomodoro', () => {
    const settingsStore = useSettingsStore()

    const state = useLocalStorage<PomodoroState>('exam-sprint-pomodoro', {
        status: 'idle',
        type: 'focus',
        timeRemaining: 25 * 60,
        currentSession: null,
        sessions: [],
        consecutiveFocusSessions: 0,
    })

    // Timer interval
    let timerInterval: ReturnType<typeof useIntervalFn> | null = null

    // Computed
    const isRunning = computed(() => state.value.status === 'running')
    const isPaused = computed(() => state.value.status === 'paused')
    const isIdle = computed(() => state.value.status === 'idle')

    const formattedTime = computed(() => {
        const minutes = Math.floor(state.value.timeRemaining / 60)
        const seconds = state.value.timeRemaining % 60
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    })

    const progress = computed(() => {
        const settings = settingsStore.pomodoroSettings
        let totalSeconds: number

        switch (state.value.type) {
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

        return ((totalSeconds - state.value.timeRemaining) / totalSeconds) * 100
    })

    const todaySessions = computed(() => {
        const today = new Date().toISOString().split('T')[0]
        return state.value.sessions.filter(s =>
            s.completed && s.type === 'focus' && s.startTime.startsWith(today)
        )
    })

    const todayFocusMinutes = computed(() =>
        todaySessions.value.reduce((sum, s) => sum + s.duration, 0)
    )

    const todayPomodoroCount = computed(() => todaySessions.value.length)

    // Private methods
    const tick = () => {
        if (state.value.timeRemaining > 0) {
            state.value.timeRemaining--
        } else {
            completeSession()
        }
    }

    const startTimer = () => {
        if (timerInterval) {
            timerInterval.pause()
        }
        timerInterval = useIntervalFn(tick, 1000)
    }

    const stopTimer = () => {
        if (timerInterval) {
            timerInterval.pause()
            timerInterval = null
        }
    }

    // Actions
    const start = (taskId: string | null = null) => {
        const settings = settingsStore.pomodoroSettings

        state.value.status = 'running'
        state.value.currentSession = {
            id: generateId(),
            startTime: new Date().toISOString(),
            endTime: null,
            duration: settings.focusDuration,
            completed: false,
            taskId,
            note: '',
            type: state.value.type,
        }

        startTimer()
    }

    const pause = () => {
        state.value.status = 'paused'
        stopTimer()
    }

    const resume = () => {
        state.value.status = 'running'
        startTimer()
    }

    const stop = () => {
        stopTimer()

        if (state.value.currentSession) {
            state.value.currentSession.endTime = new Date().toISOString()
            state.value.currentSession.completed = false
            // Don't save incomplete sessions
        }

        reset()
    }

    const completeSession = () => {
        stopTimer()

        if (state.value.currentSession) {
            state.value.currentSession.endTime = new Date().toISOString()
            state.value.currentSession.completed = true
            state.value.sessions.push({ ...state.value.currentSession })

            if (state.value.type === 'focus') {
                state.value.consecutiveFocusSessions++
            }
        }

        // Determine next session type
        const settings = settingsStore.pomodoroSettings

        if (state.value.type === 'focus') {
            if (state.value.consecutiveFocusSessions >= settings.longBreakInterval) {
                state.value.type = 'long-break'
                state.value.timeRemaining = settings.longBreak * 60
                state.value.consecutiveFocusSessions = 0
            } else {
                state.value.type = 'short-break'
                state.value.timeRemaining = settings.shortBreak * 60
            }
        } else {
            state.value.type = 'focus'
            state.value.timeRemaining = settings.focusDuration * 60
        }

        state.value.status = 'idle'
        state.value.currentSession = null
    }

    const skip = () => {
        completeSession()
    }

    const reset = () => {
        const settings = settingsStore.pomodoroSettings
        state.value.status = 'idle'
        state.value.type = 'focus'
        state.value.timeRemaining = settings.focusDuration * 60
        state.value.currentSession = null
    }

    const setType = (type: 'focus' | 'short-break' | 'long-break') => {
        if (state.value.status !== 'idle') return

        const settings = settingsStore.pomodoroSettings
        state.value.type = type

        switch (type) {
            case 'focus':
                state.value.timeRemaining = settings.focusDuration * 60
                break
            case 'short-break':
                state.value.timeRemaining = settings.shortBreak * 60
                break
            case 'long-break':
                state.value.timeRemaining = settings.longBreak * 60
                break
        }
    }

    const updateSessionNote = (note: string) => {
        const lastSession = state.value.sessions[state.value.sessions.length - 1]
        if (lastSession) {
            lastSession.note = note
        }
    }

    return {
        state,
        isRunning,
        isPaused,
        isIdle,
        formattedTime,
        progress,
        todaySessions,
        todayFocusMinutes,
        todayPomodoroCount,
        start,
        pause,
        resume,
        stop,
        skip,
        reset,
        setType,
        updateSessionNote,
    }
})
