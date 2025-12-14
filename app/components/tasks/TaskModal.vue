<template>
  <Modal v-model="isOpen" :title="isEditing ? t('tasks.editTask') : t('tasks.addTask')">
    <div class="space-y-4">
      <Input
        v-model="formData.title"
        :label="t('tasks.taskTitle')"
        :placeholder="t('tasks.taskTitle')"
        icon="i-carbon-task"
      />
      
      <div class="space-y-1">
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {{ t('tasks.notes') }}
        </label>
        <textarea
          v-model="formData.notes"
          :placeholder="t('tasks.notes')"
          rows="3"
          class="input resize-none"
        />
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <Input
          v-model="formData.dueDate"
          :label="t('tasks.dueDate')"
          type="date"
        />
        
        <div class="space-y-1">
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">
            {{ t('tasks.priority') }}
          </label>
          <select v-model="formData.priority" class="input">
            <option value="P0">{{ t('tasks.priorityP0') }} (P0)</option>
            <option value="P1">{{ t('tasks.priorityP1') }} (P1)</option>
            <option value="P2">{{ t('tasks.priorityP2') }} (P2)</option>
          </select>
        </div>
      </div>
      
      <Input
        v-model.number="formData.estimatedPomodoros"
        :label="t('tasks.estimatedPomodoros')"
        type="number"
        :placeholder="'3'"
      />
      
      <div class="space-y-1">
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {{ t('tasks.tags') }}
        </label>
        <input
          v-model="tagsInput"
          :placeholder="'数学, 第三章'"
          class="input"
          @keydown.enter.prevent="addTag"
        />
        <div v-if="formData.tags.length" class="flex flex-wrap gap-2 mt-2">
          <Badge 
            v-for="tag in formData.tags" 
            :key="tag"
            class="cursor-pointer hover:opacity-70"
            @click="removeTag(tag)"
          >
            {{ tag }}
            <span class="i-carbon-close ml-1 text-xs" />
          </Badge>
        </div>
      </div>
      
      <div v-if="goalsStore.allGoals.length" class="space-y-1">
        <label class="block text-sm font-medium text-slate-700 dark:text-slate-300">
          {{ t('tasks.linkedGoal') }}
        </label>
        <select v-model="formData.goalId" class="input">
          <option :value="null">-- {{ t('common.all') }} --</option>
          <option v-for="goal in goalsStore.allGoals" :key="goal.id" :value="goal.id">
            {{ goal.title }}
          </option>
        </select>
      </div>
    </div>
    
    <template #footer>
      <Button variant="ghost" @click="close">
        {{ t('common.cancel') }}
      </Button>
      <Button @click="save" :disabled="!formData.title.trim()">
        {{ t('common.save') }}
      </Button>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '~/components/ui/Modal.vue'
import Input from '~/components/ui/Input.vue'
import Button from '~/components/ui/Button.vue'
import Badge from '~/components/ui/Badge.vue'
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
    estimatedPomodoros: formData.estimatedPomodoros || 1,
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
