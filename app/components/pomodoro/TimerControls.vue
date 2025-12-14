<template>
  <div class="flex items-center justify-center gap-4">
    <!-- Start / Pause / Resume -->
    <button
      v-if="isIdle"
      @click="pomodoroStore.start()"
      class="w-16 h-16 rounded-full bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
    >
      <UIcon name="i-lucide-play" class="text-2xl" />
    </button>
    
    <button
      v-else-if="isRunning"
      @click="pomodoroStore.pause()"
      class="w-16 h-16 rounded-full bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
    >
      <UIcon name="i-lucide-pause" class="text-2xl" />
    </button>
    
    <button
      v-else-if="isPaused"
      @click="pomodoroStore.resume()"
      class="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
    >
      <UIcon name="i-lucide-play" class="text-2xl" />
    </button>
    
    <!-- Stop -->
    <button
      v-if="!isIdle"
      @click="showStopConfirm = true"
      class="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-red-900/30 text-gray-500 hover:text-red-500 flex items-center justify-center transition-all"
    >
      <UIcon name="i-lucide-square" class="text-xl" />
    </button>
    
    <!-- Skip (during break) -->
    <button
      v-if="currentType !== 'focus' && isRunning"
      @click="pomodoroStore.skip()"
      class="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 flex items-center justify-center transition-all"
      :title="t('pomodoro.skip')"
    >
      <UIcon name="i-lucide-skip-forward" class="text-xl" />
    </button>
    
    <!-- Confirm Dialog -->
    <UModal v-model:open="showStopConfirm" :title="t('common.confirm')">
      <UButton class="hidden" />
      <template #content>
        <div class="p-6">
          <p class="text-gray-600 dark:text-gray-300 mb-6">
            {{ t('pomodoro.stopConfirm') || '确定要停止当前计时吗？' }}
          </p>
          <div class="flex gap-2 justify-end">
            <UButton color="neutral" variant="outline" @click="showStopConfirm = false">
              {{ t('common.cancel') }}
            </UButton>
            <UButton color="error" @click="confirmStop">
              {{ t('common.confirm') }}
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const pomodoroStore = usePomodoroStore()

const showStopConfirm = ref(false)

const isIdle = computed(() => pomodoroStore.isIdle)
const isRunning = computed(() => pomodoroStore.isRunning)
const isPaused = computed(() => pomodoroStore.isPaused)
const currentType = computed(() => pomodoroStore.type || 'focus')

const confirmStop = () => {
  pomodoroStore.stop()
  showStopConfirm.value = false
}
</script>
