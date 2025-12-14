<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex-between">
      <h1 class="text-2xl font-bold text-slate-800 dark:text-slate-100">
        {{ t('goals.title') }}
      </h1>
      <UButton @click="showGoalModal = true">
        <span class="i-carbon-add mr-1" />
        {{ t('goals.addGoal') }}
      </UButton>
    </div>
    
    <!-- Goals Grid -->
    <div v-if="goalsStore.allGoals.length" class="grid md:grid-cols-2 gap-6">
      <div
        v-for="(goal, index) in goalsStore.allGoals"
        :key="goal.id"
        class="card group cursor-pointer hover:shadow-2xl transition-all"
        @click="editGoal(goal)"
      >
        <!-- Header -->
        <div class="flex-between mb-4">
          <div class="flex items-center gap-3">
            <div 
              class="w-4 h-4 rounded-full"
              :style="{ backgroundColor: getGoalColor(goal, index) }"
            />
            <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100">
              {{ goal.title }}
            </h3>
          </div>
          <UBadge :variant="goal.type === 'task-driven' ? 'primary' : 'warning'">
            {{ t(`goals.${goal.type === 'task-driven' ? 'taskDriven' : 'timeDriven'}`) }}
          </UBadge>
        </div>
        
        <!-- Description -->
        <p v-if="goal.description" class="text-sm text-slate-500 dark:text-slate-400 mb-4">
          {{ goal.description }}
        </p>
        
        <!-- Progress Circle -->
        <div class="flex items-center gap-6">
          <div class="relative w-20 h-20">
            <svg class="w-full h-full transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                stroke="currentColor"
                stroke-width="6"
                class="text-slate-200 dark:text-slate-700"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                fill="none"
                :stroke="getGoalColor(goal, index)"
                stroke-width="6"
                :stroke-dasharray="226.2"
                :stroke-dashoffset="226.2 - (getProgress(goal) / 100) * 226.2"
                stroke-linecap="round"
                class="transition-all duration-500"
              />
            </svg>
            <div class="absolute inset-0 flex-center">
              <span class="text-lg font-bold" :style="{ color: getGoalColor(goal, index) }">
                {{ getProgress(goal) }}%
              </span>
            </div>
          </div>
          
          <div class="flex-1">
            <div class="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1">
              {{ goal.current }} / {{ goal.target }}
            </div>
            <div class="text-sm text-slate-500 dark:text-slate-400">
              {{ goal.unit }}
            </div>
            <div v-if="goal.deadline" class="text-xs text-slate-400 mt-2 flex items-center gap-1">
              <span class="i-carbon-calendar" />
              {{ formatDate(goal.deadline) }}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Empty State -->
    <UCard v-else class="text-center py-12">
      <div class="i-carbon-target text-6xl text-slate-300 dark:text-slate-600 mb-4" />
      <p class="text-slate-500 dark:text-slate-400 mb-4">{{ t('goals.noGoals') }}</p>
      <UButton @click="showGoalModal = true">
        <span class="i-carbon-add mr-1" />
        {{ t('goals.addFirstGoal') }}
      </UButton>
    </UCard>
    
    <!-- Goal Modal -->
    <GoalModal 
      v-model="showGoalModal"
      :edit-goal="currentEditGoal"
      @saved="currentEditGoal = null"
    />
  </div>
</template>

<script setup lang="ts">



import GoalModal from '~/components/goals/GoalModal.vue'
import type { Goal } from '~/stores/goals'

const { t, locale } = useI18n()
const goalsStore = useGoalsStore()

const showGoalModal = ref(false)
const currentEditGoal = ref<Goal | null>(null)

const editGoal = (goal: Goal) => {
  currentEditGoal.value = goal
  showGoalModal.value = true
}

const getProgress = (goal: Goal) => {
  return Math.min(100, Math.round((goal.current / goal.target) * 100))
}

const goalColors = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6']

const getGoalColor = (goal: Goal, index: number) => {
  return goal.color || goalColors[index % goalColors.length]
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString(locale.value, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Page meta
useHead({
  title: 'ExamSprint - ' + t('nav.goals'),
})
</script>
