<template>
  <UPopover :content="{ side: 'bottom', align: 'start' }">
    <UButton 
      color="neutral" 
      variant="outline" 
      icon="i-lucide-calendar"
      class="w-full justify-start"
    >
      {{ displayText }}
    </UButton>
    
    <template #content>
      <UCalendar v-model="calendarValue" class="p-2" />
    </template>
  </UPopover>
</template>

<script setup lang="ts">
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date'

interface Props {
  modelValue: string  // ISO date string: "2024-12-25" or ""
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const { t, locale } = useI18n()

// Date formatter
const df = computed(() => new DateFormatter(locale.value, { dateStyle: 'long' }))

// Parse YYYY-MM-DD string to CalendarDate
const parseModelValue = (): CalendarDate | undefined => {
  if (!props.modelValue) return undefined
  try {
    const parts = props.modelValue.split('-')
    if (parts.length === 3) {
      const [year, month, day] = parts.map(Number)
      if (year && month && day) {
        return new CalendarDate(year, month, day)
      }
    }
  } catch {
    // Invalid date
  }
  return undefined
}

// Two-way binding with CalendarDate
const calendarValue = computed({
  get: () => parseModelValue(),
  set: (val: CalendarDate | undefined) => {
    if (val) {
      const year = val.year
      const month = String(val.month).padStart(2, '0')
      const day = String(val.day).padStart(2, '0')
      emit('update:modelValue', `${year}-${month}-${day}`)
    } else {
      emit('update:modelValue', '')
    }
  }
})

// Display text
const displayText = computed(() => {
  const date = calendarValue.value
  if (!date) return props.placeholder || t('common.selectDate')
  try {
    return df.value.format(date.toDate(getLocalTimeZone()))
  } catch {
    return props.placeholder || t('common.selectDate')
  }
})
</script>
