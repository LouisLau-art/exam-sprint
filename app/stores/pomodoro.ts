import { defineStore } from 'pinia'

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

export interface PomodoroState {
    status: 'idle' | 'running' | 'paused'
    type: 'focus' | 'short-break' | 'long-break'
    timeRemaining: number
    currentSession: PomodoroSession | null
    sessions: PomodoroSession[]
    consecutiveFocusSessions: number
}

const generateId = () => `pomodoro_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

const STORAGE_KEY = 'exam-sprint-pomodoro'
const SETTINGS_KEY = 'exam-sprint-settings'

const getSettings = () => {
    if (typeof window === 'undefined') {
        return { focusDuration: 25, shortBreak: 5, longBreak: 15, longBreakInterval: 4 }
    }
    try {
        const saved = localStorage.getItem(SETTINGS_KEY)
        if (saved) {
            const settings = JSON.parse(saved)
            return settings.pomodoro || { focusDuration: 25, shortBreak: 5, longBreak: 15, longBreakInterval: 4 }
        }
    } catch (e) { }
    return { focusDuration: 25, shortBreak: 5, longBreak: 15, longBreakInterval: 4 }
}

const loadState = (): PomodoroState => {
    const settings = getSettings()

    if (typeof window === 'undefined') {
        return {
            status: 'idle',
            type: 'focus',
            timeRemaining: settings.focusDuration * 60,
            currentSession: null,
            sessions: [],
            consecutiveFocusSessions: 0,
        }
    }

    try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
            const state = JSON.parse(saved)
            // Reset running state on load
            state.status = 'idle'
            state.currentSession = null
            state.timeRemaining = settings.focusDuration * 60
            return state
        }
    } catch (e) {
        console.error('Failed to load pomodoro state:', e)
    }

    return {
        status: 'idle',
        type: 'focus',
        timeRemaining: settings.focusDuration * 60,
        currentSession: null,
        sessions: [],
        consecutiveFocusSessions: 0,
    }
}

const saveState = (state: PomodoroState) => {
    if (typeof window === 'undefined') return

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            sessions: state.sessions,
            consecutiveFocusSessions: state.consecutiveFocusSessions,
        }))
    } catch (e) {
        console.error('Failed to save pomodoro state:', e)
    }
}

export const usePomodoroStore = defineStore('pomodoro', {
    state: (): PomodoroState => loadState(),

    getters: {
        isRunning: (state) => state.status === 'running',
        isPaused: (state) => state.status === 'paused',
        isIdle: (state) => state.status === 'idle',

        formattedTime: (state) => {
            const minutes = Math.floor(state.timeRemaining / 60)
            const seconds = state.timeRemaining % 60
            return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        },

        progress: (state) => {
            const settings = getSettings()
            let totalSeconds: number

            switch (state.type) {
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

            return ((totalSeconds - state.timeRemaining) / totalSeconds) * 100
        },

        todaySessions: (state) => {
            const today = new Date().toISOString().split('T')[0]
            return state.sessions.filter(s =>
                s.completed && s.type === 'focus' && s.startTime.startsWith(today)
            )
        },

        todayFocusMinutes(): number {
            return this.todaySessions.reduce((sum: number, s: PomodoroSession) => sum + s.duration, 0)
        },

        todayPomodoroCount(): number {
            return this.todaySessions.length
        },
    },

    actions: {
        start(taskId: string | null = null) {
            const settings = getSettings()

            this.status = 'running'
            this.currentSession = {
                id: generateId(),
                startTime: new Date().toISOString(),
                endTime: null,
                duration: settings.focusDuration,
                completed: false,
                taskId,
                note: '',
                type: this.type,
            }

            this._startTimer()
        },

        pause() {
            this.status = 'paused'
            this._stopTimer()
        },

        resume() {
            this.status = 'running'
            this._startTimer()
        },

        stop() {
            this._stopTimer()

            if (this.currentSession) {
                this.currentSession.endTime = new Date().toISOString()
                this.currentSession.completed = false
            }

            this.reset()
        },

        skip() {
            this._completeSession()
        },

        reset() {
            const settings = getSettings()
            this.status = 'idle'
            this.type = 'focus'
            this.timeRemaining = settings.focusDuration * 60
            this.currentSession = null
        },

        setType(type: 'focus' | 'short-break' | 'long-break') {
            if (this.status !== 'idle') return

            const settings = getSettings()
            this.type = type

            switch (type) {
                case 'focus':
                    this.timeRemaining = settings.focusDuration * 60
                    break
                case 'short-break':
                    this.timeRemaining = settings.shortBreak * 60
                    break
                case 'long-break':
                    this.timeRemaining = settings.longBreak * 60
                    break
            }
        },

        updateSessionNote(note: string) {
            const lastSession = this.sessions[this.sessions.length - 1]
            if (lastSession) {
                lastSession.note = note
                saveState(this.$state)
            }
        },

        _timerId: null as NodeJS.Timeout | null,

        _startTimer() {
            if ((this as any)._timerId) {
                clearInterval((this as any)._timerId)
            }

            (this as any)._timerId = setInterval(() => {
                if (this.timeRemaining > 0) {
                    this.timeRemaining--
                } else {
                    this._completeSession()
                }
            }, 1000)
        },

        _stopTimer() {
            if ((this as any)._timerId) {
                clearInterval((this as any)._timerId)
                    ; (this as any)._timerId = null
            }
        },

        _completeSession() {
            this._stopTimer()

            if (this.currentSession) {
                this.currentSession.endTime = new Date().toISOString()
                this.currentSession.completed = true
                this.sessions.push({ ...this.currentSession })

                if (this.type === 'focus') {
                    this.consecutiveFocusSessions++
                }

                saveState(this.$state)
            }

            const settings = getSettings()

            if (this.type === 'focus') {
                if (this.consecutiveFocusSessions >= settings.longBreakInterval) {
                    this.type = 'long-break'
                    this.timeRemaining = settings.longBreak * 60
                    this.consecutiveFocusSessions = 0
                } else {
                    this.type = 'short-break'
                    this.timeRemaining = settings.shortBreak * 60
                }
            } else {
                this.type = 'focus'
                this.timeRemaining = settings.focusDuration * 60
            }

            this.status = 'idle'
            this.currentSession = null
        },
    },
})
