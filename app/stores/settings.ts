import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

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

export const useSettingsStore = defineStore('settings', () => {
    const settings = useLocalStorage<SettingsState>('exam-sprint-settings', defaultSettings)

    // Theme
    const theme = computed(() => settings.value.theme)
    const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
        settings.value.theme = newTheme
    }

    // Locale
    const locale = computed(() => settings.value.locale)
    const setLocale = (newLocale: 'zh-CN' | 'en-US') => {
        settings.value.locale = newLocale
    }

    // Pomodoro settings
    const pomodoroSettings = computed(() => settings.value.pomodoro)
    const updatePomodoroSettings = (newSettings: Partial<PomodoroSettings>) => {
        settings.value.pomodoro = { ...settings.value.pomodoro, ...newSettings }
    }

    // Countdown settings
    const countdownSettings = computed(() => settings.value.countdown)
    const updateCountdownSettings = (newSettings: Partial<CountdownSettings>) => {
        settings.value.countdown = { ...settings.value.countdown, ...newSettings }
    }

    // AI settings
    const aiSettings = computed(() => settings.value.ai)
    const updateAISettings = (newSettings: Partial<AISettings>) => {
        settings.value.ai = { ...settings.value.ai, ...newSettings }
    }

    return {
        settings,
        theme,
        setTheme,
        locale,
        setLocale,
        pomodoroSettings,
        updatePomodoroSettings,
        countdownSettings,
        updateCountdownSettings,
        aiSettings,
        updateAISettings,
    }
})
