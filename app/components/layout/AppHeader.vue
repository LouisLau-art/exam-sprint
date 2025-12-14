<template>
  <header class="h-16 glass border-b border-white/10 dark:border-slate-700/50 flex-between px-6 sticky top-0 z-40">
    <!-- Left: Title and Countdown Widget -->
    <div class="flex items-center gap-6">
      <h1 class="text-lg font-semibold text-gradient hidden lg:block">
        {{ pageTitle }}
      </h1>
      
      <!-- Mini Countdown Widget -->
      <div 
        v-if="countdownStore.examCountdown && countdownStore.state.examName" 
        class="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-400 text-sm"
      >
        <span class="i-carbon-timer text-base" />
        <span class="font-medium">{{ countdownStore.state.examName }}</span>
        <span class="font-bold">{{ countdownStore.examCountdown.days }}{{ t('common.days') }}</span>
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
</script>
