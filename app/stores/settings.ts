import { defineStore } from 'pinia'

export interface PomodoroSettings {
    focusDuration: number
    shortBreak: number
    longBreak: number
    longBreakInterval: number
}

export interface CountdownSettings {
    examDate: string | null
    examName: string
}

export interface AISettings {
    apiBase: string
    apiKey: string
    modelId: string
}

export interface SettingsState {
    theme: 'light' | 'dark' | 'system'
    locale: 'zh-CN' | 'en-US'
    pomodoro: PomodoroSettings
    countdown: CountdownSettings
    ai: AISettings
}

const STORAGE_KEY = 'exam-sprint-settings'

const defaultSettings: SettingsState = {
    theme: 'system',
    locale: 'zh-CN',
    pomodoro: {
        focusDuration: 25,
        shortBreak: 5,
        longBreak: 15,
        longBreakInterval: 4,
    },
    countdown: {
        examDate: null,
        examName: '',
    },
    ai: {
        apiBase: '',
        apiKey: '',
        modelId: '',
    },
}

const loadState = (): SettingsState => {
    if (typeof window === 'undefined') {
        return { ...defaultSettings }
    }

    try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
            return { ...defaultSettings, ...JSON.parse(saved) }
        }
    } catch (e) {
        console.error('Failed to load settings:', e)
    }

    return { ...defaultSettings }
}

const saveState = (state: SettingsState) => {
    if (typeof window === 'undefined') return

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (e) {
        console.error('Failed to save settings:', e)
    }
}

export const useSettingsStore = defineStore('settings', {
    state: (): SettingsState => loadState(),

    actions: {
        setTheme(newTheme: 'light' | 'dark' | 'system') {
            this.theme = newTheme
            saveState(this.$state)
        },

        setLocale(newLocale: 'zh-CN' | 'en-US') {
            this.locale = newLocale
            saveState(this.$state)
        },

        updatePomodoroSettings(newSettings: Partial<PomodoroSettings>) {
            this.pomodoro = { ...this.pomodoro, ...newSettings }
            saveState(this.$state)
        },

        updateCountdownSettings(newSettings: Partial<CountdownSettings>) {
            this.countdown = { ...this.countdown, ...newSettings }
            saveState(this.$state)
        },

        updateAISettings(newSettings: Partial<AISettings>) {
            this.ai = { ...this.ai, ...newSettings }
            saveState(this.$state)
        },
    },
})
