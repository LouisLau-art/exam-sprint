<template>
  <UModal v-model:open="isOpen" :title="isEditing ? t('tasks.editTask') : t('tasks.addTask')">
    <UButton class="hidden" />
    
    <template #content>
      <div class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ t('tasks.taskTitle') }}
          </label>
          <UInput v-model="formData.title" :placeholder="t('tasks.taskTitle')" />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ t('tasks.notes') }}
          </label>
          <UTextarea
            v-model="formData.notes"
            :placeholder="t('tasks.notes')"
            :rows="3"
          />
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ t('tasks.dueDate') }}
            </label>
            <DatePicker v-model="formData.dueDate" :placeholder="t('tasks.dueDate')" />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {{ t('tasks.priority') }}
            </label>
            <USelectMenu v-model="formData.priority" value-key="value" :items="priorityOptions" :search-input="false" class="w-full" />
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ t('tasks.estimatedPomodoros') }}
          </label>
          <UInput v-model="formData.estimatedPomodoros" type="number" placeholder="3" />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ t('tasks.tags') }}
          </label>
          <UInput
            v-model="tagsInput"
            placeholder="数学, 第三章"
            @keydown.enter.prevent="addTag"
          />
          <div v-if="formData.tags.length" class="flex flex-wrap gap-2 mt-2">
            <UBadge 
              v-for="tag in formData.tags" 
              :key="tag"
              class="cursor-pointer hover:opacity-70"
              @click="removeTag(tag)"
            >
              {{ tag }}
              <UIcon name="i-lucide-x" class="ml-1 text-xs" />
            </UBadge>
          </div>
        </div>
        
        <div v-if="goalsStore.allGoals.length">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ t('tasks.linkedGoal') }}
          </label>
          <USelectMenu v-model="formData.goalId" value-key="value" :items="goalOptions" :search-input="false" class="w-full" />
        </div>
        
        <div class="flex gap-2 justify-end pt-4">
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
import type { Task } from '~/stores/tasks'

interface Props {
  modelValue: boolean
  editTask?: Task | null
}

const props = withDefaults(defineProps<Props>(), {
  editTask: null,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  saved: []
}>()

const { t } = useI18n()
const tasksStore = useTasksStore()
const goalsStore = useGoalsStore()

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

const isEditing = computed(() => !!props.editTask)

const priorityOptions = computed(() => [
  { label: `${t('tasks.priorityP0')} (P0)`, value: 'P0' },
  { label: `${t('tasks.priorityP1')} (P1)`, value: 'P1' },
  { label: `${t('tasks.priorityP2')} (P2)`, value: 'P2' },
])

const goalOptions = computed(() => [
  { label: `-- ${t('common.all')} --`, value: null },
  ...goalsStore.allGoals.map(g => ({ label: g.title, value: g.id }))
])

const defaultFormData = () => ({
  title: '',
  notes: '',
  dueDate: '',
  priority: 'P1' as 'P0' | 'P1' | 'P2',
  estimatedPomodoros: 1,
  tags: [] as string[],
  goalId: null as string | null,
})

const formData = reactive(defaultFormData())
const tagsInput = ref('')

watch(() => props.modelValue, (val) => {
  if (val) {
    if (props.editTask) {
      Object.assign(formData, {
        title: props.editTask.title,
        notes: props.editTask.notes,
        dueDate: props.editTask.dueDate || '',
        priority: props.editTask.priority,
        estimatedPomodoros: props.editTask.estimatedPomodoros,
        tags: [...props.editTask.tags],
        goalId: props.editTask.goalId,
      })
    } else {
      Object.assign(formData, defaultFormData())
    }
    tagsInput.value = ''
  }
})

const addTag = () => {
  const tag = tagsInput.value.trim()
  if (tag && !formData.tags.includes(tag)) {
    formData.tags.push(tag)
    tagsInput.value = ''
  }
}

const removeTag = (tag: string) => {
  const index = formData.tags.indexOf(tag)
  if (index !== -1) {
    formData.tags.splice(index, 1)
  }
}

const save = () => {
  if (!formData.title.trim()) return
  
  const taskData = {
    title: formData.title.trim(),
    notes: formData.notes,
    dueDate: formData.dueDate || null,
    priority: formData.priority,
    estimatedPomodoros: Number(formData.estimatedPomodoros) || 1,
    tags: formData.tags,
    goalId: formData.goalId,
    completed: false,
  }
  
  if (isEditing.value && props.editTask) {
    tasksStore.updateTask(props.editTask.id, taskData)
  } else {
    tasksStore.addTask(taskData)
  }
  
  emit('saved')
  close()
}

const close = () => {
  isOpen.value = false
}
</script>
