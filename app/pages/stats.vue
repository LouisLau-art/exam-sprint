<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex-between">
      <h1 class="text-2xl font-bold text-slate-800 dark:text-slate-100">
        {{ t('stats.title') }}
      </h1>
    </div>
    
    <!-- Daily Review -->
    <DailyStats />
    
    <!-- Charts Row -->
    <div class="grid lg:grid-cols-2 gap-6">
      <!-- Weekly Focus Trend -->
      <UCard :title="t('stats.focusTrend')">
        <ClientOnly>
          <div v-if="isClient">
            <VueApexCharts
              type="area"
              height="250"
              :options="focusChartOptions"
              :series="focusSeries"
            />
          </div>
          <template #fallback>
            <div class="h-64 flex-center text-slate-400">
              {{ t('common.loading') }}
            </div>
          </template>
        </ClientOnly>
      </UCard>
      
      <!-- Task Completion Trend -->
      <UCard :title="t('stats.taskTrend')">
        <ClientOnly>
          <div v-if="isClient">
            <VueApexCharts
              type="bar"
              height="250"
              :options="taskChartOptions"
              :series="taskSeries"
            />
          </div>
          <template #fallback>
            <div class="h-64 flex-center text-slate-400">
              {{ t('common.loading') }}
            </div>
          </template>
        </ClientOnly>
      </UCard>
    </div>
    
    <!-- Recent Sessions -->
    <UCard :title="t('pomodoro.todayPomodoros')">
      <div v-if="recentSessions.length" class="space-y-3">
        <div
          v-for="session in recentSessions"
          :key="session.id"
          class="glass-subtle rounded-xl p-3 flex-between"
        >
          <div class="flex items-center gap-3">
            <span class="text-xl">🍅</span>
            <div>
              <p class="font-medium text-slate-700 dark:text-slate-200">
                {{ session.duration }} {{ t('common.minutes') }}
              </p>
              <p class="text-xs text-slate-500">
                {{ formatTime(session.startedAt) }}
              </p>
            </div>
          </div>
          <UBadge v-if="session.note" variant="default">
            {{ session.note }}
          </UBadge>
        </div>
      </div>
      <p v-else class="text-center py-8 text-slate-500 dark:text-slate-400">
        {{ t('tasks.noTasks') }}
      </p>
    </UCard>
  </div>
</template>

<script setup lang="ts">


import DailyStats from '~/components/dashboard/DailyStats.vue'

const { t, locale } = useI18n()
const pomodoroStore = usePomodoroStore()

// Check if client-side
const isClient = ref(false)
onMounted(() => {
  isClient.value = true
})

// Chart component (client only) - lazy load
let VueApexCharts: any = null
if (import.meta.client) {
  VueApexCharts = defineAsyncComponent(() => 
    import('vue3-apexcharts').then(m => m.default)
  )
}

// Get last 7 days labels
const getLast7Days = () => {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    days.push(date.toLocaleDateString(locale.value, { weekday: 'short' }))
  }
  return days
}

// Calculate real weekly data from sessions
const getWeeklyFocusData = () => {
  const sessions = pomodoroStore.sessions || []
  const data: number[] = []
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    const dayMinutes = sessions
      .filter((s: any) => s.type === 'focus' && s.completedAt?.startsWith(dateStr))
      .reduce((sum: number, s: any) => sum + (s.duration || 0), 0)
    
    data.push(dayMinutes)
  }
  return data
}

const getWeeklyTaskData = () => {
  const sessions = pomodoroStore.sessions || []
  const data: number[] = []
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]
    
    const dayCount = sessions
      .filter((s: any) => s.type === 'focus' && s.completedAt?.startsWith(dateStr))
      .length
    
    data.push(dayCount)
  }
  return data
}

// Real data from store
const focusSeries = computed(() => [
  {
    name: t('stats.focusMinutes'),
    data: getWeeklyFocusData(),
  },
])

const taskSeries = computed(() => [
  {
    name: t('stats.completedTasks'),
    data: getWeeklyTaskData(),
  },
])

const focusChartOptions = computed(() => ({
  chart: {
    id: 'focus-trend',
    toolbar: { show: false },
    background: 'transparent',
  },
  colors: ['#6366f1'],
  stroke: { curve: 'smooth' as const, width: 3 },
  fill: {
    type: 'gradient',
    gradient: {
      shadeIntensity: 1,
      opacityFrom: 0.4,
      opacityTo: 0.1,
    },
  },
  xaxis: {
    categories: getLast7Days(),
    labels: { style: { colors: '#94a3b8' } },
  },
  yaxis: {
    labels: { style: { colors: '#94a3b8' } },
  },
  grid: {
    borderColor: '#e2e8f0',
    strokeDashArray: 4,
  },
  dataLabels: { enabled: false },
  tooltip: {
    theme: 'dark',
    style: {
      fontSize: '14px',
    },
  },
}))

const taskChartOptions = computed(() => ({
  chart: {
    id: 'task-trend',
    toolbar: { show: false },
    background: 'transparent',
  },
  colors: ['#22c55e'],
  plotOptions: {
    bar: {
      borderRadius: 6,
      columnWidth: '60%',
    },
  },
  xaxis: {
    categories: getLast7Days(),
    labels: { style: { colors: '#94a3b8' } },
  },
  yaxis: {
    labels: { style: { colors: '#94a3b8' } },
  },
  grid: {
    borderColor: '#e2e8f0',
    strokeDashArray: 4,
  },
  dataLabels: { enabled: false },
  tooltip: {
    theme: 'dark',
    style: {
      fontSize: '14px',
    },
  },
}))

const recentSessions = computed(() => {
  const sessions = pomodoroStore.sessions || []
  const today = new Date().toISOString().split('T')[0]
  return sessions
    .filter((s: any) => s.type === 'focus' && s.completedAt?.startsWith(today))
    .slice(-5)
    .reverse()
})

const formatTime = (isoString: string) => {
  return new Date(isoString).toLocaleTimeString(locale.value, {
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Page meta
useHead({
  title: 'ExamSprint - ' + t('nav.stats'),
})
</script>
