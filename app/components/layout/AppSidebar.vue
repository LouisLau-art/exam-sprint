<template>
  <aside class="w-20 lg:w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col py-6 shrink-0">
    <!-- Logo -->
    <div class="px-4 lg:px-6 mb-8">
      <NuxtLink to="/" class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xl font-bold shadow-lg">
          E
        </div>
        <span class="hidden lg:block text-xl font-bold bg-gradient-to-r from-primary-500 to-violet-500 bg-clip-text text-transparent">
          ExamSprint
        </span>
      </NuxtLink>
    </div>
    
    <!-- Navigation -->
    <nav class="flex-1 px-3 lg:px-4 space-y-2">
      <NuxtLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        :class="[
          'flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200',
          'hover:bg-gray-100 dark:hover:bg-gray-800',
          isActive(item.path) 
            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium' 
            : 'text-gray-600 dark:text-gray-400'
        ]"
      >
        <UIcon :name="item.icon" class="text-xl" />
        <span class="hidden lg:block">{{ t(item.label) }}</span>
      </NuxtLink>
    </nav>
    
    <!-- Bottom: Today's Stats -->
    <div class="px-3 lg:px-4 mt-auto">
      <div class="bg-gray-100 dark:bg-gray-800 rounded-xl p-3 lg:p-4">
        <div class="hidden lg:block text-xs text-gray-500 dark:text-gray-400 mb-2">
          {{ t('dashboard.todayProgress') }}
        </div>
        <div class="flex lg:flex-col items-center lg:items-start gap-2 lg:gap-1">
          <div class="flex items-center gap-2 text-sm">
            <UIcon name="i-lucide-check-circle" class="text-green-500" />
            <span class="font-medium">{{ todayStats.tasks }}</span>
            <span class="hidden lg:inline text-gray-500 dark:text-gray-400">{{ t('stats.completedTasks') }}</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <UIcon name="i-lucide-timer" class="text-primary-500" />
            <span class="font-medium">{{ todayStats.pomodoros }}</span>
            <span class="hidden lg:inline text-gray-500 dark:text-gray-400">🍅</span>
          </div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const tasksStore = useTasksStore()
const pomodoroStore = usePomodoroStore()

const navItems = [
  { path: '/', icon: 'i-lucide-home', label: 'nav.home' },
  { path: '/tasks', icon: 'i-lucide-list-todo', label: 'nav.tasks' },
  { path: '/goals', icon: 'i-lucide-target', label: 'nav.goals' },
  { path: '/stats', icon: 'i-lucide-bar-chart-3', label: 'nav.stats' },
]

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

const todayStats = computed(() => ({
  tasks: tasksStore.todayCompletedCount || 0,
  pomodoros: pomodoroStore.todayPomodoroCount || 0,
}))
</script>
