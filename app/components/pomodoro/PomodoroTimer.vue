<template>
  <Card class="relative overflow-hidden">
    <!-- Background based on timer type -->
    <div 
      :class="[
        'absolute inset-0 transition-colors duration-500',
        pomodoroStore.state.type === 'focus' && 'bg-gradient-to-br from-primary-500/20 to-indigo-500/20',
        pomodoroStore.state.type === 'short-break' && 'bg-gradient-to-br from-green-500/20 to-emerald-500/20',
        pomodoroStore.state.type === 'long-break' && 'bg-gradient-to-br from-sky-500/20 to-cyan-500/20',
      ]"
    />
    
    <div class="relative">
      <!-- Timer Type Tabs -->
      <div class="flex justify-center gap-2 mb-6">
        <button
          v-for="type in timerTypes"
          :key="type.value"
          @click="setType(type.value)"
          :disabled="!pomodoroStore.isIdle"
          :class="[
            'px-4 py-2 rounded-xl text-sm font-medium transition-all',
            pomodoroStore.state.type === type.value
              ? 'bg-white/80 dark:bg-slate-700/80 shadow-lg text-slate-800 dark:text-slate-100'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200',
            !pomodoroStore.isIdle && 'cursor-not-allowed'
          ]"
        >
          {{ t(`pomodoro.${type.label}`) }}
        </button>
      </div>
      
      <!-- Timer Display -->
      <div class="relative flex-center mb-8">
        <!-- Progress Ring -->
        <svg class="w-48 h-48 lg:w-56 lg:h-56 transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            :r="radius"
            fill="none"
            stroke="currentColor"
            :stroke-width="strokeWidth"
            class="text-slate-200 dark:text-slate-700"
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
        
        <!-- Time Display -->
        <div class="absolute inset-0 flex-center flex-col">
          <span class="text-5xl lg:text-6xl font-bold text-slate-800 dark:text-slate-100 font-mono">
            {{ pomodoroStore.formattedTime }}
          </span>
          <span class="text-sm text-slate-500 dark:text-slate-400 mt-2">
            {{ t(`pomodoro.${pomodoroStore.state.type.replace('-', '')}`) }}
          </span>
        </div>
      </div>
      
      <!-- Controls -->
      <TimerControls />
      
      <!-- Today's Stats -->
      <div class="mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-700/50 flex-center gap-6 text-sm">
        <div class="flex items-center gap-2">
          <span class="text-2xl">🍅</span>
          <span class="font-medium text-slate-700 dark:text-slate-200">{{ pomodoroStore.todayPomodoroCount }}</span>
          <span class="text-slate-500 dark:text-slate-400">{{ t('pomodoro.todayPomodoros') }}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="i-carbon-timer text-primary-500" />
          <span class="font-medium text-slate-700 dark:text-slate-200">{{ pomodoroStore.todayFocusMinutes }}</span>
          <span class="text-slate-500 dark:text-slate-400">{{ t('common.minutes') }}</span>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import Card from '~/components/ui/Card.vue'
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

const strokeDashoffset = computed(() => {
  return circumference - (pomodoroStore.progress / 100) * circumference
})

const ringColor = computed(() => {
  switch (pomodoroStore.state.type) {
    case 'focus': return '#6366f1'
    case 'short-break': return '#22c55e'
    case 'long-break': return '#0ea5e9'
  }
})

const setType = (type: 'focus' | 'short-break' | 'long-break') => {
  if (pomodoroStore.isIdle) {
    pomodoroStore.setType(type)
  }
}
</script>
