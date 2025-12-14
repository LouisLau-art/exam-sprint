<template>
  <UCard class="relative overflow-hidden">
    <!-- Background gradient -->
    <div class="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-purple-500/20 dark:from-primary-500/10 dark:to-purple-500/10" />
    
    <div class="relative">
      <!-- No exam set -->
      <div v-if="!examDate" class="text-center py-8">
        <UIcon name="i-lucide-calendar" class="text-4xl text-gray-400 mb-4" />
        <p class="text-gray-500 dark:text-gray-400 mb-4">{{ t('countdown.setExam') }}</p>
        <UButton @click="showModal = true" size="sm">
          <UIcon name="i-lucide-plus" class="mr-1" />
          {{ t('countdown.setExam') }}
        </UButton>
      </div>
      
      <!-- Countdown display -->
      <div v-else>
        <div class="text-center mb-6">
          <h3 class="text-lg font-medium text-gray-600 dark:text-gray-300 mb-1">
            {{ t('countdown.title') }}
          </h3>
          <p class="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {{ examName }}
          </p>
        </div>
        
        <!-- Countdown numbers -->
        <div v-if="countdown" class="grid grid-cols-4 gap-3 mb-6">
          <div class="text-center">
            <div class="text-4xl lg:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-1">
              {{ countdown.days }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {{ t('countdown.daysLeft') }}
            </div>
          </div>
          <div class="text-center">
            <div class="text-4xl lg:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-1">
              {{ countdown.hours.toString().padStart(2, '0') }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {{ t('countdown.hoursLeft') }}
            </div>
          </div>
          <div class="text-center">
            <div class="text-4xl lg:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-1">
              {{ countdown.minutes.toString().padStart(2, '0') }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {{ t('countdown.minutesLeft') }}
            </div>
          </div>
          <div class="text-center">
            <div class="text-4xl lg:text-5xl font-bold text-primary-500 animate-pulse mb-1">
              {{ countdown.seconds.toString().padStart(2, '0') }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {{ t('countdown.secondsLeft') }}
            </div>
          </div>
        </div>
        
        <!-- Edit button -->
        <div class="flex justify-center">
          <UButton variant="ghost" size="sm" @click="showModal = true">
            <UIcon name="i-lucide-edit" class="mr-1" />
            {{ t('common.edit') }}
          </UButton>
        </div>
      </div>
    </div>
    
    <!-- Modal - uses #content slot -->
    <UModal v-model:open="showModal" :title="t('countdown.setExam')">
      <UButton label="Hidden trigger" class="hidden" />
      
      <template #content>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ t('countdown.examName') }}
            </label>
            <UInput v-model="formData.examName" :placeholder="t('countdown.examName')" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ t('countdown.examDate') }}
            </label>
            <UiCalendarPicker v-model="formData.examDate" />
          </div>
          
          <div class="flex gap-2 justify-end pt-4">
            <UButton color="neutral" variant="outline" @click="showModal = false">
              {{ t('common.cancel') }}
            </UButton>
            <UButton @click="saveExam">
              {{ t('common.save') }}
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </UCard>
</template>

<script setup lang="ts">
const { t } = useI18n()
const countdownStore = useCountdownStore()

const showModal = ref(false)
const formData = reactive({
  examName: '',
  examDate: '',
})

// Use storeToRefs for reactivity or direct access
const examDate = computed(() => countdownStore.examDate)
const examName = computed(() => countdownStore.examName)

// Real-time update for seconds - tick triggers recomputation
const tick = ref(0)
let updateInterval: ReturnType<typeof setInterval> | undefined

// Countdown that depends on tick to force recalculation
const countdown = computed(() => {
  // Access tick to create dependency
  const _ = tick.value
  
  if (!examDate.value) return null
  
  const now = new Date()
  const exam = new Date(examDate.value)
  const diff = exam.getTime() - now.getTime()
  
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 }
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)
  
  return { days, hours, minutes, seconds, total: diff }
})

onMounted(() => {
  updateInterval = setInterval(() => {
    tick.value++
  }, 1000)
})

onUnmounted(() => {
  if (updateInterval) clearInterval(updateInterval)
})

watch(showModal, (val) => {
  if (val) {
    formData.examName = countdownStore.examName || ''
    formData.examDate = countdownStore.examDate || ''
  }
})

const saveExam = () => {
  if (formData.examName && formData.examDate) {
    countdownStore.setExam(formData.examName, formData.examDate)
    showModal.value = false
  }
}
</script>
