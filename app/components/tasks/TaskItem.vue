<template>
  <div
    :class="[
      'group glass-subtle rounded-xl p-4 transition-all duration-200',
      'hover:bg-white/60 dark:hover:bg-slate-700/60',
      task.completed && 'opacity-60'
    ]"
  >
    <div class="flex items-start gap-3">
      <!-- Checkbox -->
      <button
        @click="toggleComplete"
        :class="[
          'mt-0.5 w-5 h-5 rounded-full border-2 flex-center transition-all',
          task.completed 
            ? 'bg-primary-500 border-primary-500 text-white' 
            : 'border-slate-300 dark:border-slate-600 hover:border-primary-500'
        ]"
      >
        <span v-if="task.completed" class="i-carbon-checkmark text-xs" />
      </button>
      
      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-1">
          <span
            :class="[
              'font-medium',
              task.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-100'
            ]"
          >
            {{ task.title }}
          </span>
          <Badge :variant="task.priority">
            {{ t(`tasks.priority${task.priority}`) }}
          </Badge>
        </div>
        
        <!-- Meta info -->
        <div class="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span v-if="task.dueDate" class="flex items-center gap-1">
            <span class="i-carbon-calendar" />
            {{ formatDate(task.dueDate) }}
          </span>
          <span v-if="task.estimatedPomodoros" class="flex items-center gap-1">
            🍅 {{ task.completedPomodoros }}/{{ task.estimatedPomodoros }}
          </span>
          <span v-if="task.tags.length" class="flex items-center gap-1">
            <span class="i-carbon-tag" />
            {{ task.tags[0] }}
            <span v-if="task.tags.length > 1">+{{ task.tags.length - 1 }}</span>
          </span>
        </div>
      </div>
      
      <!-- Actions -->
      <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          @click="$emit('edit', task)"
          class="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-500"
        >
          <span class="i-carbon-edit" />
        </button>
        <button
          @click="$emit('delete', task.id)"
          class="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-slate-500 hover:text-red-500"
        >
          <span class="i-carbon-trash-can" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Badge from '~/components/ui/Badge.vue'
import type { Task } from '~/stores/tasks'

interface Props {
  task: Task
}

const props = defineProps<Props>()

const emit = defineEmits<{
  edit: [task: Task]
  delete: [id: string]
}>()

const { t, locale } = useI18n()
const tasksStore = useTasksStore()

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  
  if (dateStr === today.toISOString().split('T')[0]) {
    return t('common.today')
  }
  
  return date.toLocaleDateString(locale.value, { month: 'short', day: 'numeric' })
}

const toggleComplete = () => {
  tasksStore.toggleComplete(props.task.id)
}
</script>
