<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100">
        {{ t('stats.dailyReview') }}
      </h3>
    </template>
    
    <div class="grid grid-cols-3 gap-4">
      <!-- Completed Tasks -->
      <div class="text-center p-4 glass-subtle rounded-xl">
        <div class="text-3xl font-bold text-green-500 mb-1">
          {{ tasksStore.todayCompletedCount }}
        </div>
        <div class="text-sm text-slate-500 dark:text-slate-400">
          {{ t('stats.completedTasks') }}
        </div>
      </div>
      
      <!-- Focus Time -->
      <div class="text-center p-4 glass-subtle rounded-xl">
        <div class="text-3xl font-bold text-primary-500 mb-1">
          {{ pomodoroStore.todayFocusMinutes }}
        </div>
        <div class="text-sm text-slate-500 dark:text-slate-400">
          {{ t('stats.focusMinutes') }}
        </div>
      </div>
      
      <!-- Pomodoros -->
      <div class="text-center p-4 glass-subtle rounded-xl">
        <div class="text-3xl font-bold text-amber-500 mb-1">
          {{ pomodoroStore.todayPomodoroCount }}
        </div>
        <div class="text-sm text-slate-500 dark:text-slate-400">
          🍅 {{ t('stats.pomodoros') }}
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">


const { t } = useI18n()
const tasksStore = useTasksStore()
const pomodoroStore = usePomodoroStore()
</script>
