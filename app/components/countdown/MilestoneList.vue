<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between">
      <h4 class="font-medium text-gray-700 dark:text-gray-300">
        {{ t('countdown.milestone') }}
      </h4>
      <button
        @click="showModal = true"
        class="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1"
      >
        <UIcon name="i-lucide-plus" />
        {{ t('countdown.addMilestone') }}
      </button>
    </div>
    
    <!-- Milestones list -->
    <div v-if="upcomingMilestones.length" class="space-y-2">
      <div
        v-for="milestone in upcomingMilestones"
        :key="milestone.id"
        class="bg-gray-100 dark:bg-gray-800 rounded-xl p-3 flex items-center justify-between group"
      >
        <div class="flex items-center gap-3">
          <div 
            class="w-3 h-3 rounded-full"
            :style="{ backgroundColor: milestone.color }"
          />
          <div>
            <p class="font-medium text-gray-700 dark:text-gray-200">{{ milestone.name }}</p>
            <p class="text-xs text-gray-500">{{ formatDate(milestone.date) }}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-sm font-medium text-primary-500">
            {{ getMilestoneDays(milestone.id) }} {{ t('common.days') }}
          </span>
          <button
            @click="deleteMilestone(milestone.id)"
            class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
          >
            <UIcon name="i-lucide-trash-2" />
          </button>
        </div>
      </div>
    </div>
    
    <p v-else class="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
      {{ t('countdown.addMilestone') }}
    </p>
    
    <!-- Add Modal -->
    <UModal v-model:open="showModal" :title="t('countdown.addMilestone')">
      <UButton class="hidden" />
      
      <template #content>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ t('countdown.milestone') }}
            </label>
            <UInput v-model="formData.name" placeholder="e.g. 一轮复习结束" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ t('countdown.examDate') }}
            </label>
            <UInput v-model="formData.date" type="date" />
          </div>
          
          <div class="flex gap-2 justify-end pt-4">
            <UButton color="neutral" variant="outline" @click="showModal = false">
              {{ t('common.cancel') }}
            </UButton>
            <UButton @click="addMilestone">
              {{ t('common.add') }}
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()
const countdownStore = useCountdownStore()

const showModal = ref(false)
const formData = reactive({
  name: '',
  date: '',
})

const upcomingMilestones = computed(() => countdownStore.upcomingMilestones)

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString(locale.value, { month: 'short', day: 'numeric' })
}

const getMilestoneDays = (id: string) => {
  const countdown = countdownStore.getMilestoneCountdown(id)
  return countdown?.days ?? 0
}

const addMilestone = () => {
  if (formData.name && formData.date) {
    countdownStore.addMilestone(formData.name, formData.date)
    formData.name = ''
    formData.date = ''
    showModal.value = false
  }
}

const deleteMilestone = (id: string) => {
  countdownStore.deleteMilestone(id)
}
</script>
