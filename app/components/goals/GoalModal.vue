<template>
  <UModal v-model:open="isOpen" :title="isEditing ? t('goals.editGoal') : t('goals.addGoal')">
    <UButton class="hidden" />
    
    <template #content>
      <div class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ t('goals.goalTitle') }}
          </label>
          <UInput v-model="formData.title" :placeholder="t('goals.goalTitle')" />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ t('goals.description') }}
          </label>
          <UTextarea
            v-model="formData.description"
            :placeholder="t('goals.description')"
            :rows="2"
          />
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ t('goals.goalType') }}
            </label>
            <USelectMenu v-model="formData.type" value-key="value" :items="typeOptions" :search-input="false" class="w-full" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ t('goals.deadline') }}
            </label>
            <DatePicker v-model="formData.deadline" :placeholder="t('goals.deadline')" />
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ t('goals.target') }}
            </label>
            <UInput v-model="formData.target" type="number" placeholder="10" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ t('goals.unit') }}
            </label>
            <UInput v-model="formData.unit" placeholder="任务数 / 番茄 / 小时" />
          </div>
        </div>
        
        <div v-if="isEditing">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ t('goals.current') }}
          </label>
          <UInput v-model="formData.current" type="number" />
        </div>
        
        <div class="flex gap-2 justify-end pt-4">
          <UButton v-if="isEditing" color="error" variant="outline" @click="deleteGoal" class="mr-auto">
            {{ t('common.delete') }}
          </UButton>
          <UButton color="neutral" variant="outline" @click="close">
            {{ t('common.cancel') }}
          </UButton>
          <UButton @click="save" :disabled="!formData.title.trim()">
            {{ t('common.save') }}
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { Goal } from '~/stores/goals'

interface Props {
  modelValue: boolean
  editGoal?: Goal | null
}

const props = withDefaults(defineProps<Props>(), {
  editGoal: null,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  saved: []
}>()

const { t } = useI18n()
const goalsStore = useGoalsStore()

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const isEditing = computed(() => !!props.editGoal)

const typeOptions = computed(() => [
  { label: t('goals.taskDriven'), value: 'task-driven' },
  { label: t('goals.timeDriven'), value: 'time-driven' },
])

const defaultFormData = () => ({
  title: '',
  description: '',
  deadline: '',
  type: 'task-driven' as 'task-driven' | 'time-driven',
  target: 10,
  current: 0,
  unit: '任务',
})

const formData = reactive(defaultFormData())

watch(() => props.modelValue, (val) => {
  if (val) {
    if (props.editGoal) {
      Object.assign(formData, {
        title: props.editGoal.title,
        description: props.editGoal.description,
        deadline: props.editGoal.deadline || '',
        type: props.editGoal.type,
        target: props.editGoal.target,
        current: props.editGoal.current,
        unit: props.editGoal.unit,
      })
    } else {
      Object.assign(formData, defaultFormData())
    }
  }
})

const save = () => {
  if (!formData.title.trim()) return
  
  const goalData = {
    title: formData.title.trim(),
    description: formData.description,
    deadline: formData.deadline || null,
    type: formData.type,
    target: Number(formData.target) || 1,
    unit: formData.unit || '任务',
  }
  
  if (isEditing.value && props.editGoal) {
    goalsStore.updateGoal(props.editGoal.id, {
      ...goalData,
      current: Number(formData.current),
    })
  } else {
    goalsStore.addGoal(goalData)
  }
  
  emit('saved')
  close()
}

const deleteGoal = () => {
  if (props.editGoal) {
    goalsStore.deleteGoal(props.editGoal.id)
    close()
  }
}

const close = () => {
  isOpen.value = false
}
</script>
