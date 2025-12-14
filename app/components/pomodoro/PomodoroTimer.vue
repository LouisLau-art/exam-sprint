<template>
  <UCard class="relative overflow-hidden">
    <!-- Background based on timer type -->
    <div 
      :class="[
        'absolute inset-0 transition-colors duration-500',
        currentType === 'focus' && 'bg-gradient-to-br from-primary-500/20 to-indigo-500/20',
        currentType === 'short-break' && 'bg-gradient-to-br from-green-500/20 to-emerald-500/20',
        currentType === 'long-break' && 'bg-gradient-to-br from-sky-500/20 to-cyan-500/20',
      ]"
    />
    
    <div class="relative">
      <!-- Timer Type Tabs -->
      <div class="flex justify-center gap-2 mb-6">
        <button
          v-for="timerType in timerTypes"
          :key="timerType.value"
          @click="setType(timerType.value)"
          :disabled="!pomodoroStore.isIdle"
          :class="[
            'px-4 py-2 rounded-xl text-sm font-medium transition-all',
            currentType === timerType.value
              ? 'bg-white/80 dark:bg-gray-700/80 shadow-lg text-gray-800 dark:text-gray-100'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
            !pomodoroStore.isIdle && 'cursor-not-allowed opacity-50'
          ]"
        >
          {{ t(`pomodoro.${timerType.label}`) }}
        </button>
      </div>
      
      <!-- Timer Display -->
      <div class="relative flex items-center justify-center mb-8">
        <!-- Progress Ring -->
        <svg class="w-48 h-48 lg:w-56 lg:h-56 transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            :r="radius"
            fill="none"
            stroke="currentColor"
            :stroke-width="strokeWidth"
            class="text-gray-200 dark:text-gray-700"
          />
          <circle
            cx="50%"
            cy="50%"
            :r="radius"
            fill="none"
            :stroke="ringColor"
            :stroke-width="strokeWidth"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="strokeDashoffset"
            stroke-linecap="round"
            class="transition-all duration-1000"
          />
        </svg>
        
        <!-- Time Display (centered over SVG) -->
        <div class="absolute inset-0 flex items-center justify-center flex-col">
          <span class="text-5xl lg:text-6xl font-bold text-gray-800 dark:text-gray-100 font-mono">
            {{ formattedTime }}
          </span>
          <span class="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {{ typeLabel }}
          </span>
        </div>
      </div>
      
      <!-- Controls -->
      <TimerControls />
      
      <!-- Today's Stats -->
      <div class="mt-6 pt-4 border-t border-gray-200/50 dark:border-gray-700/50 flex items-center justify-center gap-6 text-sm">
        <div class="flex items-center gap-2">
          <span class="text-2xl">🍅</span>
          <span class="font-medium text-gray-700 dark:text-gray-200">{{ todayPomodoroCount }}</span>
          <span class="text-gray-500 dark:text-gray-400">{{ t('pomodoro.todayPomodoros') }}</span>
        </div>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-timer" class="text-primary-500" />
          <span class="font-medium text-gray-700 dark:text-gray-200">{{ todayFocusMinutes }}</span>
          <span class="text-gray-500 dark:text-gray-400">{{ t('common.minutes') }}</span>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import TimerControls from './TimerControls.vue'

const { t } = useI18n()
const pomodoroStore = usePomodoroStore()

const timerTypes = [
  { value: 'focus', label: 'focus' },
  { value: 'short-break', label: 'shortBreak' },
  { value: 'long-break', label: 'longBreak' },
] as const

const radius = 90
const strokeWidth = 8
const circumference = 2 * Math.PI * radius

// Use computed to access store properties safely
const currentType = computed(() => pomodoroStore.type || 'focus')
const formattedTime = computed(() => pomodoroStore.formattedTime || '25:00')
const todayPomodoroCount = computed(() => pomodoroStore.todayPomodoroCount || 0)
const todayFocusMinutes = computed(() => pomodoroStore.todayFocusMinutes || 0)
const progress = computed(() => pomodoroStore.progress || 0)

const typeLabel = computed(() => {
  switch (currentType.value) {
    case 'focus': return t('pomodoro.focus')
    case 'short-break': return t('pomodoro.shortBreak')
    case 'long-break': return t('pomodoro.longBreak')
    default: return t('pomodoro.focus')
  }
})

const strokeDashoffset = computed(() => {
  return circumference - (progress.value / 100) * circumference
})

const ringColor = computed(() => {
  switch (currentType.value) {
    case 'focus': return '#6366f1'
    case 'short-break': return '#22c55e'
    case 'long-break': return '#0ea5e9'
    default: return '#6366f1'
  }
})

const setType = (type: 'focus' | 'short-break' | 'long-break') => {
  if (pomodoroStore.isIdle) {
    pomodoroStore.setType(type)
  }
}
</script>
