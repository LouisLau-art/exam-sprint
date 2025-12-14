<template>
  <Card class="relative overflow-hidden">
    <template #header>
      <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100">
        {{ t('goals.title') }}
      </h3>
      <Button size="sm" @click="$emit('add')">
        <span class="i-carbon-add mr-1" />
        {{ t('goals.addGoal') }}
      </Button>
    </template>
    
    <div v-if="!goals.length" class="text-center py-8">
      <div class="i-carbon-target text-4xl text-slate-300 dark:text-slate-600 mb-4" />
      <p class="text-slate-500 dark:text-slate-400">{{ t('goals.noGoals') }}</p>
    </div>
    
    <div v-else class="space-y-4">
      <div
        v-for="goal in goals"
        :key="goal.id"
        class="glass-subtle rounded-xl p-4 group"
      >
        <div class="flex-between mb-3">
          <div class="flex items-center gap-2">
            <div 
              class="w-3 h-3 rounded-full"
              :style="{ backgroundColor: goal.color }"
            />
            <span class="font-medium text-slate-800 dark:text-slate-100">{{ goal.title }}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium" :style="{ color: goal.color }">
              {{ Math.round((goal.current / goal.target) * 100) }}%
            </span>
            <button
              @click="$emit('edit', goal)"
              class="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-slate-600 transition-all"
            >
              <span class="i-carbon-edit" />
            </button>
          </div>
        </div>
        
        <!-- Progress Bar -->
        <div class="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div 
            class="h-full rounded-full transition-all duration-500"
            :style="{ 
              width: `${Math.min(100, (goal.current / goal.target) * 100)}%`,
              backgroundColor: goal.color 
            }"
          />
        </div>
        
        <div class="flex-between mt-2 text-xs text-slate-500 dark:text-slate-400">
          <span>{{ goal.current }} / {{ goal.target }} {{ goal.unit }}</span>
          <span v-if="goal.deadline">
            {{ t('goals.deadline') }}: {{ formatDate(goal.deadline) }}
          </span>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import Card from '~/components/ui/Card.vue'
import Button from '~/components/ui/Button.vue'
import type { Goal } from '~/stores/goals'

interface Props {
  goals: Goal[]
}

defineProps<Props>()

defineEmits<{
  add: []
  edit: [goal: Goal]
}>()

const { t, locale } = useI18n()

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString(locale.value, { month: 'short', day: 'numeric' })
}
</script>
