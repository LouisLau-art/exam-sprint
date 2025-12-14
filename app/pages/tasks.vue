<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex-between">
      <h1 class="text-2xl font-bold text-slate-800 dark:text-slate-100">
        {{ t('tasks.title') }}
      </h1>
      <UButton @click="showTaskModal = true">
        <span class="i-carbon-add mr-1" />
        {{ t('tasks.addTask') }}
      </UButton>
    </div>
    
    <!-- Filters -->
    <UCard class="!p-4">
      <div class="flex flex-wrap items-center gap-4">
        <div class="flex rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700">
          <button
            v-for="filter in filters"
            :key="filter.value"
            @click="currentFilter = filter.value"
            :class="[
              'px-4 py-2 text-sm font-medium transition-all',
              currentFilter === filter.value
                ? 'bg-primary-500 text-white'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600'
            ]"
          >
            {{ t(`common.${filter.value}`) }}
          </button>
        </div>
        
        <label class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200 cursor-pointer">
          <input
            v-model="hideCompleted"
            type="checkbox"
            class="rounded border-slate-400 text-primary-500 focus:ring-primary-500"
          />
          {{ t('common.incomplete') }}
        </label>
      </div>
    </UCard>
    
    <!-- Task List -->
    <UCard>
      <TaskList 
        :tasks="filteredTasks"
        @add="showTaskModal = true"
        @edit="editTask"
        @delete="deleteTask"
      />
    </UCard>
    
    <!-- Completed Tasks (collapsible) -->
    <UCard v-if="completedTasks.length && !hideCompleted">
      <button
        @click="showCompleted = !showCompleted"
        class="w-full flex-between text-slate-600 dark:text-slate-300"
      >
        <span class="font-medium">
          {{ t('common.completed') }} ({{ completedTasks.length }})
        </span>
        <span 
          :class="[
            'i-carbon-chevron-down transition-transform',
            showCompleted && 'rotate-180'
          ]"
        />
      </button>
      
      <div v-if="showCompleted" class="mt-4">
        <TaskList 
          :tasks="completedTasks"
          @edit="editTask"
          @delete="deleteTask"
        />
      </div>
    </UCard>
    
    <!-- Task Modal -->
    <TaskModal 
      v-model="showTaskModal"
      :edit-task="currentEditTask"
      @saved="currentEditTask = null"
    />
  </div>
</template>

<script setup lang="ts">


import TaskList from '~/components/tasks/TaskList.vue'
import TaskModal from '~/components/tasks/TaskModal.vue'
import type { Task } from '~/stores/tasks'

const { t } = useI18n()
const tasksStore = useTasksStore()

const filters = [
  { value: 'today' },
  { value: 'week' },
  { value: 'all' },
]

const currentFilter = ref<'today' | 'week' | 'all'>('today')
const hideCompleted = ref(false)
const showCompleted = ref(false)

const filteredTasks = computed(() => {
  let tasks: Task[]
  
  switch (currentFilter.value) {
    case 'today':
      tasks = tasksStore.todayTasks
      break
    case 'week':
      tasks = tasksStore.thisWeekTasks
      break
    default:
      tasks = tasksStore.incompleteTasks
  }
  
  return hideCompleted.value ? tasks.filter(t => !t.completed) : tasks
})

const completedTasks = computed(() => tasksStore.completedTasks)

// Task management
const showTaskModal = ref(false)
const currentEditTask = ref<Task | null>(null)

const editTask = (task: Task) => {
  currentEditTask.value = task
  showTaskModal.value = true
}

const deleteTask = (id: string) => {
  if (confirm(t('common.confirm') + '?')) {
    tasksStore.deleteTask(id)
  }
}

// Page meta
useHead({
  title: 'ExamSprint - ' + t('nav.tasks'),
})
</script>
