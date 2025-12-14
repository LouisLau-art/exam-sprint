// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-12-14',
    future: {
        compatibilityVersion: 4,
    },
    devtools: { enabled: true },

    modules: [
        '@nuxt/ui',
        '@pinia/nuxt',
        '@vueuse/nuxt',
        '@nuxtjs/i18n',
    ],

    css: ['~/assets/css/main.css'],

    i18n: {
        locales: [
            { code: 'zh-CN', name: '中文', file: 'zh-CN.json' },
            { code: 'en-US', name: 'English', file: 'en-US.json' },
        ],
        defaultLocale: 'zh-CN',
        lazy: true,
        langDir: '../i18n/locales',
        strategy: 'no_prefix',
        detectBrowserLanguage: {
            useCookie: true,
            cookieKey: 'exam_sprint_lang',
            fallbackLocale: 'zh-CN',
        },
    },

    app: {
        head: {
            title: 'ExamSprint - 备考管理系统',
            meta: [
                { name: 'description', content: 'Personal exam preparation management system' },
                { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            ],
            link: [
                { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
            ],
        },
    },

    typescript: {
        strict: true,
    },
})
