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
      <Card :title="t('stats.focusTrend')">
        <ClientOnly>
          <VueApexCharts
            type="area"
            height="250"
            :options="focusChartOptions"
            :series="focusSeries"
          />
        </ClientOnly>
      </Card>
      
      <!-- Task Completion Trend -->
      <Card :title="t('stats.taskTrend')">
        <ClientOnly>
          <VueApexCharts
            type="bar"
            height="250"
            :options="taskChartOptions"
            :series="taskSeries"
          />
        </ClientOnly>
      </Card>
    </div>
    
    <!-- Recent Sessions -->
    <Card :title="t('pomodoro.todayPomodoros')">
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
                {{ formatTime(session.startTime) }}
              </p>
            </div>
          </div>
          <Badge v-if="session.note" variant="default">
            {{ session.note }}
          </Badge>
        </div>
      </div>
      <p v-else class="text-center py-8 text-slate-500 dark:text-slate-400">
        {{ t('tasks.noTasks') }}
      </p>
    </Card>
  </div>
</template>

<script setup lang="ts">
import Card from '~/components/ui/Card.vue'
import Badge from '~/components/ui/Badge.vue'
import DailyStats from '~/components/dashboard/DailyStats.vue'

const { t, locale } = useI18n()
const pomodoroStore = usePomodoroStore()

// Chart component (client only)
const VueApexCharts = defineAsyncComponent(() => 
  import('vue3-apexcharts').then(m => m.default)
)

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

// Mock data for demo (in real app, would come from store)
const focusSeries = ref([
  {
    name: t('stats.focusMinutes'),
    data: [45, 75, 60, 90, 80, 120, pomodoroStore.todayFocusMinutes],
  },
])

const taskSeries = ref([
  {
    name: t('stats.completedTasks'),
    data: [3, 5, 4, 6, 5, 8, pomodoroStore.todayPomodoroCount],
  },
])

const chartTheme = computed(() => ({
  mode: 'light' as const,
  palette: 'palette1',
}))

const focusChartOptions = computed(() => ({
  chart: {
    id: 'focus-trend',
    toolbar: { show: false },
    background: 'transparent',
  },
  theme: chartTheme.value,
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
}))

const taskChartOptions = computed(() => ({
  chart: {
    id: 'task-trend',
    toolbar: { show: false },
    background: 'transparent',
  },
  theme: chartTheme.value,
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
}))

const recentSessions = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return pomodoroStore.state.sessions
    .filter(s => s.completed && s.type === 'focus' && s.startTime.startsWith(today))
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
