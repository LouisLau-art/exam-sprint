<template>
  <aside class="w-20 lg:w-64 glass border-r border-white/10 dark:border-slate-700/50 flex flex-col py-6 shrink-0">
    <!-- Logo -->
    <div class="px-4 lg:px-6 mb-8">
      <NuxtLink to="/" class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex-center text-white text-xl font-bold shadow-lg shadow-primary-500/30">
          E
        </div>
        <span class="hidden lg:block text-xl font-bold text-gradient">
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
          'hover:bg-white/50 dark:hover:bg-slate-700/50',
          isActive(item.path) 
            ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400 font-medium' 
            : 'text-slate-600 dark:text-slate-400'
        ]"
      >
        <span :class="[item.icon, 'text-xl']" />
        <span class="hidden lg:block">{{ t(item.label) }}</span>
      </NuxtLink>
    </nav>
    
    <!-- Bottom: Today's Stats -->
    <div class="px-3 lg:px-4 mt-auto">
      <div class="glass-subtle rounded-xl p-3 lg:p-4">
        <div class="hidden lg:block text-xs text-slate-500 dark:text-slate-400 mb-2">
          {{ t('dashboard.todayProgress') }}
        </div>
        <div class="flex lg:flex-col items-center lg:items-start gap-2 lg:gap-1">
          <div class="flex items-center gap-2 text-sm">
            <span class="i-carbon-checkmark-filled text-green-500" />
            <span class="font-medium">{{ todayStats.tasks }}</span>
            <span class="hidden lg:inline text-slate-500 dark:text-slate-400">{{ t('stats.completedTasks') }}</span>
          </div>
          <div class="flex items-center gap-2 text-sm">
            <span class="i-carbon-timer text-primary-500" />
            <span class="font-medium">{{ todayStats.pomodoros }}</span>
            <span class="hidden lg:inline text-slate-500 dark:text-slate-400">🍅</span>
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
  { path: '/', icon: 'i-carbon-home', label: 'nav.home' },
  { path: '/tasks', icon: 'i-carbon-task', label: 'nav.tasks' },
  { path: '/goals', icon: 'i-carbon-target', label: 'nav.goals' },
  { path: '/stats', icon: 'i-carbon-chart-bar', label: 'nav.stats' },
]

const isActive = (path: string) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

const todayStats = computed(() => ({
  tasks: tasksStore.todayCompletedCount,
  pomodoros: pomodoroStore.todayPomodoroCount,
}))
</script>
