<template>
  <Card class="relative overflow-hidden">
    <!-- Background gradient -->
    <div class="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-purple-500/20 dark:from-primary-500/10 dark:to-purple-500/10" />
    
    <div class="relative">
      <!-- No exam set -->
      <div v-if="!countdownStore.state.examDate" class="text-center py-8">
        <div class="i-carbon-calendar text-4xl text-slate-400 mb-4" />
        <p class="text-slate-500 dark:text-slate-400 mb-4">{{ t('countdown.setExam') }}</p>
        <Button @click="showModal = true" size="sm">
          <span class="i-carbon-add mr-1" />
          {{ t('countdown.setExam') }}
        </Button>
      </div>
      
      <!-- Countdown display -->
      <div v-else>
        <div class="text-center mb-6">
          <h3 class="text-lg font-medium text-slate-600 dark:text-slate-300 mb-1">
            {{ t('countdown.title') }}
          </h3>
          <p class="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {{ countdownStore.state.examName }}
          </p>
        </div>
        
        <!-- Countdown numbers -->
        <div v-if="countdown" class="grid grid-cols-4 gap-3 mb-6">
          <div class="text-center">
            <div class="text-4xl lg:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-1">
              {{ countdown.days }}
            </div>
            <div class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {{ t('countdown.daysLeft') }}
            </div>
          </div>
          <div class="text-center">
            <div class="text-4xl lg:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-1">
              {{ countdown.hours.toString().padStart(2, '0') }}
            </div>
            <div class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {{ t('countdown.hoursLeft') }}
            </div>
          </div>
          <div class="text-center">
            <div class="text-4xl lg:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-1">
              {{ countdown.minutes.toString().padStart(2, '0') }}
            </div>
            <div class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {{ t('countdown.minutesLeft') }}
            </div>
          </div>
          <div class="text-center">
            <div class="text-4xl lg:text-5xl font-bold text-primary-500 animate-pulse-slow mb-1">
              {{ countdown.seconds.toString().padStart(2, '0') }}
            </div>
            <div class="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              {{ t('countdown.secondsLeft') }}
            </div>
          </div>
        </div>
        
        <!-- Edit button -->
        <div class="flex justify-center">
          <button 
            @click="showModal = true"
            class="text-sm text-slate-500 hover:text-primary-500 transition-colors"
          >
            <span class="i-carbon-edit mr-1" />
            {{ t('common.edit') }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Modal -->
    <Modal v-model="showModal" :title="t('countdown.setExam')">
      <div class="space-y-4">
        <Input
          v-model="formData.examName"
          :label="t('countdown.examName')"
          :placeholder="t('countdown.examName')"
        />
        <Input
          v-model="formData.examDate"
          :label="t('countdown.examDate')"
          type="date"
        />
      </div>
      <template #footer>
        <Button variant="ghost" @click="showModal = false">
          {{ t('common.cancel') }}
        </Button>
        <Button @click="saveExam">
          {{ t('common.save') }}
        </Button>
      </template>
    </Modal>
  </Card>
</template>

<script setup lang="ts">
import Card from '~/components/ui/Card.vue'
import Button from '~/components/ui/Button.vue'
import Input from '~/components/ui/Input.vue'
import Modal from '~/components/ui/Modal.vue'

const { t } = useI18n()
const countdownStore = useCountdownStore()

const showModal = ref(false)
const formData = reactive({
  examName: '',
  examDate: '',
})

const countdown = computed(() => countdownStore.examCountdown)

// Real-time update
const updateInterval = ref<NodeJS.Timeout>()
onMounted(() => {
  updateInterval.value = setInterval(() => {
    // Force reactivity update
  }, 1000)
})
onUnmounted(() => {
  if (updateInterval.value) clearInterval(updateInterval.value)
})

watch(showModal, (val) => {
  if (val) {
    formData.examName = countdownStore.state.examName
    formData.examDate = countdownStore.state.examDate || ''
  }
})

const saveExam = () => {
  if (formData.examName && formData.examDate) {
    countdownStore.setExam(formData.examName, formData.examDate)
    showModal.value = false
  }
}
</script>
