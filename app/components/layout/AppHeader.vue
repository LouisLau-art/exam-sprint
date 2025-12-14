<template>
  <header class="h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 sticky top-0 z-40">
    <!-- Left: Title and Countdown Widget -->
    <div class="flex items-center gap-6">
      <h1 class="text-lg font-semibold bg-gradient-to-r from-primary-500 to-violet-500 bg-clip-text text-transparent hidden lg:block">
        {{ pageTitle }}
      </h1>
      
      <!-- Mini Countdown Widget -->
      <div 
        v-if="showCountdown" 
        class="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 text-sm"
      >
        <UIcon name="i-lucide-timer" class="text-base" />
        <span class="font-medium">{{ examName }}</span>
        <span class="font-bold">{{ daysLeft }}{{ t('common.days') }}</span>
      </div>
    </div>
    
    <!-- Right: Controls -->
    <div class="flex items-center gap-3">
      <!-- Theme Switcher -->
      <ThemeSwitcher />
      
      <!-- Language Switcher -->
      <LanguageSwitcher />
    </div>
  </header>
</template>

<script setup lang="ts">
import ThemeSwitcher from './ThemeSwitcher.vue'
import LanguageSwitcher from './LanguageSwitcher.vue'

const { t } = useI18n()
const route = useRoute()
const countdownStore = useCountdownStore()

const pageTitle = computed(() => {
  const path = route.path
  if (path === '/') return t('nav.home')
  if (path === '/tasks') return t('nav.tasks')
  if (path === '/goals') return t('nav.goals')
  if (path === '/stats') return t('nav.stats')
  return ''
})

// Safe access to store properties
const examName = computed(() => countdownStore.examName || '')
const examCountdown = computed(() => countdownStore.examCountdown)
const daysLeft = computed(() => examCountdown.value?.days || 0)
const showCountdown = computed(() => examCountdown.value && examName.value)
</script>
