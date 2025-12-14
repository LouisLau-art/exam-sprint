<template>
  <div class="space-y-6">
    <!-- Welcome Message -->
    <div class="flex-between">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 dark:text-slate-100">
          {{ greeting }}, {{ t('dashboard.welcome') }}
        </h1>
        <p class="text-slate-500 dark:text-slate-400">
          {{ currentDate }}
        </p>
      </div>
    </div>
    
    <!-- Main Grid -->
    <div class="grid lg:grid-cols-2 gap-6">
      <!-- Left Column -->
      <div class="space-y-6">
        <!-- Countdown -->
        <CountdownCard />
        
        <!-- Milestones -->
        <Card>
          <MilestoneList />
        </Card>
      </div>
      
      <!-- Right Column -->
      <div class="space-y-6">
        <!-- Pomodoro Timer -->
        <PomodoroTimer />
        
        <!-- Daily Stats -->
        <DailyStats />
      </div>
    </div>
    
    <!-- Today's Tasks -->
    <Card>
      <template #header>
        <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100">
          {{ t('tasks.todayTasks') }}
        </h3>
        <Button size="sm" @click="showTaskModal = true">
          <span class="i-carbon-add mr-1" />
          {{ t('tasks.addTask') }}
        </Button>
      </template>
      
      <TaskList 
        :tasks="tasksStore.todayTasks"
        @add="showTaskModal = true"
        @edit="editTask"
        @delete="deleteTask"
      />
    </Card>
    
    <!-- Task Modal -->
    <TaskModal 
      v-model="showTaskModal"
      :edit-task="currentEditTask"
      @saved="currentEditTask = null"
    />
  </div>
</template>

<script setup lang="ts">
import Card from '~/components/ui/Card.vue'
import Button from '~/components/ui/Button.vue'
import CountdownCard from '~/components/countdown/CountdownCard.vue'
import MilestoneList from '~/components/countdown/MilestoneList.vue'
import PomodoroTimer from '~/components/pomodoro/PomodoroTimer.vue'
import DailyStats from '~/components/dashboard/DailyStats.vue'
import TaskList from '~/components/tasks/TaskList.vue'
import TaskModal from '~/components/tasks/TaskModal.vue'
import type { Task } from '~/stores/tasks'

const { t, locale } = useI18n()
const tasksStore = useTasksStore()

// Greeting based on time
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return locale.value === 'zh-CN' ? '早上好' : 'Good morning'
  if (hour < 18) return locale.value === 'zh-CN' ? '下午好' : 'Good afternoon'
  return locale.value === 'zh-CN' ? '晚上好' : 'Good evening'
})

const currentDate = computed(() => {
  return new Date().toLocaleDateString(locale.value, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})

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
  title: 'ExamSprint - ' + t('nav.home'),
})
</script>
