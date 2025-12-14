import {
    defineConfig,
    presetUno,
    presetAttributify,
    presetIcons,
    presetTypography,
    transformerDirectives,
    transformerVariantGroup,
} from 'unocss'

export default defineConfig({
    presets: [
        presetUno(),
        presetAttributify(),
        presetIcons({
            scale: 1.2,
            warn: true,
            extraProperties: {
                'display': 'inline-block',
                'vertical-align': 'middle',
            },
        }),
        presetTypography(),
    ],
    transformers: [
        transformerDirectives(),
        transformerVariantGroup(),
    ],
    theme: {
        colors: {
            primary: {
                50: '#eef2ff',
                100: '#e0e7ff',
                200: '#c7d2fe',
                300: '#a5b4fc',
                400: '#818cf8',
                500: '#6366f1',
                600: '#4f46e5',
                700: '#4338ca',
                800: '#3730a3',
                900: '#312e81',
            },
            surface: {
                light: '#ffffff',
                dark: '#1e293b',
            },
        },
    },
    shortcuts: {
        // Glassmorphism effects
        'glass': 'bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50',
        'glass-strong': 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl border border-white/30 dark:border-slate-700/60',
        'glass-subtle': 'bg-white/50 dark:bg-slate-800/50 backdrop-blur-lg border border-white/10 dark:border-slate-700/30',

        // Layout
        'flex-center': 'flex items-center justify-center',
        'flex-between': 'flex items-center justify-between',

        // Button variants
        'btn': 'px-4 py-2 rounded-xl font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
        'btn-primary': 'btn bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40',
        'btn-secondary': 'btn glass hover:bg-white/80 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200',
        'btn-ghost': 'btn hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300',

        // Card styles
        'card': 'glass rounded-2xl p-6 shadow-xl shadow-slate-900/5 dark:shadow-slate-900/30',
        'card-hover': 'card hover:shadow-2xl hover:shadow-slate-900/10 dark:hover:shadow-slate-900/40 transition-shadow duration-300',

        // Input styles
        'input': 'w-full px-4 py-3 rounded-xl glass text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all duration-200',

        // Text styles
        'text-gradient': 'bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent',
    },
    safelist: [
        'i-carbon-sun',
        'i-carbon-moon',
        'i-carbon-laptop',
        'i-carbon-translate',
        'i-carbon-home',
        'i-carbon-task',
        'i-carbon-target',
        'i-carbon-chart-bar',
        'i-carbon-timer',
        'i-carbon-play-filled',
        'i-carbon-pause-filled',
        'i-carbon-stop-filled',
        'i-carbon-add',
        'i-carbon-checkmark',
        'i-carbon-close',
        'i-carbon-edit',
        'i-carbon-trash-can',
        'i-carbon-chevron-down',
        'i-carbon-chevron-right',
        'i-carbon-calendar',
        'i-carbon-flag',
        'i-carbon-tag',
    ],
})
