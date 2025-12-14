<template>
  <div class="flex-center gap-4">
    <!-- Start / Pause / Resume -->
    <button
      v-if="pomodoroStore.isIdle"
      @click="pomodoroStore.start()"
      class="w-16 h-16 rounded-full bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 flex-center transition-all"
    >
      <span class="i-carbon-play-filled text-2xl" />
    </button>
    
    <button
      v-else-if="pomodoroStore.isRunning"
      @click="pomodoroStore.pause()"
      class="w-16 h-16 rounded-full bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/30 flex-center transition-all"
    >
      <span class="i-carbon-pause-filled text-2xl" />
    </button>
    
    <button
      v-else-if="pomodoroStore.isPaused"
      @click="pomodoroStore.resume()"
      class="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30 flex-center transition-all"
    >
      <span class="i-carbon-play-filled text-2xl" />
    </button>
    
    <!-- Stop -->
    <button
      v-if="!pomodoroStore.isIdle"
      @click="confirmStop"
      class="w-12 h-12 rounded-full glass hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-500 hover:text-red-500 flex-center transition-all"
    >
      <span class="i-carbon-stop-filled text-xl" />
    </button>
    
    <!-- Skip (during break) -->
    <button
      v-if="pomodoroStore.state.type !== 'focus' && pomodoroStore.isRunning"
      @click="pomodoroStore.skip()"
      class="w-12 h-12 rounded-full glass text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 flex-center transition-all"
      :title="t('pomodoro.skip')"
    >
      <span class="i-carbon-next-filled text-xl" />
    </button>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const pomodoroStore = usePomodoroStore()

const confirmStop = () => {
  if (confirm(t('common.confirm') + '?')) {
    pomodoroStore.stop()
  }
}
</script>
