<template>
  <div class="space-y-3">
    <div class="flex-between">
      <h4 class="font-medium text-slate-700 dark:text-slate-300">
        {{ t('countdown.milestone') }}
      </h4>
      <button
        @click="showModal = true"
        class="text-sm text-primary-500 hover:text-primary-600 flex items-center gap-1"
      >
        <span class="i-carbon-add" />
        {{ t('countdown.addMilestone') }}
      </button>
    </div>
    
    <!-- Milestones list -->
    <div v-if="countdownStore.upcomingMilestones.length" class="space-y-2">
      <div
        v-for="milestone in countdownStore.upcomingMilestones"
        :key="milestone.id"
        class="glass-subtle rounded-xl p-3 flex-between group"
      >
        <div class="flex items-center gap-3">
          <div 
            class="w-3 h-3 rounded-full"
            :style="{ backgroundColor: milestone.color }"
          />
          <div>
            <p class="font-medium text-slate-700 dark:text-slate-200">{{ milestone.name }}</p>
            <p class="text-xs text-slate-500">{{ formatDate(milestone.date) }}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-sm font-medium text-primary-500">
            {{ getMilestoneDays(milestone.id) }} {{ t('common.days') }}
          </span>
          <button
            @click="deleteMilestone(milestone.id)"
            class="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all"
          >
            <span class="i-carbon-trash-can" />
          </button>
        </div>
      </div>
    </div>
    
    <p v-else class="text-sm text-slate-500 dark:text-slate-400 text-center py-4">
      {{ t('countdown.addMilestone') }}
    </p>
    
    <!-- Add Modal -->
    <Modal v-model="showModal" :title="t('countdown.addMilestone')" size="sm">
      <div class="space-y-4">
        <Input
          v-model="formData.name"
          :label="t('countdown.milestone')"
          placeholder="e.g. 一轮复习结束"
        />
        <Input
          v-model="formData.date"
          :label="t('countdown.examDate')"
          type="date"
        />
      </div>
      <template #footer>
        <Button variant="ghost" @click="showModal = false">
          {{ t('common.cancel') }}
        </Button>
        <Button @click="addMilestone">
          {{ t('common.add') }}
        </Button>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import Button from '~/components/ui/Button.vue'
import Input from '~/components/ui/Input.vue'
import Modal from '~/components/ui/Modal.vue'

const { t, locale } = useI18n()
const countdownStore = useCountdownStore()

const showModal = ref(false)
const formData = reactive({
  name: '',
  date: '',
})

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString(locale.value, { month: 'short', day: 'numeric' })
}

const getMilestoneDays = (id: string) => {
  const countdown = countdownStore.getMilestoneCountdown(id).value
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
