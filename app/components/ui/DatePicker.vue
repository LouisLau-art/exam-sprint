<template>
  <UPopover>
    <UButton 
      color="neutral" 
      variant="outline" 
      icon="i-lucide-calendar"
      class="w-full justify-start"
    >
      {{ displayValue }}
    </UButton>
    
    <template #content>
      <UCalendar v-model="calendarValue" class="p-2" />
    </template>
  </UPopover>
</template>

<script setup lang="ts">
import { CalendarDate, DateFormatter, getLocalTimeZone, parseDate } from '@internationalized/date'

interface Props {
  modelValue: string  // ISO date string: "2024-12-25"
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select date',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const { locale } = useI18n()

// Date formatter
const df = computed(() => new DateFormatter(locale.value, { dateStyle: 'medium' }))

// Convert string to CalendarDate and back
const calendarValue = computed({
  get: () => {
    if (!props.modelValue) return undefined
    try {
      return parseDate(props.modelValue)
    } catch {
      return undefined
    }
  },
  set: (val: CalendarDate | undefined) => {
    if (val) {
      // Convert CalendarDate to ISO string (YYYY-MM-DD)
      const year = val.year
      const month = String(val.month).padStart(2, '0')
      const day = String(val.day).padStart(2, '0')
      emit('update:modelValue', `${year}-${month}-${day}`)
    } else {
      emit('update:modelValue', '')
    }
  }
})

// Display formatted date
const displayValue = computed(() => {
  if (!calendarValue.value) return props.placeholder
  return df.value.format(calendarValue.value.toDate(getLocalTimeZone()))
})
</script>
