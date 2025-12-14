<template>
  <div class="space-y-3">
    <!-- Empty state -->
    <div v-if="!tasks.length" class="text-center py-12">
      <div class="i-carbon-task text-5xl text-slate-300 dark:text-slate-600 mb-4" />
      <p class="text-slate-500 dark:text-slate-400 mb-4">{{ t('tasks.noTasks') }}</p>
      <Button @click="$emit('add')" size="sm">
        <span class="i-carbon-add mr-1" />
        {{ t('tasks.addFirstTask') }}
      </Button>
    </div>
    
    <!-- Task list -->
    <TransitionGroup
      v-else
      tag="div"
      name="list"
      class="space-y-2"
    >
      <TaskItem
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
      />
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import TaskItem from './TaskItem.vue'
import Button from '~/components/ui/Button.vue'
import type { Task } from '~/stores/tasks'

interface Props {
  tasks: Task[]
}

defineProps<Props>()

defineEmits<{
  add: []
  edit: [task: Task]
  delete: [id: string]
}>()

const { t } = useI18n()
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
